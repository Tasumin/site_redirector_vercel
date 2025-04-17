import { NextResponse } from 'next/server';

const redirects = {
  '/servicedesk': 'http://subdomain.domain.com/servicedesk/portal',
  '/help': 'http://support.domain.com/help-center',
  '/login': 'http://auth.domain.com/signin'
};

export function middleware(request) {
  const path = request.nextUrl.pathname.toLowerCase();

  if (redirects[path]) {
    return NextResponse.redirect(redirects[path], 308);
  }

  return NextResponse.next();
}
