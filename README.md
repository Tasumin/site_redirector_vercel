# Vercel Serverless Redirector

This project uses a serverless function to dynamically redirect based on path.

## How It Works

- All paths are routed to `/api/redirect`
- The API function looks up the request path and sends a 308 redirect if matched

## Setup

1. Deploy this repo to Vercel
2. Add your domain (e.g., go.example.com)
3. Vercel will redirect any incoming request based on the `redirects` map in `api/redirect.js`

## Example

Visiting `/servicedesk` will redirect the user to:
`http://subdomain.domain.com/servicedesk/portal`