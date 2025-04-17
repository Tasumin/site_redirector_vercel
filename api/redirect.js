export default function handler(req, res) {
  const redirects = {
    '/servicedesk': 'http://subdomain.domain.com/servicedesk/portal',
    '/datadog': 'https://datadog.com',
    '/google': 'https://google.com'
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
