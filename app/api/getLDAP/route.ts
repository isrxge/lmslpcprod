import { NextResponse } from "next/server";
var LdapClient = require("ldapjs-client");
var CryptoJS = require("crypto-js");
var ActiveDirectory = require("activedirectory");
export async function GET(req: Request) {
  try {
    let result: any = null;
    var ad = new ActiveDirectory({
      url: "ldap://10.20.1.11:389",
      baseDN: "DC=lp, DC=local",
      username: "trainconnect@lp.local",
      password: "Js46~p9@X3$Gu!",
      attributes: {
        user: ["mail"],
        //  group: [ 'anotherCustomAttribute', 'objectCategory' ]
      },
    });

    try {
      ad.findUsers(function (err: any, users: string | any[]) {
        if (err) {
          console.log("ERROR: " + JSON.stringify(err));
          return null;
        }

        if (!users || users.length == 0) console.log("No users found.");
        else {
          console.log("findUsers: " + JSON.stringify(users));
          return users;
        }
      });
    } catch (e) {
      console.log("Bind failed");
    } finally {
      return NextResponse.json(result);
    }
  } catch (error) {
    console.log("[AD GET USER]", error);
    return NextResponse.json(false);
  }
}
