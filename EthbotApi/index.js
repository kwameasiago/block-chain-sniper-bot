const express = require('express')
const moment = require('moment')
const ethers = require('ethers');
const mail = require('./mail.js')
const app = express()
const port = 8080
const {sendMail} = mail

app.get('/', async (req, res) => {
  const {query} = req;
  console.log(req.query.mnenomics === 'null')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Access-Control-Allow-Origin', '*')
  //   res.send('Hello World!')
  console.log('new sse event triggered ', mail)

  const addresses = {
    WETH: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    recipient: query.recipient  === 'null'?'': query.recipient
  }

  const mnemonic = query.mnenomics  === 'null'? '': query.mnenomics;

  const provider = new ethers.providers.WebSocketProvider('https://bsc.getblock.io/?api_key=cb2d0253-6558-4125-a775-79504dddfcea');
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const account = wallet.connect(provider);
  const factory = new ethers.Contract(
    addresses.factory,
    [
      'event PairCreated(address indexed token0, address indexed token1, address pair, uint)'
    ],
    account
  );
  const router = new ethers.Contract(
    addresses.router,
    [
      // 'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      // 'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    account
  );

  factory.on("error", (tx) => {
    // Emitted when any error occurs
    console.log('error occured')
    res.end()
});
  let count = 0;
  let round = 1;

  factory.on('PairCreated', async (token0, token1, pairAddress) => {
    console.log(`
        New pair detected
        =================
        token0: ${token0}
        token1: ${token1}
        pairAddress: ${pairAddress}
      `);

    let data = {
      token0: token0,
      token1: token1,
      pairAddress: pairAddress,
      time: moment().format('MMMM. D, YYYY [at] h:mm ss A z')
    }
    res.write(`data: ${JSON.stringify(data)} \n\n`)
    sendMail(
      `
        <h1>New pair detected \n </h1>
        <p> =================\n </p>
        <p>token0: ${token0}\n </p>
        <p>token1: ${token1}\n </p>
        <p> pairAddress: ${pairAddress}\n </p>
        <p>time: ${moment().format('MMMM. D, YYYY [at] h:mm ss A z')}
      `
    )
    .catch(err => console.log(err))

  });

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})