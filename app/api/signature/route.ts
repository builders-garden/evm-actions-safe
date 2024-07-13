import { NextRequest, NextResponse } from "next/server";
import SafeApiKit, { EIP712TypedData } from '@safe-global/api-kit'
import { getEip712TxTypes } from "@safe-global/protocol-kit";

export const POST = async (req: NextRequest) => {
  try {

    const { address } = await req.json();
    // get txHash from the url, expected to be in the url using searchParams
    const { searchParams } = new URL(req.url);
    const txHash = searchParams.get('txHash');
    const chain = searchParams.get('chain')
    // Check if txHash is provided
    if (!txHash) {
      return NextResponse.json({ error: 'txHash is required' }, { status: 400 });
    }
    if (!chain) {
      return NextResponse.json({ error: 'chain is required' }, { status: 400 });
    }
    // Initialize the API Kit
    const apiKit = new SafeApiKit({
      chainId: BigInt(chain) // Base chain ID
    });
    // Get the signed transaction from Safe API Kit
    const signedTransaction = await apiKit.getTransaction(txHash);

    // Define the domain
    const domain = {
      chainId: Number(chain),
      verifyingContract: signedTransaction.safe
    };

    // Define the types
    const types = getEip712TxTypes("1.3.0");

    // Define the message
    const message = {
      to: signedTransaction.to,
      value: signedTransaction.value.toString(),
      data: signedTransaction.data || "0x",
      operation: signedTransaction.operation,
      safeTxGas: signedTransaction.safeTxGas.toString(),
      baseGas: signedTransaction.baseGas.toString(),
      gasPrice: signedTransaction.gasPrice.toString(),
      gasToken: signedTransaction.gasToken,
      refundReceiver: signedTransaction.refundReceiver,
      nonce: signedTransaction.nonce
    };

    // Create the typed data object
    const typedData = {
      types,
      domain,
      primaryType: 'SafeTx',
      message
    };

    // Return the JSON data
    return NextResponse.json({ message: typedData });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
