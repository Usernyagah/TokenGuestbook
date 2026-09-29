"use client";

import {
  ClarityValue,
  PostConditionMode,
  AnchorMode,
  broadcastTransaction,
  makeContractCall,
} from '@stacks/transactions';
import { scaffoldConfig } from '../scaffold.config';

export function getDevnetSenderAddress(): string | null {
  return null;
}

export async function callDevnetContract({
  contract,
  functionName,
  functionArgs = [],
  postConditions = [],
}: {
  contract: string;
  functionName: string;
  functionArgs?: ClarityValue[];
  postConditions?: any[];
}): Promise<any> {
  if (!scaffoldConfig.isDevnet) {
    throw new Error('Devnet signer requested outside devnet mode');
  }

  const dot = contract.lastIndexOf('.');
  if (dot < 0) {
    throw new Error(`Invalid contract identifier: ${contract}`);
  }

  const transaction = await makeContractCall({
    contractAddress: contract.slice(0, dot),
    contractName: contract.slice(dot + 1),
    functionName,
    functionArgs,
    postConditions,
    postConditionMode: PostConditionMode.Deny,
    anchorMode: AnchorMode.Any,
    senderKey: '',
    network: 'devnet',
  });

  const result: any = await broadcastTransaction(transaction, 'devnet');
  if (!result?.txid) {
    throw new Error(result?.reason || 'Devnet transaction failed');
  }
  return result;
}
