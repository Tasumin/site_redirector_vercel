const redirects = {
  '/servicedesk': 'http://renpsg.atlassian.net/servicedesk/customer/portal/2',
  '/changerequest': 'http://renpsg.atlassian.net/servicedesk/customer/portal/5',
  '/google': 'https://google.com',
  '/myapps': 'https://myapplications.office.com',
  '/lsps': 'https://fivem-lsps-portal.vercel.app/'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderPage(contactEmail) {
  const safeEmail = escapeHtml(contactEmail);
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Register a TalonDNS redirect or custom domain for your FiveM business website." />
  <title>TalonDNS | FiveM Business Links</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #07101d;
      --panel: rgba(13, 28, 48, .88);
      --soft: rgba(19, 39, 65, .68);
      --line: rgba(148, 183, 224, .2);
      --text: #f4f8ff;
      --muted: #aebfd3;
      --accent: #42c7ff;
      --accent2: #7c5cff;
      --success: #74e3a3;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 15% 10%, rgba(66,199,255,.18), transparent 32rem),
        radial-gradient(circle at 85% 25%, rgba(124,92,255,.16), transparent 30rem),
        linear-gradient(150deg, #040912 0%, #081524 52%, #050b14 100%);
    }

    .shell { width: min(1160px, calc(100% - 32px)); margin: 0 auto; }
    header {
      min-height: 82px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      border-bottom: 1px solid var(--line);
    }
    .brand { display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; font-weight: 800; }
    .brand-mark {
      width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px;
      color: #04101d; background: linear-gradient(145deg, var(--accent), var(--accent2));
      box-shadow: 0 10px 30px rgba(66,199,255,.22);
    }
    .brand small { display: block; color: var(--muted); font-size: .68rem; letter-spacing: .11em; text-transform: uppercase; }
    .cta, button {
      min-height: 48px; display: inline-flex; align-items: center; justify-content: center;
      padding: 0 20px; border: 0; border-radius: 12px; cursor: pointer;
      color: #03101c; background: linear-gradient(135deg, var(--accent), #72dcff);
      font: inherit; font-weight: 800; text-decoration: none;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.02fr .98fr;
      gap: 48px;
      align-items: start;
      padding: 72px 0 58px;
    }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 9px; padding: 8px 12px;
      border: 1px solid rgba(66,199,255,.28); border-radius: 999px;
      color: #bdeeff; background: rgba(66,199,255,.08);
      font-size: .78rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    }
    .eyebrow::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
    h1 { margin: 24px 0 20px; font-size: clamp(2.7rem, 7vw, 5.6rem); line-height: .97; letter-spacing: -.06em; }
    .gradient { color: transparent; background: linear-gradient(90deg,#fff,#8be0ff 48%,#aa9aff); -webkit-background-clip: text; background-clip: text; }
    .lead { margin: 0; color: var(--muted); font-size: clamp(1rem,2vw,1.18rem); line-height: 1.72; }

    .options { display: grid; gap: 14px; margin-top: 30px; }
    .option {
      padding: 20px; border: 1px solid var(--line); border-radius: 17px;
      background: var(--soft); backdrop-filter: blur(14px);
    }
    .option strong { display: block; margin-bottom: 7px; font-size: 1.05rem; }
    .option span { color: var(--muted); line-height: 1.55; font-size: .92rem; }
    code { color: #bdeeff; background: rgba(66,199,255,.09); padding: 2px 6px; border-radius: 6px; }

    .form-card {
      padding: clamp(24px,4vw,38px); border: 1px solid rgba(148,183,224,.24);
      border-radius: 24px; background: var(--panel); box-shadow: 0 24px 80px rgba(0,0,0,.42);
      backdrop-filter: blur(22px);
    }
    .form-card h2 { margin: 0 0 8px; font-size: clamp(1.7rem,3vw,2.3rem); }
    .form-card > p { margin: 0 0 24px; color: var(--muted); line-height: 1.6; }
    form { display: grid; gap: 15px; }
    .row { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
    label { display: grid; gap: 8px; color: #dbeaff; font-size: .86rem; font-weight: 700; }
    input, select, textarea {
      width: 100%; min-height: 48px; padding: 12px 14px;
      border: 1px solid rgba(148,183,224,.24); border-radius: 11px;
      color: var(--text); background: rgba(3,12,23,.72); font: inherit; outline: none;
    }
    textarea { min-height: 105px; resize: vertical; }
    input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(66,199,255,.1); }
    select option { background: #091525; }
    .fine { margin: -2px 0 0; color: #8398af; font-size: .76rem; line-height: 1.5; }
    .status { display: none; padding: 12px 14px; border: 1px solid rgba(116,227,163,.3); border-radius: 11px; color: #bdf7d3; background: rgba(116,227,163,.08); font-size: .86rem; }
    .status.visible { display: block; }

    .notes {
      display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; overflow: hidden;
      margin: 4px 0 68px; border: 1px solid var(--line); border-radius: 18px; background: var(--line);
    }
    .notes div { padding: 24px 18px; background: rgba(7,17,30,.95); text-align: center; }
    .notes strong { display: block; margin-bottom: 6px; }
    .notes span { color: var(--muted); font-size: .82rem; line-height: 1.45; }
    footer { display: flex; justify-content: space-between; gap: 20px; padding: 26px 0 34px; border-top: 1px solid var(--line); color: #7f93aa; font-size: .82rem; }

    @media (max-width: 900px) { .hero { grid-template-columns: 1fr; padding-top: 54px; } }
    @media (max-width: 600px) {
      header { min-height: 72px; }
      .cta { display: none; }
      .hero { padding-top: 42px; gap: 36px; }
      .row, .notes { grid-template-columns: 1fr; }
      footer { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header>
      <a class="brand" href="/" aria-label="TalonDNS home">
        <span class="brand-mark">T</span>
        <span>TalonDNS<small>FiveM business links</small></span>
      </a>
      <a class="cta" href="#register">Register a link</a>
    </header>

    <main>
      <section class="hero">
        <div>
          <span class="eyebrow">For FiveM businesses only</span>
          <h1>Give your business a <span class="gradient">clean web address.</span></h1>
          <p class="lead">Register a short TalonDNS redirect for your FiveM business website, or request help connecting a custom domain name to a site you already host.</p>

          <div class="options">
            <div class="option">
              <strong>TalonDNS Redirect</strong>
              <span>Get a simple link such as <code>talondns.com/yourbusiness</code> that redirects visitors to your existing FiveM business website.</span>
            </div>
            <div class="option">
              <strong>Custom Domain Name</strong>
              <span>Use a domain such as <code>examplebusiness.com</code>. We can help connect its DNS records to your existing hosted website.</span>
            </div>
          </div>
        </div>

        <div class="form-card" id="register">
          <h2>Register your FiveM business</h2>
          <p>Provide your business and website details. Your email app will open with everything ready to send.</p>

          <form id="interest-form">
            <div class="row">
              <label>
                Character name
                <input name="character" required placeholder="Character name" />
              </label>
              <label>
                State ID
                <input name="stateId" required inputmode="numeric" placeholder="State ID" />
              </label>
            </div>

            <div class="row">
              <label>
                Discord username
                <input name="discord" required placeholder="Discord username" />
              </label>
              <label>
                FiveM server
                <input name="server" required placeholder="Server name" />
              </label>
            </div>

            <label>
              Business name
              <input name="business" required placeholder="Business name" />
            </label>

            <div class="row">
              <label>
                Request type
                <select name="requestType" required>
                  <option value="">Select an option</option>
                  <option>TalonDNS redirect</option>
                  <option>Custom domain connection</option>
                  <option>Both</option>
                </select>
              </label>
              <label>
                Requested short link
                <input name="slug" placeholder="yourbusiness" />
              </label>
            </div>

            <label>
              Existing website URL
              <input type="url" name="website" required placeholder="https://example.com" />
            </label>

            <label>
              Custom domain name, if applicable
              <input name="domain" placeholder="examplebusiness.com" />
            </label>

            <label>
              Additional details
              <textarea name="details" placeholder="Describe the requested link, domain ownership, and current website host."></textarea>
            </label>

            <div class="status" id="form-status" role="status">Your email application should open now. Review it and press Send to complete the request.</div>
            <button type="submit">Prepare registration email</button>
            <p class="fine">This page does not store your information. Submitting opens your default email application with a prepared request.</p>
          </form>
        </div>
      </section>

      <section class="notes" aria-label="Important information">
        <div><strong>FiveM Businesses</strong><span>Requests are intended for legitimate in-city businesses and organizations.</span></div>
        <div><strong>Existing Website Required</strong><span>A TalonDNS redirect points to a website you already have online.</span></div>
        <div><strong>Approval Required</strong><span>Requested paths and domains are reviewed before configuration.</span></div>
      </section>
    </main>

    <footer>
      <span>© ${year} TalonDNS</span>
      <span>FiveM business redirects · Custom domain connections</span>
    </footer>
  </div>

  <script>
    const form = document.getElementById('interest-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const business = data.get('business') || 'FiveM business';
      const requestType = data.get('requestType') || 'Domain request';
      const subject = 'TalonDNS FiveM registration - ' + business;
      const body = [
        'TalonDNS FiveM Business Registration',
        '',
        'Character Name: ' + (data.get('character') || ''),
        'State ID: ' + (data.get('stateId') || ''),
        'Discord Username: ' + (data.get('discord') || ''),
        'FiveM Server: ' + (data.get('server') || ''),
        'Business Name: ' + (data.get('business') || ''),
        'Request Type: ' + requestType,
        'Requested Short Link: talondns.com/' + (data.get('slug') || ''),
        'Existing Website URL: ' + (data.get('website') || ''),
        'Custom Domain: ' + (data.get('domain') || ''),
        '',
        'Additional Details:',
        data.get('details') || ''
      ].join('\n');

      status.classList.add('visible');
      window.location.href = 'mailto:${safeEmail}?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  </script>
</body>
</html>`;
}

export default function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (redirects[path]) {
    res.writeHead(308, { Location: redirects[path] });
    res.end();
    return;
  }

  if (path === '/') {
    const contactEmail = process.env.CONTACT_EMAIL || 'contact@talondns.com';
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300'
    });
    res.end(renderPage(contactEmail));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
}
