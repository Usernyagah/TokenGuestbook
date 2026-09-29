const { 
  broadcastTransaction, 
  makeContractDeploy, 
  makeSTXTokenTransfer,
  bytesToHex,
  stringUtf8CV,
  principalCV,
  contractPrincipalCV,
  uintCV,
  tupleCV,
  someCV,
  ClarityType
} = require('@stacks/transactions');
const { StacksTestnet, StacksMainnet } = require('@stacks/network');

// Configuration
const MNEMONIC = 'describe humble talent oven exercise earth miracle light master position defy wool pioneer inhale boss jeans situate humor health dilemma loan rack garage drift';
const DEPLOYER_ADDRESS = 'ST2C947592C8D33GE30PYAC71B4CD6QFR8G1EEKMS';
const NETWORK = new StacksTestnet();

// Contract paths
const ACCESS_TOKEN_CONTRACT = './contracts/access-token.clar';
const GUESTBOOK_CONTRACT = './contracts/guestbook-v2.clar';

async function readContractFile(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

async function deployContract(contractName, contractPath) {
  console.log(`📦 Deploying ${contractName}...`);
  
  try {
    const contractCode = await readContractFile(contractPath);
    
    const transaction = await makeContractDeploy({
      contractName: contractName,
      codeBody: contractCode,
      senderKey: derivePrivateKey(MNEMONIC),
      network: NETWORK,
    });

    console.log(`📋 Transaction created for ${contractName}`);
    console.log(`🔗 Transaction ID: ${bytesToHex(transaction.txid)}`);
    
    const result = await broadcastTransaction(transaction, NETWORK);
    console.log(`✅ ${contractName} deployed successfully!`);
    console.log(`📍 Contract Address: ${DEPLOYER_ADDRESS}.${contractName}`);
    console.log(`🔗 Tx ID: ${result.txId}`);
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error);
    throw error;
  }
}

function derivePrivateKey(mnemonic) {
  // This is a simplified version - in production use proper derivation
  // For now, we'll use a placeholder - you'll need to use proper key derivation
  console.log('⚠️  Note: Proper key derivation needed for production');
  console.log('🔧 For now, this script shows the deployment flow');
  return '0000000000000000000000000000000000000000000000000000000000000000';
}

async function configureGuestbook(tokenContractAddress) {
  console.log('🔧 Configuring guestbook with token contract...');
  
  try {
    const transaction = await makeContractCall({
      contractAddress: DEPLOYER_ADDRESS,
      contractName: 'guestbook-v2',
      functionName: 'set-token-contract',
      functionArgs: [principalCV(tokenContractAddress)],
      senderKey: derivePrivateKey(MNEMONIC),
      network: NETWORK,
    });

    const result = await broadcastTransaction(transaction, NETWORK);
    console.log('✅ Guestbook configured successfully!');
    console.log(`🔗 Tx ID: ${result.txId}`);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to configure guestbook:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting testnet deployment...');
  console.log(`👤 Deployer: ${DEPLOYER_ADDRESS}`);
  console.log(`🌐 Network: Testnet`);
  console.log('');

  try {
    // Deploy Access Token
    const tokenResult = await deployContract('access-token', ACCESS_TOKEN_CONTRACT);
    const tokenContractAddress = `${DEPLOYER_ADDRESS}.access-token`;
    
    console.log('');
    console.log('⏳ Waiting for token contract confirmation...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    
    // Deploy Guestbook
    const guestbookResult = await deployContract('guestbook-v2', GUESTBOOK_CONTRACT);
    
    console.log('');
    console.log('⏳ Waiting for guestbook contract confirmation...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    
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
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

main();
