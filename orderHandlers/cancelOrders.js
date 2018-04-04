
module.exports = function (bittrex, market, callback) {
  console.log('cancelOrders for ',market)
  bittrex.marketGetOpenOrders(market).then((res) => {
    if (res.success) {
      res.result.forEach(function(openOrder) {
        bittrex.marketCancel(openOrder.OrderUuid).then((response) => {
          callback(market);
        }).catch((error) => {
          console.log(error);
        });
      });
    } else {
      console.log('ERROR fetching orders')
    }
  }).catch((err) => {
    console.log('ERROR fetching orders')
  });
}
