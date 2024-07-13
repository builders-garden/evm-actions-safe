import { ActionLinkType, EVMAction } from "@/lib/actions";
import { appURL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const evmActionMetadata: EVMAction = {
    title: "Sample EVM Action",
    description: "This is a sample EVM Action Safe Proposal that you can sign through a shortcut",
    image: "https://placehold.co/955x500",
    links: [
      {
        targetUrl: `${appURL()}/api/signature`,
        postUrl: `${appURL()}/api/signature/success`, // this will be a POST HTTP call
        label: "Signature",
        type: ActionLinkType.SIGNATURE,
      },
    ],
    label: "Sign Proposal",
  };
  return NextResponse.json(evmActionMetadata);
};
