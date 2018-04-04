var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let Bittrex = require('bittrex-wrapper');

// Load the user database
var Datastore = require('nedb')
var userDatabase = new Datastore({ filename: 'userDatabase.js' });

// LOAD AND GENERATE THE STRADDLE OBJECT
let straddleIds = [
  'normal_straddle',
  'aggressive_buying',
  'relaxed_buying'
]
let straddles = {}
var generateStraddles = require('./readStraddle')
generateStraddles(straddles, straddleIds)

app.use(express.static('public'));

function addUserToDatabase() {
  var user = {
    user: 'world'
    , cipher: 'nann34rn3ij4n3j4intij34ntijn34t'
  };

  userDatabase.insert(user, function (err, newUser) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
  });
}

// Constructor
var GetInfoLoop = require('./orderHandlers/getInfoLoop')
var cancelOrders = require('./orderHandlers/cancelOrders')
var executeOrders = require('./orderHandlers/executeOrders')
var computeOrders = require('./orderHandlers/computeOrders')

function setupBittrexAPIcalls(socket) {
  let getInfoLoop = new GetInfoLoop(socket)
  getInfoLoop.startLoop();

  // GET MARKET TICKER
  socket.on('getMarket', function(market){
    console.log('RECEIVED market',market)
    getInfoLoop.scheduleMarket(market);
  });

  // GET PREVIEW TRADES
  socket.on('computeOrders', function(options){
    console.log(options)
    // options.market, straddleId, amount
    let bittrex = socket.bittrex || new Bittrex();
    bittrex.publicGetTicker(options.market).then((ticker) => {
      computeOrders(
        straddles[options.straddleId],
        ticker.result.Last,
        options.buyAmount,
        options.sellAmount,
        options.market
      )
      .then((tradeList) => {
        socket.emit('previewOrders', tradeList);
      })
    })
  });

  // FIRE ORDERS
  socket.on('fireOrders', function(options){
    console.log(options)
    // options.market, straddleId, amount
    let bittrex = socket.bittrex || new Bittrex();
    bittrex.publicGetTicker(options.market).then((ticker) => {
      computeOrders(
        straddles[options.straddleId],
        ticker.result.Last,
        options.buyAmount,
        options.sellAmount,
        options.market)
      .then((tradeList) => {
        executeOrders(bittrex, options.market, tradeList, function(tradeList){
          socket.emit('previewOrders', tradeList);
          getInfoLoop.scheduleMarket(options.market);
        })
        // execute orders
      })
    })
  });

  // CANCEL ORDERS
  socket.on('cancelOrders', function(market){
    let bittrex = socket.bittrex || new Bittrex()
    cancelOrders(bittrex, market, function(market){
      getInfoLoop.scheduleMarket(market);
    })
  });
}

io.on('connection', function(socket){
  // Connectivity messages
  console.log('a user connected: '+socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected '+socket.id);
  });

  // Authenticate bittrex
  // ############
  let authenticated = false;
  socket.on('getUsers', function(){
    userDatabase.loadDatabase(function (err) {    // Callback is optional

    });
  });

  socket.on('addUser', function(){
    addUserToDatabase()
  });

  // Create a fallback bittrex object
  socket.on('signIn', function(userCredentials){
    let bittrex = socket.bittrex || new Bittrex()
    console.log(userCredentials)
    let bittrexAttempt = new Bittrex(userCredentials.Key, userCredentials.Secret);
    bittrexAttempt.accountGetBalances().then((res) => {
      socket.emit('signInResponse', res);
      if (res.success) {
        console.log('USER AUTHORIZED - '+socket.id)
        socket.bittrex = bittrexAttempt;
      } else {
        console.log('USER NOT AUTHORIZED (success false) - '+socket.id)
      }
    }).catch((err) => {
      socket.emit('signInResponse', err);
      console.log('USER NOT AUTHORIZED (ERROR) '+JSON.stringify(err)+' - '+socket.id)
    });
  });

  setupBittrexAPIcalls(socket);

  // GET MARKETS METADATA
  socket.on('getMarketList', function(){
    let bittrex = socket.bittrex || new Bittrex()
    bittrex.publicGetMarketSummaries().then((res) => {
      let marketList = [];
      let marketChange = {};
      if (res.success) {
        res.result.forEach(function(market) {
          let change = parseFloat(market.Last)/parseFloat(market.PrevDay)-1;
          change = Math.floor(change*1000)/10;
          marketList.push(market.MarketName);
          marketChange[market.MarketName] = change;
        });
        io.emit('marketList', {
          name: marketList,
          change: marketChange
        });
      } else {
        io.emit('marketList', false);
      }
    }).catch((err) => {
      console.log(err)
      io.emit('log', JSON.stringify(err));
    });
  });

  // GET STRADDLES DATA
  socket.on('getStraddles', function(){
    let straddleNames = [];
    straddleIds.forEach(function(straddleId) {
      straddleNames.push({
        id: straddleId,
        name: capitalizeFirstLetter(straddleId.replace("_", " "))
      })
    });
    io.emit('straddles', straddleNames);
  });

  // END
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});

// ###########
// Utilitites
// ###########

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
