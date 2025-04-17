# Root-Level Node.js Redirector for Vercel

This version uses a single `index.js` file at the root, powered by the `nodejs18.x` runtime.

## Features

- No `/api` folder required
- All incoming requests go through one handler
- HTTP 308 redirects based on path

## Setup

1. Deploy to Vercel
2. Vercel detects the `nodejs18.x` runtime from `vercel.json`
3. Add custom domain if needed

## Example

Visiting `/servicedesk` will redirect the user to:
`http://subdomain.domain.com/servicedesk/portal`