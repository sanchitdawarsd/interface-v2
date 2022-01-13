import { ethers } from 'ethers';
import { ApproveStrategy } from '../types';

export class EIP2771ApproveStrategy extends ApproveStrategy {
  async execute(spender: string, chainId: number) {
    const { data } = await this.contract.populateTransaction.approve(
      spender,
      ethers.constants.MaxUint256.toString(),
    );

    const txParams = {
      data: data,
      to: this.contract.address,
      from: this.account,
      // gasLimit: gasLimit, // optional
      signatureType: 'EIP712_SIGN',
    };

    // for EIP2771 using ethers providers will return transaction hash
    const txHash = await this.biconomy
      .getEthersProvider()
      .send('eth_sendTransaction', [txParams]);

    // TODO :
    // Log response for every strategy. and try to capture native meta tx api response code and message
    // Add try and catch in execute methods
    // Based on the response code, message, errors :  propogate the below object with errors with required values (for addTransaction) like hash
    return { hash: txHash };
  }
}