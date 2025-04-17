// import { authMiddleware } from "@clerk/nextjs";

// // This example protects all routes including api/trpc routes
// // Please edit this to allow other routes to be public as needed.
// // See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
// export default authMiddleware({
//   publicRoutes: [
//     "/api/webhook",
//     "/api/checkLDAP",
//     "/api/authLDAP",
//     "/api/notifications",
//     "/api/signup",
//     "/api/departments",
//     "/api/department",
//     // "https://rest.ably.io/**",
//   ],
//   // debug: true,
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const clerkAuth = authMiddleware({
  publicRoutes: [
    "/api/webhook",
    "/api/checkLDAP",
    "/api/authLDAP",
    "/api/notifications",
    "/api/signup",
    "/api/departments",
    "/api/department",
  ],
  // debug: true,
});

export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname, origin } = req.nextUrl;

  // 1. Nếu root "/" → redirect thẳng tới "/sign-in"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  // 2. Ngược lại cho Clerk xử lý auth như bình thường
  return clerkAuth(req, ev);
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // tất cả trừ static và nội dung Next
    "/",                      // bao gồm "/" để catch ở bước 1
    "/(api|trpc)(.*)"         // api/trpc
  ],
};
