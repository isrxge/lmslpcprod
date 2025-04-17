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
import { getAuth } from "@clerk/nextjs/server";

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
  const { userId } = getAuth(req);

  // Chỉ redirect / → /sign-in nếu CHƯA login
  if (pathname === "/") {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", origin));
    }
    // Nếu đã login, cho phép tiếp tục vào /
    return NextResponse.next();
  }

  // Mọi route khác: để Clerk xử lý như cũ
  return clerkAuth(req, ev);
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",            // cần để bắt root
    "/(api|trpc)(.*)"
  ],
};
