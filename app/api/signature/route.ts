import { NextRequest, NextResponse } from "next/server";
import SafeApiKit from '@safe-global/api-kit'

export const POST = async (req: NextRequest) => {
  try {
    // Initialize the API Kit
    const apiKit = new SafeApiKit({
      chainId: BigInt(8453) // Base chain ID
    });

    const { address } = await req.json();
    // get txHash from the url, expected to be in the url using searchParams
    const { searchParams } = new URL(req.url);
    const txHash = searchParams.get('txHash');
    // Check if txHash is provided
    if (!txHash) {
      return NextResponse.json({ error: 'txHash is required' }, { status: 400 });
    }
    // Get the signed transaction from Safe API Kit
    const signedTransaction = await apiKit.getTransaction(txHash);

    // Define the domain
    const domain = {
      name: 'Safe Shortcut',
      version: '1',
      chainId: 8453, // Base
      verifyingContract: signedTransaction.safe
    };

    // Define the types
    const types = {
      SafeTx: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'operation', type: 'uint8' },
        { name: 'safeTxGas', type: 'uint256' },
        { name: 'baseGas', type: 'uint256' },
        { name: 'gasPrice', type: 'uint256' },
        { name: 'gasToken', type: 'address' },
        { name: 'refundReceiver', type: 'address' },
        { name: 'nonce', type: 'uint256' },
      ]
    };

    // Define the message
    const message = {
      to: signedTransaction.to,
      value: signedTransaction.value.toString(),
      data: signedTransaction.data,
      operation: signedTransaction.operation,
      safeTxGas: signedTransaction.safeTxGas.toString(),
      baseGas: signedTransaction.baseGas.toString(),
      gasPrice: signedTransaction.gasPrice.toString(),
      gasToken: signedTransaction.gasToken,
      refundReceiver: signedTransaction.refundReceiver,
      nonce: signedTransaction.nonce.toString()
    };

    // Create the typed data object
    const typedData = {
      types,
      domain,
      primaryType: 'SafeTx',
      message
    };

    // Convert to JSON format for signing
    const jsonData = JSON.stringify(typedData);
    // Return the JSON data
    return NextResponse.json(jsonData);

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
