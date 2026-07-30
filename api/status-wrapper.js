import siteHandler from './site-wrapper.js';

function captureResponse(){
  let status=200,headers={},chunks=[];
  return{
    writeHead(code,h={}){status=code;headers={...headers,...h}},
    setHeader(k,v){headers[k]=v},
    getHeader(k){return headers[k]},
    end(chunk=''){if(chunk)chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(String(chunk)))},
    result(){return{status,headers,body:Buffer.concat(chunks).toString('utf8')}}
  };
}

function sendCaptured(res,out,body){
  const headers={...out.headers};
  delete headers['Content-Length'];
  delete headers['content-length'];
  res.writeHead(out.status,headers);
  res.end(body);
}

function updateAdminFilters(html){
  return html
    .replace(
      '<option value="">All statuses</option>',
      '<option value="open" selected>Open / In Progress</option><option value="">All statuses</option>'
    )
    .replace(
      "(!status||x.status===status)",
      "(!status||(status==='open'?!['Completed','Declined'].includes(x.status):x.status===status))"
    );
}

export default async function handler(req,res){
  const path=new URL(req.url,'http://'+req.headers.host).pathname.toLowerCase().replace(/\/$/,'')||'/';
  if(path==='/admin'&&req.method==='GET'){
    const proxy=captureResponse();
    await siteHandler(req,proxy);
    const out=proxy.result();
    const contentType=String(out.headers['Content-Type']||out.headers['content-type']||'');
    const body=contentType.includes('text/html')?updateAdminFilters(out.body):out.body;
    return sendCaptured(res,out,body);
  }
  return siteHandler(req,res);
}
