import SafeApiKit, { AddMessageProps } from '@safe-global/api-kit'
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain')
  if (!chain) {
    return NextResponse.json({ error: 'chain is required' }, { status: 400 });
  }

  const body = await req.json();
  // get the signature and the safe address from the body
  const { message, signature, address } = body;
  // check if signature is provided
  if (!signature) {
    return NextResponse.json({ error: "signature is required" }, { status: 400 });
  }
  // Initialize the API Kit
  const apiKit = new SafeApiKit({
    chainId: BigInt(chain) // Base chain ID
  });

  
  
  const messageProps: AddMessageProps = {
    message,
    signature
  }
  
  // Send the message to the Transaction Service with the signature from Owner A
  apiKit.addMessage(address, messageProps);

  return NextResponse.json({ message: "ok" });
};
