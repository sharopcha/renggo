import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // return await updateSession(request)
  const { pathname } = request.nextUrl;

  // Allow the coming-soon page itself and static assets to load
  const isAllowed =
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    // allow static files (images, fonts, etc.)
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff|woff2)$/.test(
      pathname
    );

  if (isAllowed) return NextResponse.next();

  // Want to keep APIs working? uncomment the next line
  // if (pathname.startsWith('/api')) return NextResponse.next()

  // Otherwise rewrite everything to /coming-soon
  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    * Feel free to modify this pattern to include more paths.
  //    */
  //   "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  // ],
  matcher: '/:path*',
};
