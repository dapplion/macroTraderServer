module.exports = function (bittrex, market, callback) {
  let coins = market.split('-');
  coins.forEach(function(coin) {
    bittrex.accountGetBalance(coin).then((res) => {
      callback(res)
    }).catch((err) => {
      console.log(JSON.stringify(err));
    });
  });
}
