const { 
  broadcastTransaction, 
  makeContractDeploy,
  makeContractCall,
  principalCV,
  ClarityType
} = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');
const path = require('path');

// Configuration
const MNEMONIC = 'describe humble talent oven exercise earth miracle light master position defy wool pioneer inhale boss jeans situate humor health dilemma loan rack garage drift';
const DEPLOYER_ADDRESS = 'ST2C947592C8D33GE30PYAC71B4CD6QFR8G1EEKMS';
const NETWORK = new StacksTestnet();

// Contract paths - use absolute paths for WSL compatibility
const ACCESS_TOKEN_CONTRACT = path.join(__dirname, 'contracts', 'access-token.clar');
const GUESTBOOK_CONTRACT = path.join(__dirname, 'contracts', 'guestbook-v2.clar');

async function readContractFile(filePath) {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  // Remove any BOM or non-ASCII characters
  return content.replace(/^\uFEFF/, '').replace(/[^\x00-\x7F]/g, '');
}

async function getPrivateKeyFromMnemonic(mnemonic) {
  try {
    console.log('🔐 Deriving private key from mnemonic...');
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: ''
    });
    const privateKey = wallet.accounts[0].stxPrivateKey;
    console.log('✅ Private key derived successfully');
    console.log(`🔑 Private key format: ${privateKey.substring(0, 10)}...`);
    return privateKey;
  } catch (error) {
    console.error('❌ Key derivation failed:', error.message);
    throw error;
  }
}

async function deployContract(contractName, contractPath) {
  console.log(`📦 Deploying ${contractName}...`);
  
  try {
    const contractCode = await readContractFile(contractPath);
    const privateKey = await getPrivateKeyFromMnemonic(MNEMONIC);
    
    console.log(`📄 Contract code length: ${contractCode.length} characters`);
    
    const transaction = await makeContractDeploy({
      contractName: contractName,
      codeBody: contractCode,
      senderKey: privateKey,
      network: NETWORK,
      fee: 50000n, // Set manual fee to avoid estimation issues
    });

    console.log(`📋 Transaction created for ${contractName}`);
    console.log(`🔗 Transaction ID: ${transaction.txid().toString('hex')}`);
    
    const result = await broadcastTransaction(transaction, NETWORK);
    console.log(`✅ ${contractName} deployed successfully!`);
    console.log(`📍 Contract Address: ${DEPLOYER_ADDRESS}.${contractName}`);
    console.log(`🔗 Tx ID: ${result.txId}`);
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    console.error(`🔍 Error details:`, error);
    throw error;
  }
}

async function configureGuestbook(tokenContractAddress) {
  console.log('🔧 Configuring guestbook with token contract...');
  
  try {
    const privateKey = await getPrivateKeyFromMnemonic(MNEMONIC);
    
    const transaction = await makeContractCall({
      contractAddress: DEPLOYER_ADDRESS,
      contractName: 'guestbook-v2',
      functionName: 'set-token-contract',
      functionArgs: [principalCV(tokenContractAddress)],
      senderKey: privateKey,
      network: NETWORK,
      fee: 10000n, // Set manual fee
    });

    const result = await broadcastTransaction(transaction, NETWORK);
    console.log('✅ Guestbook configured successfully!');
    console.log(`🔗 Tx ID: ${result.txId}`);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to configure guestbook:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting testnet deployment...');
  console.log(`👤 Deployer: ${DEPLOYER_ADDRESS}`);
  console.log(`🌐 Network: Testnet`);
  console.log(`📁 Working directory: ${__dirname}`);
  console.log('');

  const fs = require('fs');
  
  // Check if contract files exist
  if (!fs.existsSync(ACCESS_TOKEN_CONTRACT)) {
    console.error(`❌ Access token contract not found: ${ACCESS_TOKEN_CONTRACT}`);
    process.exit(1);
  }
  if (!fs.existsSync(GUESTBOOK_CONTRACT)) {
    console.error(`❌ Guestbook contract not found: ${GUESTBOOK_CONTRACT}`);
    process.exit(1);
  }

  try {
    // Deploy Access Token
    const tokenResult = await deployContract('access-token', ACCESS_TOKEN_CONTRACT);
    const tokenContractAddress = `${DEPLOYER_ADDRESS}.access-token`;
    
    console.log('');
    console.log('⏳ Waiting for token contract confirmation...');
    await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
    
    // Deploy Guestbook
    const guestbookResult = await deployContract('guestbook-v2', GUESTBOOK_CONTRACT);
    
    console.log('');
    console.log('⏳ Waiting for guestbook contract confirmation...');
    await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
    
    // Configure Guestbook
    await configureGuestbook(tokenContractAddress);
    
    console.log('');
    console.log('🎉 Deployment complete!');
    console.log('');
    console.log('📋 Contract Addresses:');
    console.log(`   Access Token: ${tokenContractAddress}`);
    console.log(`   Guestbook: ${DEPLOYER_ADDRESS}.guestbook-v2`);
    console.log('');
    console.log('🔗 View on Explorer:');
    console.log(`   https://testnet.explorer.stacks.co/address/${DEPLOYER_ADDRESS}`);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

main();
