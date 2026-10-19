import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, FakeJev, extractHtml } from '../src/index.mjs';
const taxonomy={categories:[{id:'news',children:[{id:'politics'}]}]},risks={dimensions:[{id:'crime'}]},policy={version:'test',maxRisk:{crime:2}};
const provider=()=>new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:0,probability:1}});
test('a harmless prefix cannot authorize truncated content',async()=>{
 const result=await classify({text:'safe prefix hidden tail',maxChars:11},{taxonomy,risks,policy,provider:provider()});
 assert.equal(result.decision.decision,'review');assert.equal(result.decision.reason,'truncated_content');assert.equal(result.content.truncated,true);assert.equal(result.content.analyzedCharacters,11);
});
test('different documents with the same analyzed prefix retain distinct cache provenance',async()=>{
 const values=new Map(),cache={get:async k=>values.get(k),set:async(k,v)=>values.set(k,v)},p=provider(),options={taxonomy,risks,policy,cache,provider:p};
 const a=await classify({text:'same prefix tail A',maxChars:11},options),b=await classify({text:'same prefix tail B',maxChars:11},options);
 assert.equal(b.cacheHit,false);assert.notEqual(a.content.sourceSha256,b.content.sourceSha256);assert.equal(p.calls.length,4);
});
test('empty extracted content is review with no semantic call',async()=>{
 const p=provider();const result=await classify({html:'<script>hidden()</script>'},{taxonomy,risks,policy,provider:p});assert.equal(result.decision.reason,'empty_content');assert.equal(p.calls.length,0);
});
test('invalid truncation limits cannot yield an empty allow',async()=>{
 for(const maxChars of [0,-1,NaN,Infinity,1.5])await assert.rejects(classify({text:'content',maxChars},{taxonomy,risks,policy,provider:provider()}),/character limit/);
 assert.throws(()=>extractHtml('content',NaN),/character limit/);
});
test('oversized sources cannot lose a hidden tail at the normalization bound',async()=>{
 await assert.rejects(classify({text:'x'.repeat(1000001),maxChars:1000000},{taxonomy,risks,policy,provider:provider()}),/oversized/);
});
test('known risk blocks remain blocks, and empty shadow runs remain observable',async()=>{
 const p=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:3,probability:1}});
 assert.equal((await classify({text:'long context',maxChars:3},{taxonomy,risks,policy,provider:p})).decision.decision,'block');
 const log=[];await classify({text:''},{taxonomy,risks,policy,provider:provider(),shadow:true,shadowLog:log});assert.equal(log[0].decision.reason,'empty_content');
});
