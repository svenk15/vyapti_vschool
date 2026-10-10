from pathlib import Path
import json,re,hashlib,base64
root=Path(__file__).resolve().parents[2];out=root/'implementation-spec';out.mkdir(exist_ok=True)
manifest=[];roles={}
for p in (root/'packs').iterdir():
 if not p.is_dir() or not (p/'workflow-catalog.json').exists():continue
 htmls=list(p.glob('*Review.html')) or list(p.glob('*Workflows.html'))
 if not htmls:continue
 html=htmls[0];s=html.read_text();role=p.name;d=out/'sources'/role;d.mkdir(parents=True,exist_ok=True)
 styles=re.findall(r'<style[^>]*>(.*?)</style>',s,re.S|re.I)
 fonts=[]
 def extract(m):
  mime,enc=m.group(1),m.group(2);data=base64.b64decode(enc);sha=hashlib.sha256(data).hexdigest();name='font-'+sha[:12]+('.woff2' if 'woff2' in mime else '.otf');(d/name).write_bytes(data);fonts.append({'asset':name,'mime':mime,'sha256':sha});return 'url("'+name+'")'
 css=[]
 for i,st in enumerate(styles):
  clean=re.sub(r'url\([\"\']?data:([^;,]+);base64,([^\)\"\']+)[\"\']?\)',extract,st)
  (d/f'style-{i:02}.css').write_text(clean);css.append(f'style-{i:02}.css')
 rules=[]
 for i,st in enumerate(styles):
  for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',st):
   sel=m.group(1).strip();body=m.group(2)
   if 'base64,' in body: body=re.sub(r'url\([^)]*\)','url(embedded asset; see font manifest)',body)
   rules.append({'styleBlock':i,'selector':sel,'declarations':body})
 (d/'rules-index.json').write_text(json.dumps(rules,indent=2))
 toks=[{'styleBlock':i,'selector':m.group(1).strip(),'tokens':dict(re.findall(r'(--[\w-]+)\s*:\s*([^;}]+)',m.group(2)))} for i,st in enumerate(styles) for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',st) if '--' in m.group(2)]
 (d/'tokens.json').write_text(json.dumps(toks,indent=2));(d/'fonts.json').write_text(json.dumps(fonts,indent=2))
 c=json.loads((p/'workflow-catalog.json').read_text());roles[role]={'html':str(html.relative_to(root)),'catalog':str((p/'workflow-catalog.json').relative_to(root)),'workflows':len(c['workflows'] if isinstance(c,dict) else c),'sourceSha256':hashlib.sha256(html.read_bytes()).hexdigest(),'styles':css}
 manifest.append(roles[role])
 (d/'README.md').write_text(f'# {role} source extraction\n\nSource: `{roles[role]["html"]}`\n\nCSS files preserve source block order. They are reference evidence, not globally installable production styles. Keep selector specificity, nested media rules and later overrides. rules-index.json is a search aid only; nested media context is authoritative in the CSS files. tokens.json contains declared tokens, not a flattened cascade. fonts.json inventories embedded assets, not fonts merely named in a fallback stack. Prototype business logic is not production code.\n')
admin=root/'packs/VSchool_School_Admin_Design';cat=json.loads((admin/'workflow-catalog.json').read_text()); cards=out/'administrator/workflows';cards.mkdir(parents=True,exist_ok=True)
index=[]
for w in cat['workflows']:
 ident=w['id'];index.append({'id':ident,'title':w['title'],'module':w['module'],'route':'#/flow/'+ident,'contract':f'workflows/{ident}.md','status':'SOURCE_EXTRACTED_NOT_IMPLEMENTATION_VERIFIED'})
 lines=[f'# {ident} — {w["title"]}', '',f'Owner area: {w["module"]}. Reference entry: `#/flow/{ident}`. Historical design phase: {w.get("phase")}; phase is not current implementation status.', '', '## Authority and outcome', '',f'Capability described by catalog: {w.get("capability","Unspecified")}', '',f'Outcome: {w.get("outcome","Unspecified")}', '',f'Invariant: {w.get("rule","Unspecified")}', '',f'Recovery: {w.get("edge","Unspecified")}', '',f'Data ownership: {w.get("data","Unspecified")}', '', '## Exact catalog steps and fields', '']
 for j,step in enumerate(w.get('steps',[]),1):
  lines += [f'### Step {j}: {step.get("title","")}', '',step.get('help',''), '', '| Key | Label | Control | Required | Options |', '|---|---|---|---|---|']
  for f in step.get('fields',[]):
   vals=[f.get('name',''),f.get('label',''),f.get('type',''),str(f.get('required',False)),json.dumps(f.get('options',[]),ensure_ascii=False)]
   lines.append('| '+' | '.join(str(v).replace('|','\\|').replace('\n',' ') for v in vals)+' |')
  lines+=['']
 lines+=['## Component and delivery contract','','Use the shared component contracts and ordered source CSS. Render fields with the specified control, label, required marker, helper/error placement and form-grid/wizard/footer recipe. Keep Back/Continue separate from Save draft and leave. Resolve actual labels and available operations against the live reference; dedicated Families/Communication/Timetable views may supersede the generic catalog wizard.','','## Explicit implementation boundary','','Catalog option values may be fictional records: populate real selectors from authorized server projections. This card does not approve prototype in-memory writes, enum values, database schema, public identity disclosure or permissions. Translate capability descriptions into the accepted backend contract. For every submission map UI → validated DTO → use case → owner port → scoped transaction → result. Do not infer business maxima, retention, draft ownership or authority from unspecified fields. Record unresolved decisions in the owner LLD.','','## Acceptance','','- Match each implemented step with the reference at desktop/mobile widths; include labels, hints, validation, action placement and relevant state.','- Verify normal outcome and the stated failure/recovery rule with real persistence/authorization.','- Include loading, empty, denied, invalid, stale/unknown outcome states where applicable; if the reference has no visual specification, use an approved shared pattern and mark that addition for review.','- Keep reference extraction, production implementation, functional verification, visual comparison and human acceptance separate.','','## Full original catalog record','','```json',json.dumps(w,ensure_ascii=False,indent=2),'```']
 (cards/f'{ident}.md').write_text('\n'.join(lines))
(out/'administrator/workflow-index.json').write_text(json.dumps(index,indent=2));(out/'SOURCE_MANIFEST.json').write_text(json.dumps(roles,indent=2))
print('roles',len(roles),'admin workflows',len(index))
