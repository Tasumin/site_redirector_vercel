# Vercel Redirector using Middleware and JSON Mapping

This project is designed to perform path-based redirects using Vercel Edge Middleware and a separate `redirects.json` configuration file. It supports deployment under a custom domain such as `go.example.com`.

## Features

- Redirect any path (e.g., `/servicedesk`) to any URL
- Centralized JSON configuration for all redirects
- Case-insensitive matching of paths
- HTTP 308 Permanent Redirect

## How to Use

1. **Edit `redirects.json`**  
   Update this file to include your redirect rules in the format:

   ```json
   {
     "/servicedesk": "http://subdomain.domain.com/servicedesk/portal",
     "/help": "http://support.domain.com/help-center"
   }
   ```

2. **Deploy to Vercel**  
   Push the project to GitHub and connect it with Vercel. Vercel will handle deployment.

3. **Set Up a Custom Domain**  
   Go to your project on Vercel:
   - Navigate to **Settings > Domains**
   - Add your domain (e.g., `go.example.com`)
   - Update your DNS to point to Vercel's provided CNAME or A record

## Notes

- Paths are matched case-insensitively.
- All redirect targets can be HTTP or HTTPS.