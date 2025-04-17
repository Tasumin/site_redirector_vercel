# Root-Level Node.js Redirector for Vercel

This version uses a single `index.js` file at the root, powered by `@vercel/node` runtime.

## Features

- No `/api` folder required
- All incoming requests go through one handler
- HTTP 308 redirects based on path

## Setup

1. Deploy to Vercel
2. Ensure your project uses the `@vercel/node` runtime via `vercel.json`
3. Add custom domain if needed

## Example

Visiting `/servicedesk` will redirect the user to:
`http://subdomain.domain.com/servicedesk/portal`