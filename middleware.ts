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
 * Trả về đường dẫn an toàn:
 * - Nếu `param` là full URL cùng origin, lấy `pathname+search`
 * - Nếu `param` là internal path (/foo…), giữ nguyên
 * - Ngược lại fallback về `/`
 */
function getSafeRedirect(param: string, origin: string): string {
  try {
    // decode first, in case it's percent‐encoded
    const decoded = decodeURIComponent(param);
    const url = new URL(decoded, origin);

    // chỉ cho phép cùng origin
    if (url.origin === origin) {
      return url.pathname + url.search;
    }
  } catch {
    // decode hoặc new URL lỗi → không phải full URL
  }

  // nếu không phải full URL, thử regex internal path
  if (/^\/(?!\/)/.test(param)) {
    return param;
  }

  // fallback
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
  const pathname = nextUrl.pathname;

  // CHỈ apply redirect_url logic trên trang /sign-in
  if (pathname === "/sign-in") {
    const redirectParam = nextUrl.searchParams.get("redirect_url");
    if (redirectParam) {
      const safePath = getSafeRedirect(redirectParam, nextUrl.origin);
      return NextResponse.redirect(new URL(safePath, nextUrl.origin));
    }
    // chưa có param thì tiếp tục để Clerk show form
    return clerkAuth(req, ev);
  }

  // Các route khác: chạy luôn Clerk auth
  return clerkAuth(req, ev);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
