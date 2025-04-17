# Vercel Redirector using Edge Middleware

This project uses Vercel Edge Middleware to perform redirects from specific paths to custom URLs.

## Features

- Redirects `/servicedesk`, `/help`, etc. to external URLs
- Uses Vercel Edge Middleware (zero latency, globally deployed)
- Fully compatible with custom domains like `go.example.com`

## How to Use

1. **Edit `middleware.js`**  
   Modify the `redirects` object to define your path-based redirect rules.

2. **Deploy to Vercel**  
   Push this project to GitHub and import it into Vercel. Middleware is automatically detected.

3. **Configure Custom Domain**  
   Add your custom domain to the project in the Vercel dashboard and update your DNS (e.g., CNAME to `cname.vercel-dns.com`).

## Example

Visiting `http://go.example.com/servicedesk` will redirect the user to:
`http://subdomain.domain.com/servicedesk/portal`