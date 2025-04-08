import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const token = cookies().get("token")?.value;

  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && ["/login", "/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/"],
};
