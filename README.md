# Node.js Redirector

A lightweight Node.js server that redirects specific paths to full URLs.

## Features

- Uses the built-in `http` module
- HTTP 308 Permanent Redirects
- Runs on a custom port (defaults to 3000)

## How to Run

```bash
npm install
npm start
```

## Configuration

Update `index.js` and modify the `redirects` object to add more path mappings.

## Example

Visiting `http://localhost:3000/servicedesk` will redirect you to:
`http://subdomain.domain.com/servicedesk/portal`