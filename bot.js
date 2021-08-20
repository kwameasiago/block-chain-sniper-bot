const ethers = require('ethers');
const readline = require('readline')


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let webSocketUrl = '';
let recipient = '';
let mnemonicItem = '';
let wbnb = '';
let factory = '';
let router = '';
let proceed = false;

const question1 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Input the web socket url? ', (answer) => {
      webSocketUrl = answer
      resolve()
    })
  })
}

const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Input the recipient of the profit here? ', (answer) => {
      recipient = answer
      resolve()
    })
  })
}


const question3 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Input the  mnemonics? ', (answer) => {
      mnemonicItem = answer
      resolve()
    })
  })
}

const question4 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Input the  router? ', (answer) => {
      router = answer
      resolve()
    })
  })
}

const question5 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Input the  factory? ', (answer) => {
      factory = answer
      resolve()
    })
  })
}

const question6 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Input the  wbnb? ', (answer) => {
      wbnb = answer
      resolve()
    })
  })
}

const question7 = () => {
  return new Promise((resolve, reject) => {
    console.log('\n')
    console.log('***********************input list*********************************')
    console.log('WBNB-', wbnb)
    console.log('webSocketUrl-', webSocketUrl)
    console.log('mnenomics', mnemonicItem)
    console.log('factory-', factory)
    console.log('router-', router)
    console.log('recipient-', recipient)
    console.log('***********************input list*********************************')

    rl.question('Proceed with application (y|n)? ', (answer) => {
      if(answer === 'y'){
        proceed = true
      }else{
        proceed = false
      }
      resolve()
    })
  })
}



const bot = (wbnbItem, factoryItem, routerItem, recipientItem) => {
  
  const addresses = {
    WBNB: wbnbItem,
    factory: factoryItem,
    router:routerItem,
    recipient: recipientItem
  }
  
  //First address of this mnemonic must have enough BNB to pay for tx fess
  const mnemonic = mnemonicItem;
  
  const provider = new ethers.providers.WebSocketProvider('https://apis.ankr.com/9902c212a4194c038a714174472c355f/0b32ae81187f2331df795060e135c75a/eth/fast/main');
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const account = wallet.connect(provider);
  const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
  );
  const router = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    account
  );
  
  const wbnb = new ethers.Contract(
    addresses.WBNB,
    [
      'function approve(address spender, uint amount) public returns(bool)',
    ],
    account
  );
  
  const init = async () => {
    const tx = await wbnb.approve(
      router.address,
      'replace by amount covering several trades'
    );
    const receipt = await tx.wait();
    console.log('Transaction receipt');
    console.log(receipt);
  }
  
  factory.on('PairCreated', async (token0, token1, pairAddress) => {
    console.log(`
      New pair detected
      =================
      token0: ${token0}
      token1: ${token1}
      pairAddress: ${pairAddress}
    `);
  
    //The quote currency needs to be WBNB (we will pay with WBNB)
    let tokenIn, tokenOut;
    if (token0 === addresses.WBNB) {
      tokenIn = token0;
      tokenOut = token1;
    }
  
    if (token1 == addresses.WBNB) {
      tokenIn = token1;
      tokenOut = token0;
    }
  
    //The quote currency is not WBNB
    if (typeof tokenIn === 'undefined') {
      return;
    }
  });
  
  init();
  
}


const questions = async () => {
  try {
    await question1()
  await question2()
  await question3()
  await question4()
  await question5()
  await question6()
  await question7()
  if(proceed){
    bot(wbnb, factory, router, recipient)
  }
  rl.close()
  } catch (error) {
    console.log('********************************************************')
    console.log(error)
    console.log('********************************************************')

  }
  
}
questions()