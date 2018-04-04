
module.exports = function (straddle, ticker, buyAmount, sellAmount, market) {
  // BUYS
  return new Promise(resolve => {
    let tradeList = {buy: [], sell: [], market: market}
    straddle.buy.forEach(function(tradeRelativeData) {
      tradeList.buy.push({
        amount: buyAmount * tradeRelativeData.amount,
        rate: ticker * (1 + tradeRelativeData.rate),
        amountNorm: tradeRelativeData.amount,
        rateRelative: tradeRelativeData.rate,
        status: '-'
      })
    });
    straddle.sell.forEach(function(tradeRelativeData) {
      tradeList.sell.push({
        amount: sellAmount * tradeRelativeData.amount,
        rate: ticker * (1 + tradeRelativeData.rate),
        amountNorm: tradeRelativeData.amount,
        rateRelative: tradeRelativeData.rate,
        status: '-'
      })
    });
    console.log('computeTrades', tradeList.market)
    resolve(tradeList)
  });
}
