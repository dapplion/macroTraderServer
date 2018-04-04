
module.exports = function (bittrex, market, tradeList, callback) {
  tradeList.buy.forEach(function(order) {
    // order.amount / .rate
    console.log('Executing BUY order for '+tradeList.market+' amount '+order.amount+' rate '+order.rate)
    order.status = 'Pending'
    bittrex.marketBuyLimit(market, order.amount, order.rate).then((response) => {
      if (response.success) {
        order.status = 'Success';
      } else {
        order.status = 'Error '+response.message;
        order.msg = response.message;
      }
      callback(tradeList)
    }).catch((error) => {
      order.status = 'Error'
      order.msg = JSON.stringify(error)
      callback(tradeList)
    });
  })

  tradeList.sell.forEach(function(order) {
    console.log('Executing SELL order for '+tradeList.market+' amount '+order.amount+' rate '+order.rate)
    order.status = 'Pending'
    bittrex.marketSellLimit(market, order.amount, order.rate).then((response) => {
      console.log('Sell result ',JSON.stringify(response))
      if (response.success) {
        order.status = 'Success'
      } else {
        order.status = 'Error '+response.message
        order.msg = response.message
      }
      callback(tradeList)
    }).catch((error) => {
      order.status = 'Error'
      order.msg = JSON.stringify(error)
      callback(tradeList)
    });
  })
}
