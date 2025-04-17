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
import { NextResponse, NextRequest } from "next/server";
import { authMiddleware as clerkAuth } from "@clerk/nextjs";

// 1) Hàm kiểm tra internal path
function isInternalPath(path: string): boolean {
  return /^\/(?!\/)/.test(path);
}

// 2) Khởi tạo Clerk auth middleware
const clerkAuthMiddleware = clerkAuth({
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

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const redirectParam = nextUrl.searchParams.get("redirect_url");

  // A) Nếu có redirect_url → thực hiện safe-redirect
  if (redirectParam) {
    const safePath = isInternalPath(redirectParam) ? redirectParam : "/";
    const destination = new URL(safePath, nextUrl.origin);
    const res = NextResponse.redirect(destination);
    res.headers.set("X-XSS-Protection", "1; mode=block");
    return res;
  }

  // B) Nếu không → chạy Clerk auth
  const res = clerkAuthMiddleware(req);

  // C) Luôn gắn XSS-Protection header cho response auth
  if (res instanceof NextResponse) {
    res.headers.set("X-XSS-Protection", "1; mode=block");
  }
  return res;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
