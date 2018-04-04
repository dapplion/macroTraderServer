const csv=require('csvtojson')

function normalizeAmount(arrayOrders) {
  let amountSum = 0;
  // Compute sum
  arrayOrders.forEach(function(order) {
    amountSum += order.amount;
  });
  // Normalize
  arrayOrders.forEach(function(order) {
     order.amount = order.amount/amountSum;
  });
}

function loadStraddle(csvFilePath) {
  return new Promise(resolve => {
    let buy = []
    let sell = []
    csv()
    .fromFile(csvFilePath)
    .on('json',(row)=>{
      if (row.buy_amount && row.buy_amount != 0) {
        buy.push({
          amount: parseFloat(row.buy_amount),
          rate: parseFloat(row.buy_rate) / 100.0
        })
      }
      if (row.sell_amount && row.sell_amount != 0) {
        sell.push({
          amount: parseFloat(row.sell_amount),
          rate: parseFloat(row.sell_rate) / 100.0
        })
      }
    })
    .on('done',(error)=>{
      // Now, normalize the amounts
      normalizeAmount(buy)
      normalizeAmount(sell)
      let straddle = {buy: buy, sell: sell}
      resolve(straddle);
      // setTimeout(function(){ console.log(JSON.stringify(straddle)) }, 2000);
    })
  });
}
//

module.exports = function (straddles, straddleNames) {
    straddleNames.forEach(async function(straddleName) {
      let csvFilePath='./straddles/'+straddleName+'.csv'
      straddles[straddleName] = await loadStraddle(csvFilePath);
    });
  }
