/* Shared presentation-only pagination. Production keeps owner-backed cursor queries. */
const pagerSizes=[25,50,100];
function pageState(total,page=1,size=25){size=pagerSizes.includes(Number(size))?Number(size):25;const pages=Math.max(1,Math.ceil(total/size));page=Math.min(pages,Math.max(1,Number.parseInt(page)||1));return {page,size,pages,start:total?(page-1)*size+1:0,end:Math.min(page*size,total),total};}
function pagination(scope,p){
 const noun=scope==='staff'?'staff':'accounts';
 const summary=p.total<=p.size?`${p.total} ${noun}`:`${p.start}–${p.end} of ${p.total}`;
 const compact=p.total<=25;
 return `<div class="table-pagination quiet-pagination ${compact?'single-page':''}" aria-label="${scope==='staff'?'Staff':'Access'} pagination"><span class="pagination-range" role="status" aria-live="polite">${summary}</span>${compact?'':`<div class="pagination-controls"><label class="page-size-select"><select data-page-size="${scope}" aria-label="${scope==='staff'?'Staff':'Access'} rows per page">${pagerSizes.map(n=>`<option value="${n}" ${p.size===n?'selected':''}>${n} / page</option>`).join('')}</select><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></label><nav class="pagination-nav" aria-label="${scope==='staff'?'Staff':'Access'} result pages"><button class="page-control" data-page-scope="${scope}" data-page="${p.page-1}" ${p.page===1?'disabled':''} title="Previous page" aria-label="Previous ${scope} page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button class="page-control" data-page-scope="${scope}" data-page="${p.page+1}" ${p.page===p.pages?'disabled':''} title="Next page" aria-label="Next ${scope} page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></nav></div>`}</div>`;
}
function changePage(scope,page,size){if(scope==='staff'){query.page=page;query.size=size||query.size||25;syncQuery(true);}else{const u=new URLSearchParams(location.hash.split('?')[1]||'');u.set('page',page);u.set('size',size||u.get('size')||25);location.hash='access?'+u.toString();}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-page-scope]');if(b&&!b.disabled)changePage(b.dataset.pageScope,+b.dataset.page);});
document.addEventListener('change',e=>{if(e.target.matches('[data-page-size]'))changePage(e.target.dataset.pageSize,1,+e.target.value);});
