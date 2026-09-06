import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // дозволити сторінку логіну та API auth
        if (path.startsWith("/admin/login") || path.startsWith("/api/auth")) return true;
        // захистити /admin та /api/news|events|reports|seed POST
        if (path.startsWith("/admin")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
