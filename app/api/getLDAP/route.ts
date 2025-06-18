import { NextResponse } from "next/server";
var LdapClient = require("ldapjs-client");
export async function GET(req: Request) {
  try {
    let result: boolean = false;

    var client = new LdapClient({ url: "ldap://10.20.1.11:389" });
    try {
      await client.bind("trainconnect@lp.local", "Js46~p9@X3$Gu!");
    } catch (e) {}
    try {
      const options = {
        filter: `(mail=*)`,
        scope: "sub",
        attributes: ["dn", "sn", "cn", "mail"],
      };

      const entries = await client.search(
        "OU=HCM Staffs,DC=lp,DC=local",
        options
      );

      result = entries
        .filter(
          (item: { mail: string }) => item.mail !== "lpc.partner@lp.com.vn"
        )
        .filter((item: { mail: string }) => item.mail !== "info@lp.com.vn")
        .filter((item: { mail: string }) => item.mail !== "support@lp.com.vn")
        .filter((item: { mail: string }) => item.mail !== "webmaster@lp.com.vn")
        .filter(
          (item: { mail: string }) => item.mail !== "managedsupport@lp.com.vn"
        )
        .filter(
          (item: { mail: string }) => item.mail !== "lpc_services@lp.com.vn"
        )
        .filter(
          (item: { mail: string }) =>
            item.mail !== "lpc_cloud_services@lp.com.vn"
        );
    } catch (e) {}
    return NextResponse.json(result);
  } catch (error) {
    console.log("AD Error:", error);
    return NextResponse.json(false);
  }
}
