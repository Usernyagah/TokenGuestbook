import { request } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { 
  makeContractCall,
  contractPrincipalCV,
  someCV,
  uintCV,
  stringUtf8CV,
  trueCV,
  falseCV,
  noneCV,
  standardPrincipalCV,
  tupleCV,
  listCV,
  bufferCV,
  responseErrorCV,
  responseOkCV,
} from '@stacks/transactions';

const NETWORK = new StacksTestnet();

export async function openContractCall(options: {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network?: any;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}) {
  try {
    const result = await request(
      {},
      'stx_callContract',
      {
        contract: `${options.contractAddress}.${options.contractName}`,
        functionName: options.functionName,
        functionArgs: options.functionArgs,
        network: (options.network || NETWORK) as any,
      }
    );

    if (options.onFinish) {
      options.onFinish({ txId: (result as any).txid || '' });
    }

    return result;
  } catch (error) {
    if (options.onCancel) {
      options.onCancel();
    }
    throw error;
  }
}
