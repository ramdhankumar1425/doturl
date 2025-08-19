import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth"];

export function middleware(req: NextRequest) {
	const refreshToken = req.cookies.get("refreshToken");
	const { pathname } = req.nextUrl;

	if (!refreshToken) {
		// if tried to access a protected route without token => Redirect to home
		if (protectedRoutes.some((route) => pathname.startsWith(route))) {
			const homeUrl = new URL("/", req.url);

			const redirectRes = NextResponse.redirect(homeUrl);
			redirectRes.headers.set("x-no-auth", "true"); // mark request as unauthenticated
			return redirectRes;
		}

		// not a protected route, just pass with header
		const res = NextResponse.next();
		res.headers.set("x-no-auth", "true");
		return res;
	}

	if (authRoutes.some((route) => pathname.startsWith(route))) {
		const homeUrl = new URL("/", req.url);
		return NextResponse.redirect(homeUrl);
	}

	// otherwise allow
	return NextResponse.next();
}

// export const config = {
// 	matcher: ["/dashboard/:path*"],
// };
