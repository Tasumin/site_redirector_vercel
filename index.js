import http from 'http';
import { URL } from 'url';

const redirects = {
  '/servicedesk': 'http://subdomain.domain.com/servicedesk/portal',
  '/help': 'http://support.domain.com/help-center',
  '/login': 'http://auth.domain.com/signin'
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, \`http://\${req.headers.host}\`);
  const path = requestUrl.pathname.toLowerCase();

  if (redirects[path]) {
    res.writeHead(308, { Location: redirects[path] });
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Redirector server running on port \${PORT}\`);
});