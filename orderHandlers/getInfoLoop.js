let Bittrex = require('bittrex-wrapper');

var getOpenOrders = require('./getOpenOrders')
var getBalances = require('./getBalances')
var getTicker = require('./getTicker')

// Throttle getOpenOrderCalls
// When someone calls it, add a object key
function infoLoop(socket) {
  this.scheduledMarkets = {}
  this.startLoop = function() {
    let _this = this;
    setInterval(function(){
      let now = Date.now();
      for (var market in _this.scheduledMarkets) {
        if (_this.scheduledMarkets.hasOwnProperty(market)
        && now - _this.scheduledMarkets[market] < 5000) {
          // Execute the recurring calls
          let bittrex = socket.bittrex || new Bittrex()
          getOpenOrders(bittrex, market, function(res){
            socket.emit('openOrders', res);
          })
          getBalances(bittrex, market, function(res){
            socket.emit('balance', res);
          })
          getTicker(bittrex, market, function(res){
            socket.emit('ticker', res);
          })
        }
      }
    }, 1000);
  }
  this.scheduleMarket = function(market) {
    // getOpenOrders.scheduleMarket('BTC-LTC')
    this.scheduledMarkets[market] = Date.now();
  }
}

module.exports = infoLoop;
