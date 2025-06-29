import { NextResponse } from "next/server";
var LdapClient = require("ldapjs-client");
var CryptoJS = require("crypto-js");

export async function POST(req: Request) {
  try {
    const { emailAddress, password } = await req.json();
    var bytes = CryptoJS.AES.decrypt(password, "1");
    var originalpassword = bytes.toString(CryptoJS.enc.Utf8);
    let result: any = null;

    var client = new LdapClient({ url: "ldap://10.20.1.11:389" });
    // await client.bind(emailAddress, originalpassword);
    // result = true;
    try {
      await client.bind(emailAddress, originalpassword);

      //  (&(mail=${emailAddress})(userPassword=${originalpassword}))
      const options = {
        filter: `(mail=${emailAddress})`,
        scope: "sub",
        attributes: ["dn", "sn", "cn", "mail", "userPassword"],
      };

      const entries = await client.search("DC=lp,DC=local", options);

      result = entries[0];
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
