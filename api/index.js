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

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Register your interest in website design, website hosting, domain setup, and ongoing support from TalonDNS." />
  <title>TalonDNS | Website Design & Hosting</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #07101d;
      --panel: rgba(13, 28, 48, .86);
      --panel-soft: rgba(19, 39, 65, .66);
      --line: rgba(148, 183, 224, .2);
      --text: #f4f8ff;
      --muted: #aebfd3;
      --accent: #42c7ff;
      --accent-2: #7c5cff;
      --success: #74e3a3;
      --shadow: 0 24px 80px rgba(0, 0, 0, .42);
    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 15% 10%, rgba(66, 199, 255, .18), transparent 32rem),
        radial-gradient(circle at 85% 25%, rgba(124, 92, 255, .16), transparent 30rem),
        linear-gradient(150deg, #040912 0%, #081524 52%, #050b14 100%);
    }

    a { color: inherit; }

    .shell {
      width: min(1180px, calc(100% - 36px));
      margin: 0 auto;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: 82px;
      border-bottom: 1px solid var(--line);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      font-weight: 800;
      letter-spacing: .03em;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 13px;
      background: linear-gradient(145deg, var(--accent), var(--accent-2));
      color: #04101d;
      box-shadow: 0 10px 30px rgba(66, 199, 255, .22);
    }

    .brand small {
      display: block;
      margin-top: 2px;
      color: var(--muted);
      font-size: .7rem;
      font-weight: 600;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .header-cta,
    .primary-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0 20px;
      border: 0;
      border-radius: 12px;
      color: #03101c;
      background: linear-gradient(135deg, var(--accent), #72dcff);
      font: inherit;
      font-weight: 800;
      text-decoration: none;
      cursor: pointer;
      box-shadow: 0 12px 32px rgba(66, 199, 255, .22);
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .header-cta:hover,
    .primary-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 38px rgba(66, 199, 255, .3);
    }

    .hero {
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      gap: 54px;
      align-items: center;
      padding: 84px 0 54px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 8px 12px;
      border: 1px solid rgba(66, 199, 255, .28);
      border-radius: 999px;
      color: #bdeeff;
      background: rgba(66, 199, 255, .08);
      font-size: .78rem;
      font-weight: 800;
      letter-spacing: .1em;
      text-transform: uppercase;
    }

    .eyebrow::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 0 5px rgba(116, 227, 163, .1);
    }

    h1 {
      margin: 24px 0 20px;
      font-size: clamp(2.7rem, 7vw, 5.8rem);
      line-height: .96;
      letter-spacing: -.065em;
    }

    .gradient-text {
      color: transparent;
      background: linear-gradient(90deg, #ffffff, #8be0ff 48%, #aa9aff);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .lead {
      max-width: 690px;
      margin: 0;
      color: var(--muted);
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.75;
    }

    .services {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 34px;
    }

    .service {
      min-height: 124px;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 17px;
      background: var(--panel-soft);
      backdrop-filter: blur(14px);
    }

    .service strong { display: block; margin-bottom: 7px; }
    .service span { color: var(--muted); font-size: .9rem; line-height: 1.5; }

    .form-card {
      padding: clamp(24px, 4vw, 38px);
      border: 1px solid rgba(148, 183, 224, .24);
      border-radius: 24px;
      background: var(--panel);
      box-shadow: var(--shadow);
      backdrop-filter: blur(22px);
    }

    .form-card h2 { margin: 0 0 8px; font-size: clamp(1.7rem, 3vw, 2.35rem); }
    .form-card > p { margin: 0 0 26px; color: var(--muted); line-height: 1.6; }

    form { display: grid; gap: 16px; }

    .field-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    label {
      display: grid;
      gap: 8px;
      color: #dbeaff;
      font-size: .86rem;
      font-weight: 700;
    }

    input,
    select,
    textarea {
      width: 100%;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid rgba(148, 183, 224, .24);
      border-radius: 11px;
      outline: none;
      color: var(--text);
      background: rgba(3, 12, 23, .72);
      font: inherit;
      transition: border-color .2s ease, box-shadow .2s ease;
    }

    textarea { min-height: 112px; resize: vertical; }

    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px rgba(66, 199, 255, .1);
    }

    select option { background: #091525; }

    .fine-print {
      margin: -2px 0 0;
      color: #8398af;
      font-size: .76rem;
      line-height: 1.5;
    }

    .status {
      display: none;
      padding: 12px 14px;
      border: 1px solid rgba(116, 227, 163, .3);
      border-radius: 11px;
      color: #bdf7d3;
      background: rgba(116, 227, 163, .08);
      font-size: .86rem;
      line-height: 1.5;
    }

    .status.visible { display: block; }

    .trust {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      overflow: hidden;
      margin: 8px 0 72px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--line);
    }

    .trust div {
      padding: 24px 18px;
      background: rgba(7, 17, 30, .95);
      text-align: center;
    }

    .trust strong { display: block; margin-bottom: 6px; font-size: 1.05rem; }
    .trust span { color: var(--muted); font-size: .82rem; }

    footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 26px 0 34px;
      border-top: 1px solid var(--line);
      color: #7f93aa;
      font-size: .82rem;
    }

    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; padding-top: 60px; }
      .services { grid-template-columns: 1fr; }
      .trust { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 580px) {
      .shell { width: min(100% - 24px, 1180px); }
      header { min-height: 72px; }
      .header-cta { display: none; }
      .hero { padding-top: 44px; gap: 38px; }
      .field-row { grid-template-columns: 1fr; }
      .trust { grid-template-columns: 1fr; }
      footer { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header>
      <a class="brand" href="/" aria-label="TalonDNS home">
        <span class="brand-mark">T</span>
        <span>TalonDNS<small>Web services</small></span>
      </a>
      <a class="header-cta" href="#register">Start a project</a>
    </header>

    <main>
      <section class="hero">
        <div>
          <span class="eyebrow">Now accepting new projects</span>
          <h1>Build a stronger <span class="gradient-text">online presence.</span></h1>
          <p class="lead">Register your interest in a professionally designed website, reliable hosting, domain setup, or ongoing support. Tell us what you need and we will follow up to discuss the right solution for your business or organization.</p>

          <div class="services" aria-label="Available services">
            <div class="service">
              <strong>Website Design</strong>
              <span>Modern, mobile-friendly sites designed around your business and goals.</span>
            </div>
            <div class="service">
              <strong>Hosting & Domains</strong>
              <span>Deployment, DNS configuration, SSL, custom domains, and dependable hosting.</span>
            </div>
            <div class="service">
              <strong>Ongoing Support</strong>
              <span>Updates, content changes, maintenance, troubleshooting, and technical guidance.</span>
            </div>
          </div>
        </div>

        <div class="form-card" id="register">
          <h2>Register your interest</h2>
          <p>Complete the form below. Your email application will open with the project details ready to send.</p>

          <form id="interest-form">
            <div class="field-row">
              <label>
                Your name
                <input name="name" autocomplete="name" required />
              </label>
              <label>
                Email address
                <input type="email" name="email" autocomplete="email" required />
              </label>
            </div>

            <div class="field-row">
              <label>
                Business or organization
                <input name="business" autocomplete="organization" />
              </label>
              <label>
                Phone number
                <input type="tel" name="phone" autocomplete="tel" />
              </label>
            </div>

            <div class="field-row">
              <label>
                Service needed
                <select name="service" required>
                  <option value="">Select a service</option>
                  <option>Website design</option>
                  <option>Website hosting</option>
                  <option>Website design and hosting</option>
                  <option>Domain or DNS setup</option>
                  <option>Website updates or support</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>
                Current website or domain
                <input name="domain" placeholder="example.com" />
              </label>
            </div>

            <div class="field-row">
              <label>
                Approximate budget
                <select name="budget">
                  <option value="">Select a range</option>
                  <option>Under $500</option>
                  <option>$500–$1,000</option>
                  <option>$1,000–$2,500</option>
                  <option>$2,500–$5,000</option>
                  <option>$5,000+</option>
                  <option>Need guidance</option>
                </select>
              </label>
              <label>
                Desired timeline
                <select name="timeline">
                  <option value="">Select a timeline</option>
                  <option>As soon as possible</option>
                  <option>Within 30 days</option>
                  <option>Within 1–3 months</option>
                  <option>More than 3 months</option>
                  <option>Just exploring options</option>
                </select>
              </label>
            </div>

            <label>
              Tell us about your project
              <textarea name="details" placeholder="What do you need the website to do? Do you already have a logo, content, or domain?"></textarea>
            </label>

            <div class="status" id="form-status" role="status">Your email application should open now. Review the prepared message and press Send to complete your registration.</div>
            <button class="primary-button" type="submit">Prepare registration email</button>
            <p class="fine-print">Submitting this form opens your default email application. No information is stored by this website before you send the email.</p>
          </form>
        </div>
      </section>

      <section class="trust" aria-label="Service highlights">
        <div><strong>Responsive</strong><span>Designed for desktop, tablet, and mobile</span></div>
        <div><strong>Secure</strong><span>HTTPS and modern deployment practices</span></div>
        <div><strong>Professional</strong><span>Built around your brand and audience</span></div>
        <div><strong>Supported</strong><span>Help after the website goes live</span></div>
      </section>
    </main>

    <footer>
      <span>© ${new Date().getFullYear()} TalonDNS. All rights reserved.</span>
      <span>Website design · Hosting · Domains · Support</span>
    </footer>
  </div>

  <script>
    const form = document.getElementById('interest-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || 'New customer';
      const service = data.get('service') || 'Website services';
      const subject = 'TalonDNS registration - ' + service + ' - ' + name;
      const body = [
        'TalonDNS Website Services Registration',
        '',
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Business / Organization: ' + (data.get('business') || ''),
        'Phone: ' + (data.get('phone') || ''),
        'Service Needed: ' + (data.get('service') || ''),
        'Current Website / Domain: ' + (data.get('domain') || ''),
        'Approximate Budget: ' + (data.get('budget') || ''),
        'Desired Timeline: ' + (data.get('timeline') || ''),
        '',
        'Project Details:',
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
