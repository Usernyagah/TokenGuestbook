const { 
  broadcastTransaction, 
  makeContractCall,
  principalCV,
  uintCV,
  AnchorMode,
} = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');

const MNEMONIC = 'describe humble talent oven exercise earth miracle light master position defy wool pioneer inhale boss jeans situate humor health dilemma loan rack garage drift';
const DEPLOYER_CONTRACT_ADDRESS = 'ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F';
const TARGET_ADDRESS = process.argv[2] || 'ST2C947592C8D33GE30PYAC71B4CD6QFR8G1EEKMS';
const AMOUNT = 100n;

async function mintTokens() {
  console.log(`🪙 Minting ${AMOUNT} ACCESS tokens to ${TARGET_ADDRESS}...`);

  const wallet = await generateWallet({
    secretKey: MNEMONIC,
    password: ''
  });
  const privateKey = wallet.accounts[0].stxPrivateKey;

  const network = new StacksTestnet({ url: 'https://api.testnet.hiro.so' });

  const tx = await makeContractCall({
    contractAddress: DEPLOYER_CONTRACT_ADDRESS,
    contractName: 'access-token',
    functionName: 'mint',
    functionArgs: [uintCV(AMOUNT), principalCV(TARGET_ADDRESS)],
    senderKey: privateKey,
    network,
    anchorMode: AnchorMode.Any,
    fee: 30000n,
  });

  const result = await broadcastTransaction(tx, network);
  console.log('Result:', result);
  if (result.txid) {
    console.log(`✅ Success! Mint transaction broadcasted with TxID: 0x${result.txid}`);
    console.log(`🔗 Explorer: https://explorer.hiro.so/txid/0x${result.txid}?chain=testnet`);
  }
}

mintTokens().catch(console.error);
