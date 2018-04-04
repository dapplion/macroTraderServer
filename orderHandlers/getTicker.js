module.exports = function (bittrex, market, callback) {
  bittrex.publicGetTicker(market).then((res) => {
    res.market = market
    callback(res)
  }).catch((err) => {
    console.log(err)
  });
}
