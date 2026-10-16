from pathlib import Path
import json,re
r=Path(__file__).resolve().parent
c=json.loads((r/'COVERAGE.json').read_text()); q=json.loads((r/'EXECUTION_QUEUE.json').read_text())['tasks']
assert len(c)==46 and len({x['workflow'] for x in c})==46
assert sum(x['definition'] is not None for x in c)==36
for x in c:
 if x['definition']: assert (r/x['definition']).is_file(),x
ids={x['id'] for x in q}; assert len(ids)==len(q)
for x in q: assert set(x['dependsOn'])<=ids,x
seen=set(); active=set(); by={x['id']:x for x in q}
def visit(k):
 assert k not in active,('cycle',k)
 if k in seen:return
 active.add(k)
 for d in by[k]['dependsOn']:visit(d)
 active.remove(k);seen.add(k)
for k in ids:visit(k)
w=[x['workflow'] for x in q if x['kind']=='workflow'];assert len(w)==36 and len(set(w))==36
assert set(w)=={x['workflow'] for x in c if x['definition']}
for p in r.rglob('*.md'):
 s=p.read_text();assert s.count('```')%2==0,p
 for dest in re.findall(r'\]\(([^)]+)\)',s):
  if not dest.startswith(('http','#','mailto:')):assert (p.parent/dest.split('#')[0]).exists(),(p,dest)
print('PASS: 46 baseline rows; 36 definitions; 36 unique workflow tasks; dependency DAG; files and fences valid.')
