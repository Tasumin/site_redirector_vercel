import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const redirects = JSON.parse(
  readFileSync(resolve(process.cwd(), 'redirects.json'), 'utf-8')
);

export function middleware(request) {
  const path = request.nextUrl.pathname.toLowerCase();

  if (redirects[path]) {
    return NextResponse.redirect(redirects[path], 308);
  }

  return NextResponse.next();
}
