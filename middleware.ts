// import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

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

// 1. Hàm lọc chỉ cho phép đường dẫn nội bộ (/foo, /bar?x=y…), bác bỏ //, http://, javascript:…
function isInternalPath(path: string): boolean {
  return /^\/(?!\/)/.test(path);
}

// 2. Khởi tạo middleware của Clerk như cũ
const clerkAuth = authMiddleware({
  publicRoutes: [
    "/api/webhook",
    "/api/checkLDAP",
    "/api/authLDAP",
    "/api/notifications",
    "/api/signup",
    "/api/departments",
    "/api/department",
    // “https://rest.ably.io/**”,
  ],
  // debug: true,
});

export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { nextUrl } = req;
  const redirectParam = nextUrl.searchParams.get("redirect_url");

  if (redirectParam) {
    // 3. Validate: nếu safe thì redirect, nếu không thì về /
    const safePath = isInternalPath(redirectParam) ? redirectParam : "/";
    return NextResponse.redirect(new URL(safePath, nextUrl.origin));
  }

  // 4. Nếu không có redirect_url, tiếp tục Clerk auth
  return clerkAuth(req, ev);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
