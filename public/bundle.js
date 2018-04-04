$(function () {
  // Setup websockets
  var socket = io();
  // Setup market
  var balances = {};
  $( "#mySelect" ).change(function() {
    let market = $( "#mySelect option:selected" ).text();
    socket.emit('getMarket', market);
  });

  // Bind links
  $('#market').submit(function(){
    let market = $( "#mySelect option:selected" ).text();
    socket.emit('getMarket', market);
    return false;
  });
  $('#getOrders').submit(function(){
    let market = $( "#mySelect option:selected" ).text();
    socket.emit('getMarket', market);
    return false;
  });
  $('#cancelOrders').submit(function(){
    let market = $( "#mySelect option:selected" ).text();
    socket.emit('cancelOrders', market);
    return false;
  });
  $('#placeOrders').submit(function(){
    let market = $( "#mySelect option:selected" ).text();
    socket.emit('placeOrders', market);
    return false;
  });
  socket.on('log', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on('ticker', function(res){
    if (res.success) {
      $('#ticker').text('Last: '+res.result.Last);
    } else {
      $('#messages').append($('<li>').text('Error requesting ticker'));
    }

    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on('balance', function(res){
    if (res.success) {
      balances[res.result.Currency] = res.result.Available;
      $('#balance').text(JSON.stringify(balances));
    } else {
      $('#messages').append($('<li>').text('Error requesting ticker'));
    }
  });
  socket.on('openOrders', function(res){
    // Reset
    $('#openBuys').text('');
    $('#openSells').text('');
    // split
    console.log(res)

    res.buy.forEach(function(order) {
      // let percentage = openOrder.Limit/percentage
      let amount = order.amount+' ('+Math.round(order.amountNorm * 100)+'%)';
      let rate = order.rate+' ('+Math.round(order.rateRelative * 100)+'%)';
      let msg = '<strong>amount </strong>'+amount+'<strong> rate </strong>'+rate;
      $('#openBuys').append($('<li>').html(msg));
    });
    res.sell.forEach(function(order) {
      // let percentage = openOrder.Limit/percentage
      let amount = order.amount+' ('+Math.round(order.amountNorm * 100)+'%)';
      let rate = order.rate+' (+'+Math.round(order.rateRelative * 100)+'%)';
      let msg = '<strong>amount </strong>'+amount+'<strong> rate </strong>'+rate;
      $('#openSells').append($('<li>').html(msg));
    });

  });
});
