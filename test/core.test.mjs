// Purpose: Verify beam calls, policy variation, versioned cache, extraction, batch and shadow.
import test from'node:test';import assert from'node:assert/strict';import{FakeJev,classify,extractHtml,batch,fetchText}from'../src/index.mjs';
const taxonomy={version:'3.1-local',categories:[{id:'news',children:[{id:'politics'}]},{id:'sport',children:[{id:'football'}]}]},risks={dimensions:[{id:'crime'}]};
test('two-pass beam reaches child',async()=>{const p=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:1,probability:.8}});const r=await classify({text:'x'},{taxonomy,risks,policy:{version:'1',maxRisk:{crime:2}},provider:p});assert.deepEqual(r.categories,['news','politics']);assert.equal(p.calls.length,2)});
test('same page varies by policy',async()=>{for(const[max,expected]of[[3,'allow'],[1,'review'],[0,'block']]){const p=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:1,probability:.8}});assert.equal((await classify({text:'x'},{taxonomy,risks,policy:{version:String(max),maxRisk:{crime:max}},provider:p})).decision.decision,expected)}});
test('cache and version invalidation',async()=>{const values=new Map,cache={get:async k=>values.get(k),set:async(k,v)=>values.set(k,v)},p=new FakeJev({top:{choice:'news'},child:{choice:'politics'}}),o={taxonomy,risks,policy:{version:'1'},provider:p,cache};await classify({text:'x'},o);assert.equal((await classify({text:'x'},o)).cacheHit,true);assert.equal(p.calls.length,2);await classify({text:'x'},{...o,taxonomy:{...taxonomy,version:'new'}});assert.equal(p.calls.length,4)});
test('extract truncates and strips script',()=>{const x=extractHtml('<h1>Head</h1><script>bad()</script><p>Body words</p>',12);assert.match(x,/Head/);assert.doesNotMatch(x,/bad/);assert.equal(x.length,12)});
test('batch limit and shadow',async()=>{await assert.rejects(()=>batch([{},{}],{},1),/limit/);const log=[],p=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:3,probability:1}});const r=await classify({text:'x'},{taxonomy,risks,policy:{version:'1',maxRisk:{crime:0}},provider:p,shadow:true,shadowLog:log});assert.equal(r.decision.decision,'allow');assert.equal(log.length,1)});
test('fetch timeout is structured',async()=>{await assert.rejects(()=>fetchText('https://example.test',{fetchImpl:async()=>{throw Error('timeout')}}),/upstream_fetch_failed/)});

test('same version with different policy contents or shadow mode cannot reuse an allow',async()=>{
 const values=new Map,cache={get:async k=>values.get(k),set:async(k,v)=>values.set(k,v)},provider=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:3,probability:1}});
 const base={taxonomy,risks,cache,provider,policy:{version:'same',maxRisk:{crime:0}}};
 assert.equal((await classify({text:'x'},{...base,shadow:true})).decision.decision,'allow');
 assert.equal((await classify({text:'x'},base)).decision.decision,'block');
 assert.equal((await classify({text:'x'},{...base,policy:{version:'same',maxRisk:{crime:3}}})).decision.decision,'review');
 assert.equal(provider.calls.length,6);
});
test('changed fixture identity invalidates cache and returned objects cannot corrupt it',async()=>{
 const values=new Map,cache={get:async k=>values.get(k),set:async(k,v)=>values.set(k,v)},provider=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:1,probability:.8}});
 const options={taxonomy,risks,cache,provider,policy:{version:'one',maxRisk:{crime:2}}};
 const first=await classify({text:'x'},options);first.decision.decision='block';assert.equal((await classify({text:'x'},options)).decision.decision,'allow');
 provider.fixtures.crime.severity=3;assert.equal((await classify({text:'x'},options)).decision.decision,'block');
});
test('malformed semantic replies cannot default to harmless risks',async()=>{
 for(const crime of [{probability:.9},{severity:NaN,probability:.9},{severity:1,probability:2}]){
  await assert.rejects(classify({text:'x'},{taxonomy,risks,provider:new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime})}),/out of contract/);
 }
});

test('nonfinite policies and nonportable custom cache identities fail before cache lookup',async()=>{
 const cache={get(){throw new Error('must not reach cache');}};
 await assert.rejects(classify({text:'x'},{taxonomy,risks,cache,policy:{maxRisk:{crime:NaN}}}),/Invalid policy/);
 await assert.rejects(classify({text:'x'},{taxonomy,risks,cache,provider:{cacheIdentity:()=>{},judge(){throw Error('must not call');}}}),/Invalid policy/);
});
