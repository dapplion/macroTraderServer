

module.exports = function (bittrex, market, callback) {
  console.log('Called open orders for '+market)
  bittrex.marketGetOpenOrders(market).then((openOrders) => {
    bittrex.publicGetTicker(market).then((ticker) => {
      handleOpenOrders(openOrders, ticker, market, callback);
    })
  }).catch((err) => {
    console.log(JSON.stringify(err))
  });
}

function handleOpenOrders(openOrders, ticker, market, callback) {
  if (!openOrders.success || !ticker.success) {
    return;
  }
  let lastRate = ticker.result.Last;
  let dataframeBuy = [];
  let dataframeSell = [];
  openOrders.result.forEach(function(openOrder) {
    // let percentage = openOrder.Limit/percentage
    let rateRelative = openOrder.Limit/lastRate-1;
    let obj = {
      amount: openOrder.Quantity,
      rate: openOrder.Limit,
      rateRelative: rateRelative
    };
    if (openOrder.OrderType.includes('SELL')) {
      dataframeSell.push(obj);
    } else {
      dataframeBuy.push(obj);
    }
  });
  // Normalize buy amount
  normalizeAmount(dataframeBuy);
  normalizeAmount(dataframeSell);
  // Sort dataframes
  dataframeSell.sort(compare);
  dataframeBuy.sort(compare);
  // Send dataframes to UI
  callback({
    buy: dataframeBuy,
    sell: dataframeSell,
    market: market
  });
}

// UTILITIES

function normalizeAmount(arrayOrders) {
  let amountSum = 0;
  // Compute sum
  arrayOrders.forEach(function(order) {
    amountSum += order.amount;
  });
  // Normalize
  arrayOrders.forEach(function(order) {
     order.amountNorm = order.amount/amountSum;
  });
}

function compare(orderA,orderB) {
  if (orderA.rate < orderB.rate)
    return -1;
  if (orderA.rate > orderB.rate)
    return 1;
  return 0;
}
