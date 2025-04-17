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

/**
 * Từ param truyền vào (có thể là full URL hoặc internal path),
 * - Nếu là full URL cùng origin, decode + parse và trả về pathname+search.
 * - Nếu là internal path hợp lệ (/foo, /bar?x=1), giữ nguyên.
 * - Nếu không hợp lệ (javascript:, http:// khác origin, //…), trả về "/".
 */
function getSafeRedirect(param: string, origin: string): string {
  try {
    const decoded = decodeURIComponent(param);
    const url = new URL(decoded, origin);
    if (url.origin === origin) {
      return url.pathname + url.search;
    }
  } catch {
    // decode hay new URL thất bại → không phải full URL
  }
  // internal path?
  if (/^\/(?!\/)/.test(param)) {
    return param;
  }
  return "/";
}

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
  const { nextUrl } = req;
  const { pathname, origin, searchParams } = nextUrl;

  // Chỉ xử lý redirect_url khi đang ở /sign-in
  if (pathname === "/sign-in") {
    const redirectParam = searchParams.get("redirect_url");
    if (redirectParam) {
      const safePath = getSafeRedirect(redirectParam, origin);

      // Chỉ redirect KHI safePath khác param gốc
      if (safePath !== redirectParam) {
        return NextResponse.redirect(new URL(safePath, origin));
      }
    }
  }

  // Mọi tình huống khác → để Clerk auth xử lý
  return clerkAuth(req, ev);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
