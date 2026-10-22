import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,FakeJev} from '../src/index.mjs';
const taxonomy={categories:[{id:'news',children:[{id:'politics'}]}]},risks={dimensions:[{id:'crime'}]};
test('fresh shadow evidence cannot be changed through the returned decision or vice versa',async()=>{
 const log=[],provider=new FakeJev({top:{choice:'news'},child:{choice:'politics'},crime:{severity:3,probability:1}});
 const result=await classify({text:'synthetic'},{taxonomy,risks,provider,policy:{maxRisk:{crime:0}},shadow:true,shadowLog:log});
 assert.equal(log[0].decision.shadowDecision.decision,'block');
 result.decision.shadowDecision.decision='allow';result.risks.crime.severity=0;result.categories.push('injected');
 assert.equal(log[0].decision.shadowDecision.decision,'block');assert.equal(log[0].risks.crime.severity,3);assert.deepEqual(log[0].categories,['news','politics']);
 log[0].content.analyzedCharacters=999;assert.notEqual(result.content.analyzedCharacters,999);
});
test('cached shadow evidence is also detached on replay',async()=>{
 const values=new Map,cache={get:async k=>values.get(k),set:async(k,v)=>values.set(k,v)},log=[];
 const options={taxonomy,risks,cache,provider:new FakeJev(),policy:{},shadow:true,shadowLog:log};
 await classify({text:'synthetic'},options);const replay=await classify({text:'synthetic'},options);
 replay.categories.push('injected');assert.deepEqual(log[1].categories,['news','politics']);
});
