export default function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.toLowerCase();

  const redirects = {
    '/servicedesk': 'http://renpsg.atlassian.net/servicedesk/customer/portal/2',
    '/changerequest': 'http://renpsg.atlassian.net/servicedesk/customer/portal/5',
    '/google': 'https://google.com',
    '/myapps': 'https://myapplications.office.com'
  };

  if (redirects[path]) {
    res.writeHead(308, { Location: redirects[path] });
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}
