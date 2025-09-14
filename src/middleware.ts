import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = (req as { nextauth?: { token?: { role?: string } } }).nextauth?.token;
    const { pathname, search } = req.nextUrl;
    // Przykład: tylko ADMIN wejdzie na /admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        const url = new URL("/account/signin", req.url);
        url.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }

    // 📌 Blokada dla /account/myaccount – tylko zalogowani
    if (req.nextUrl.pathname.startsWith("/account/myaccount")) {
        if (!token) {
          const url = new URL("/account/signin", req.url);
          url.searchParams.set("callbackUrl",  pathname + search);
          return NextResponse.redirect(url);
        }
      }
    return NextResponse.next();
  },
  {
    callbacks: { authorized: () => true },
  }
);

export const config = {
  matcher: ["/admin/:path*","/account/:path*"], // chronione ścieżki
};
