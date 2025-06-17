import { NextResponse } from "next/server";
var LdapClient = require("ldapjs-client");
var CryptoJS = require("crypto-js");

export async function GET(req: Request) {
  try {
    let result: any = null;

    var client = new LdapClient({ url: "ldap://10.20.1.11:389" });
    // await client.bind(emailAddress, originalpassword);
    // result = true;
    try {
      await client.bind("trainconnect@lp.local", "Js46~p9@X3$Gu!");

      //  (&(mail=${emailAddress})(userPassword=${originalpassword}))
      const options = {
        scope: "sub",
        attributes: ["dn", "sn", "cn", "mail"],
      };

      const entries = await client.search("DC=lp,DC=local", options);
      console.log(entries);
      result = entries;
    } catch (e) {
      console.log("Bind failed");
    } finally {
      return NextResponse.json(result);
    }
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return NextResponse.json(false);
  }
}
