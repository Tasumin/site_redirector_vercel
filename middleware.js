import { NextResponse } from 'next/server';
import redirects from './redirects.json' assert { type: 'json' };

export function middleware(request) {
  const path = request.nextUrl.pathname.toLowerCase();

  if (redirects[path]) {
    return NextResponse.redirect(redirects[path], 308);
  }

  return NextResponse.next();
}