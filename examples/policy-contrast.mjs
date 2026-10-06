// Compare three advertiser-owned policies against the same synthetic risk vector.
import assert from 'node:assert/strict';
import {decide} from '../src/index.mjs';

const risks = {crime: {severity: 2, probability: 0.9}};
const categories = ['news', 'politics'];
const results = [1, 2, 3].map(max => ({max, ...decide(risks, categories, {version: `fixture-${max}`, maxRisk: {crime: max}})}));
assert.deepEqual(results.map(result => result.decision), ['block', 'review', 'allow']);
console.log(JSON.stringify({source: 'synthetic risk; no model call', results}, null, 2));
