const Bittrex = require('bittrex-wrapper');
const credentials = {
  Key: "4c294b8570334ff0802aa4b5ecf7de52",
  Secret: "19979712c8374a9f87587e78ede83635"
}

const bittrex = new Bittrex(credentials.Key, credentials.Secret);

bittrex.publicGetTicker('BTC-LTC').then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});

bittrex.accountGetBalances().then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
