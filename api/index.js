import crypto from 'node:crypto';

const redirects = {
  '/servicedesk': 'http://renpsg.atlassian.net/servicedesk/customer/portal/2',
  '/changerequest': 'http://renpsg.atlassian.net/servicedesk/customer/portal/5',
  '/google': 'https://google.com',
  '/myapps': 'https://myapplications.office.com',
  '/lsps': 'https://fivem-lsps-portal.vercel.app/'
};

const TABLE = 'website_requests';
const STATUSES = ['New', 'Contacted', 'Quoted', 'In Progress', 'Completed', 'Declined'];

function esc(v = '') {
  return String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function html(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 100000) throw new Error('Request is too large.');
  }
  if (!raw) return {};
  const type = req.headers['content-type'] || '';
  if (type.includes('application/json')) return JSON.parse(raw);
  return Object.fromEntries(new URLSearchParams(raw));
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase environment variables are not configured.');
  return { url: url.replace(/\/$/, ''), key };
}

async function supabase(path, options = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.hint || `Supabase request failed (${response.status}).`);
  return data;
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function signSession() {
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const payload = String(expires);
  const signature = crypto.createHmac('sha256', sessionSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

function isAdmin(req) {
  const cookie = req.headers.cookie || '';
  const token = cookie.split(';').map(v => v.trim()).find(v => v.startsWith('talondns_admin='))?.split('=')[1];
  if (!token || !sessionSecret()) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = crypto.createHmac('sha256', sessionSecret()).update(expires).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function publicPage() {
  const year = new Date().getFullYear();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="FiveM business redirects, custom domains, and fully designed business websites."><title>TalonDNS | FiveM Business Websites</title><style>
  :root{color-scheme:dark;--bg:#050b14;--panel:rgba(13,28,48,.9);--soft:rgba(19,39,65,.68);--line:rgba(148,183,224,.2);--text:#f4f8ff;--muted:#aebfd3;--accent:#42c7ff;--accent2:#7c5cff;--success:#74e3a3}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);background:radial-gradient(circle at 15% 10%,rgba(66,199,255,.18),transparent 32rem),radial-gradient(circle at 85% 25%,rgba(124,92,255,.16),transparent 30rem),linear-gradient(150deg,#040912,#081524 52%,#050b14)}.shell{width:min(1180px,calc(100% - 32px));margin:auto}header{min-height:82px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none;font-weight:850}.mark{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;color:#04101d;background:linear-gradient(145deg,var(--accent),var(--accent2));box-shadow:0 10px 30px rgba(66,199,255,.22)}.brand small{display:block;color:var(--muted);font-size:.68rem;letter-spacing:.11em;text-transform:uppercase}.cta,button{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:0 20px;border:0;border-radius:12px;color:#03101c;background:linear-gradient(135deg,var(--accent),#72dcff);font:inherit;font-weight:850;text-decoration:none;cursor:pointer}.hero{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;padding:70px 0 52px}.eyebrow{display:inline-flex;align-items:center;gap:9px;padding:8px 12px;border:1px solid rgba(66,199,255,.28);border-radius:999px;color:#bdeeff;background:rgba(66,199,255,.08);font-size:.78rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.eyebrow:before{content:'';width:8px;height:8px;border-radius:50%;background:var(--success)}h1{margin:24px 0 20px;font-size:clamp(2.6rem,6.7vw,5.4rem);line-height:.97;letter-spacing:-.06em}.gradient{color:transparent;background:linear-gradient(90deg,#fff,#8be0ff 48%,#aa9aff);-webkit-background-clip:text;background-clip:text}.lead{margin:0;color:var(--muted);font-size:clamp(1rem,2vw,1.18rem);line-height:1.72}.services{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:30px}.service{padding:19px;border:1px solid var(--line);border-radius:17px;background:var(--soft)}.service strong{display:block;margin-bottom:7px}.service span{color:var(--muted);line-height:1.5;font-size:.9rem}code{color:#bdeeff;background:rgba(66,199,255,.09);padding:2px 6px;border-radius:6px}.form-card{padding:clamp(24px,4vw,38px);border:1px solid rgba(148,183,224,.24);border-radius:24px;background:var(--panel);box-shadow:0 24px 80px rgba(0,0,0,.42)}.form-card h2{margin:0 0 8px;font-size:clamp(1.7rem,3vw,2.3rem)}.form-card>p{margin:0 0 24px;color:var(--muted);line-height:1.6}form{display:grid;gap:15px}.row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}label{display:grid;gap:8px;color:#dbeaff;font-size:.86rem;font-weight:700}input,select,textarea{width:100%;min-height:48px;padding:12px 14px;border:1px solid rgba(148,183,224,.24);border-radius:11px;color:var(--text);background:rgba(3,12,23,.72);font:inherit;outline:none}textarea{min-height:115px;resize:vertical}input:focus,select:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(66,199,255,.1)}select option{background:#091525}.fine{margin:-2px 0 0;color:#8398af;font-size:.76rem;line-height:1.5}.status{display:none;padding:12px 14px;border-radius:11px;font-size:.86rem}.status.ok{display:block;border:1px solid rgba(116,227,163,.3);color:#bdf7d3;background:rgba(116,227,163,.08)}.status.error{display:block;border:1px solid rgba(255,110,110,.35);color:#ffd0d0;background:rgba(255,80,80,.08)}.highlights{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;overflow:hidden;margin:4px 0 68px;border:1px solid var(--line);border-radius:18px;background:var(--line)}.highlights div{padding:24px 18px;background:rgba(7,17,30,.95);text-align:center}.highlights strong{display:block;margin-bottom:6px}.highlights span{color:var(--muted);font-size:.82rem;line-height:1.45}footer{display:flex;justify-content:space-between;gap:20px;padding:26px 0 34px;border-top:1px solid var(--line);color:#7f93aa;font-size:.82rem}@media(max-width:900px){.hero{grid-template-columns:1fr}.services{grid-template-columns:1fr 1fr}}@media(max-width:600px){header{min-height:72px}.cta{display:none}.hero{padding-top:42px;gap:36px}.row,.services,.highlights{grid-template-columns:1fr}footer{flex-direction:column}}
  </style></head><body><div class="shell"><header><a class="brand" href="/"><span class="mark">T</span><span>TalonDNS<small>FiveM business web services</small></span></a><a class="cta" href="#register">Request service</a></header><main><section class="hero"><div><span class="eyebrow">Built for FiveM businesses</span><h1>Your business deserves a <span class="gradient">real online presence.</span></h1><p class="lead">Get a clean TalonDNS redirect, connect your own domain, or have a complete custom website designed for your in-city business.</p><div class="services"><div class="service"><strong>Short Redirect</strong><span>A simple link such as <code>talondns.com/yourbusiness</code> that sends visitors to your existing site.</span></div><div class="service"><strong>Custom Domain</strong><span>Connect a domain such as <code>examplebusiness.com</code> to your existing hosted website.</span></div><div class="service"><strong>Full Website Design</strong><span>A complete branded, mobile-friendly site built specifically for your FiveM business.</span></div><div class="service"><strong>Backend & Admin Tools</strong><span>Employee rosters, job applications, vehicle inventory, and apartment or home listings for sale or rent.</span></div></div></div><div class="form-card" id="register"><h2>Request FiveM web services</h2><p>Submit your details below. Your request will be stored securely for review.</p><form id="request-form"><div class="row"><label>Character name<input name="character_name" required placeholder="Character name"></label><label>State ID<input name="state_id" required placeholder="State ID"></label></div><div class="row"><label>Discord username<input name="discord_username" required placeholder="Discord username"></label><label>FiveM server<input name="fivem_server" required placeholder="Server name"></label></div><label>Business name<input name="business_name" required placeholder="Business name"></label><label>Service requested<select name="service_type" required><option value="">Select a service</option><option>TalonDNS redirect</option><option>Custom domain connection</option><option>Custom website design</option><option>Custom website with backend</option><option>Website design, hosting, and domain</option><option>Not sure yet</option></select></label><div class="row"><label>Requested short link<input name="requested_slug" placeholder="yourbusiness"></label><label>Custom domain<input name="custom_domain" placeholder="examplebusiness.com"></label></div><label>Existing website URL<input type="url" name="existing_website" placeholder="https://example.com"></label><label>Features needed<select name="feature_package"><option value="">Select the closest option</option><option>Basic informational website</option><option>Employee roster and profiles</option><option>Job application system</option><option>Vehicle inventory or dealership stock</option><option>Apartments or homes for sale or rent</option><option>Multiple features / full business portal</option></select></label><label>Project details<textarea name="project_details" required placeholder="Describe your business, the pages or tools you need, and any ideas you already have."></textarea></label><div class="status" id="status" role="status"></div><button type="submit">Submit request</button><p class="fine">Your submission is stored in the TalonDNS request system and reviewed through the private admin dashboard.</p></form></div></section><section class="highlights"><div><strong>FiveM Focused</strong><span>Designed for in-city businesses and organizations</span></div><div><strong>Custom Built</strong><span>Layouts and tools matched to your business</span></div><div><strong>Managed Backend</strong><span>Admin tools for updating your site content</span></div><div><strong>Responsive</strong><span>Built for desktop, tablet, and mobile</span></div></section></main><footer><span>© ${year} TalonDNS</span><span>FiveM redirects · Domains · Custom websites · Business portals</span></footer></div><script>
  const form=document.getElementById('request-form'),statusBox=document.getElementById('status');form.addEventListener('submit',async e=>{e.preventDefault();statusBox.className='status';statusBox.textContent='Submitting request...';const body=Object.fromEntries(new FormData(form));try{const r=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error(data.error||'Unable to submit request.');statusBox.className='status ok';statusBox.textContent='Request submitted successfully. Reference: '+data.reference;form.reset()}catch(err){statusBox.className='status error';statusBox.textContent=err.message}});
  </script></body></html>`;
}

function loginPage(error = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TalonDNS Admin</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07101d;color:#f4f8ff;font-family:system-ui}.card{width:min(420px,calc(100% - 32px));padding:32px;border:1px solid #29415e;border-radius:20px;background:#0d1c30;box-shadow:0 20px 60px #0008}h1{margin-top:0}p{color:#aebfd3}input,button{width:100%;min-height:48px;border-radius:10px;font:inherit}input{padding:0 13px;border:1px solid #36516f;background:#071321;color:white}button{margin-top:14px;border:0;background:#42c7ff;font-weight:800;cursor:pointer}.error{color:#ffb4b4}</style></head><body><form class="card" method="post" action="/admin/login"><h1>TalonDNS Admin</h1><p>Sign in to review FiveM business requests.</p>${error ? `<p class="error">${esc(error)}</p>` : ''}<input type="password" name="password" placeholder="Admin password" required autofocus><button>Sign in</button></form></body></html>`;
}

function adminPage() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TalonDNS Requests</title><style>body{margin:0;background:#07101d;color:#f4f8ff;font-family:system-ui}.wrap{width:min(1400px,calc(100% - 28px));margin:auto}header{display:flex;justify-content:space-between;align-items:center;padding:25px 0;border-bottom:1px solid #29415e}a{color:#9edfff}.toolbar{display:flex;gap:10px;align-items:center}button,select{min-height:38px;border-radius:8px;border:1px solid #36516f;background:#10243c;color:white;padding:0 10px}.grid{display:grid;gap:15px;padding:24px 0}.card{padding:20px;border:1px solid #29415e;border-radius:16px;background:#0d1c30}.top{display:flex;justify-content:space-between;gap:12px;align-items:start}.card h2{margin:0 0 4px}.meta{color:#9eb1c7;font-size:.9rem}.details{white-space:pre-wrap;color:#d9e5f3;line-height:1.55}.fields{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}.field{padding:10px;border-radius:9px;background:#081524}.field strong{display:block;color:#8ba4bd;font-size:.72rem;text-transform:uppercase;margin-bottom:4px}.empty{padding:50px;text-align:center;color:#9eb1c7}@media(max-width:850px){.fields{grid-template-columns:1fr}.top{flex-direction:column}}</style></head><body><div class="wrap"><header><div><h1>FiveM Web Requests</h1><div class="meta">TalonDNS administration</div></div><div class="toolbar"><button onclick="loadRequests()">Refresh</button><a href="/admin/logout">Sign out</a></div></header><main id="requests" class="grid"><div class="empty">Loading requests...</div></main></div><script>
  const container=document.getElementById('requests');const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));async function loadRequests(){container.innerHTML='<div class="empty">Loading requests...</div>';const r=await fetch('/api/admin/requests');if(r.status===401){location='/admin';return}const data=await r.json();if(!data.length){container.innerHTML='<div class="empty">No requests have been submitted.</div>';return}container.innerHTML=data.map(x=>`<article class="card"><div class="top"><div><h2>${'${escapeHtml(x.business_name)}'}</h2><div class="meta">${'${escapeHtml(x.reference)}'} · ${'${new Date(x.created_at).toLocaleString()}'}</div></div><select onchange="updateStatus('${'${x.id}'}',this.value)">${STATUSES.map(s=>`<option ${'${x.status===\'' + s + "'?'selected':''}"}'>${s}</option>`).join('')}</select></div><div class="fields"><div class="field"><strong>Character</strong>${'${escapeHtml(x.character_name)}'} (${ '${escapeHtml(x.state_id)}' })</div><div class="field"><strong>Discord</strong>${'${escapeHtml(x.discord_username)}'}</div><div class="field"><strong>Server</strong>${'${escapeHtml(x.fivem_server)}'}</div><div class="field"><strong>Service</strong>${'${escapeHtml(x.service_type)}'}</div><div class="field"><strong>Short Link</strong>${'${escapeHtml(x.requested_slug)||\'—\'}'}</div><div class="field"><strong>Custom Domain</strong>${'${escapeHtml(x.custom_domain)||\'—\'}'}</div><div class="field"><strong>Existing Site</strong>${'${escapeHtml(x.existing_website)||\'—\'}'}</div><div class="field"><strong>Features</strong>${'${escapeHtml(x.feature_package)||\'—\'}'}</div></div><div class="details">${'${escapeHtml(x.project_details)}'}</div></article>`).join('')}async function updateStatus(id,status){const r=await fetch('/api/admin/requests/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});if(!r.ok)alert('Unable to update status.')}loadRequests();
  </script></body></html>`;
}

async function createRequest(req, res) {
  try {
    const data = await readBody(req);
    const required = ['character_name', 'state_id', 'discord_username', 'fivem_server', 'business_name', 'service_type', 'project_details'];
    for (const field of required) if (!String(data[field] || '').trim()) return json(res, 400, { error: `Missing required field: ${field.replaceAll('_', ' ')}.` });
    const reference = `TD-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const record = {
      reference,
      character_name: String(data.character_name).trim().slice(0, 100),
      state_id: String(data.state_id).trim().slice(0, 50),
      discord_username: String(data.discord_username).trim().slice(0, 100),
      fivem_server: String(data.fivem_server).trim().slice(0, 120),
      business_name: String(data.business_name).trim().slice(0, 150),
      service_type: String(data.service_type).trim().slice(0, 100),
      requested_slug: String(data.requested_slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '').slice(0, 80) || null,
      custom_domain: String(data.custom_domain || '').trim().slice(0, 200) || null,
      existing_website: String(data.existing_website || '').trim().slice(0, 500) || null,
      feature_package: String(data.feature_package || '').trim().slice(0, 150) || null,
      project_details: String(data.project_details).trim().slice(0, 5000),
      status: 'New'
    };
    await supabase(TABLE, { method: 'POST', body: JSON.stringify(record) });
    return json(res, 201, { ok: true, reference });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: 'The request could not be saved. Please try again later.' });
  }
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (req.method === 'GET' && redirects[path]) {
    res.writeHead(308, { Location: redirects[path] });
    return res.end();
  }
  if (path === '/' && req.method === 'GET') return html(res, 200, publicPage());
  if (path === '/api/requests' && req.method === 'POST') return createRequest(req, res);

  if (path === '/admin' && req.method === 'GET') return html(res, 200, isAdmin(req) ? adminPage() : loginPage());
  if (path === '/admin/login' && req.method === 'POST') {
    const data = await readBody(req);
    const configured = process.env.ADMIN_PASSWORD || '';
    if (!configured || String(data.password || '') !== configured) return html(res, 401, loginPage('Incorrect password.'));
    res.writeHead(302, { Location: '/admin', 'Set-Cookie': `talondns_admin=${signSession()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200` });
    return res.end();
  }
  if (path === '/admin/logout') {
    res.writeHead(302, { Location: '/admin', 'Set-Cookie': 'talondns_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
    return res.end();
  }
  if (path === '/api/admin/requests' && req.method === 'GET') {
    if (!isAdmin(req)) return json(res, 401, { error: 'Unauthorized' });
    try {
      const data = await supabase(`${TABLE}?select=*&order=created_at.desc`, { method: 'GET' });
      return json(res, 200, data);
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: 'Unable to load requests.' });
    }
  }
  const statusMatch = path.match(/^\/api\/admin\/requests\/([0-9a-f-]+)$/);
  if (statusMatch && req.method === 'PATCH') {
    if (!isAdmin(req)) return json(res, 401, { error: 'Unauthorized' });
    try {
      const data = await readBody(req);
      if (!STATUSES.includes(data.status)) return json(res, 400, { error: 'Invalid status.' });
      await supabase(`${TABLE}?id=eq.${encodeURIComponent(statusMatch[1])}`, { method: 'PATCH', body: JSON.stringify({ status: data.status, updated_at: new Date().toISOString() }) });
      return json(res, 200, { ok: true });
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: 'Unable to update request.' });
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
}
