import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

import axios from "axios";
import { clerkClient } from "@clerk/nextjs/server";
export async function POST(req: Request) {
  const { emailAddress, department } = await req.json();
  try {
    const emailAddresses = [emailAddress];
    const data: any = await clerkClient.users.createUser({
      emailAddress: emailAddresses,
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
      publicMetadata: {
        department: department,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
