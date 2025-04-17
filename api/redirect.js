export default function handler(req, res) {
  const redirects = {
    '/servicedesk': 'http://subdomain.domain.com/servicedesk/portal',
    '/help': 'http://support.domain.com/help-center',
    '/login': 'http://auth.domain.com/signin'
  };

  const path = req.url.toLowerCase().replace('/api/redirect', '') || '/';

  if (redirects[path]) {
    res.writeHead(308, { Location: redirects[path] });
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}
