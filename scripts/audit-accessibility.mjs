import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright-core';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.A11Y_BASE_URL||'http://127.0.0.1:4317';
const routes=[];
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(entry.name==='index.html')routes.push('/'+path.relative(path.join(root,'public'),dir).split(path.sep).filter(Boolean).join('/'));}}
await walk(path.join(root,'public'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true});
const axePath=path.join(root,'node_modules/axe-core/axe.min.js');
const results=[];
try{
 for(const width of (process.env.A11Y_WIDTHS||'1280,320').split(',').map(Number)){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of routes){
   const errors=[];const onError=error=>errors.push(error.message);page.on('pageerror',onError);
   await page.goto(base+route,{waitUntil:'networkidle'});
   await page.addScriptTag({path:axePath});
   const audit=await page.evaluate(async()=>await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));
   const layout=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,h1:document.querySelectorAll('main h1').length,outOfBounds:[...document.querySelectorAll('main h1,main h2,main h3,main p,main input,main textarea')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.x<-.5||r.right>innerWidth+.5)}).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,60)}))}));
   const item={route,width,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),manualReview:audit.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),layout,errors};
   results.push(item);page.off('pageerror',onError);
   console.log(`${item.violations.length||errors.length||layout.documentWidth>width||layout.outOfBounds.length?'FAIL':'PASS'} ${width} ${route} ${item.violations.map(v=>v.id+':'+v.nodes.length).join(', ')}${layout.documentWidth>width?' overflow:'+layout.documentWidth:''}`);
  }
  await page.close();
 }
}finally{await browser.close()}
await fs.mkdir(path.join(root,'a11y-reports'),{recursive:true});
await fs.writeFile(path.join(root,'a11y-reports/audit.json'),JSON.stringify(results,null,2));
const failures=results.filter(r=>r.violations.length||r.errors.length||r.layout.main!==1||r.layout.h1!==1||r.layout.documentWidth>r.width||r.layout.outOfBounds.length);
console.log(`${results.length} page/viewport audits; ${failures.length} failing. Automated checks do not establish full WCAG conformance; see ACCESSIBILITY.md for manual checks.`);
if(failures.length)process.exitCode=1;
