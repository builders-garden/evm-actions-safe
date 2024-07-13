import { ActionLinkType, EVMAction } from "@/lib/actions";
import { appURL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const evmActionMetadata: EVMAction = {
    title: "Safe EVM Action",
    description:
      "This is a sample EVM Action Safe Proposal that you can sign through a shortcut",
    image: `${appURL()}/landing.png`,
    links: [
      {
        targetUrl: `${appURL()}/api/signature?txHash=${searchParams.get(
          "txHash"
        )}&chain=${searchParams.get("chain")}`,
        postUrl: `${appURL()}/api/signature/success?chain=${searchParams.get(
          "chain"
        )}`, // this will be a POST HTTP call
        label: "Signature",
        type: ActionLinkType.SIGNATURE,
      },
    ],
    label: "Sign Proposal",
  };
  return NextResponse.json(evmActionMetadata);
};
