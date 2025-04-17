module.exports = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.toLowerCase();

  const redirects = {
    '/servicedesk': 'http://subdomain.domain.com/servicedesk/portal',
    '/help': 'http://support.domain.com/help-center',
    '/login': 'http://auth.domain.com/signin'
  };

  if (redirects[path]) {
    res.writeHead(308, { Location: redirects[path] });
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};