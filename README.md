# jev-brandsafety

**Classify page context in a two-pass taxonomy beam, score configurable risks, and apply advertiser-owned policy with versioned caching.**

[![Tests](https://github.com/gbesse/jev-brandsafety/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-brandsafety/actions/workflows/test.yml) ![MIT](https://img.shields.io/badge/license-MIT-blue) ![Node](https://img.shields.io/badge/node-22%2B-green) ![Public alpha](https://img.shields.io/badge/status-public_alpha-orange)

## 30-second offline quick start
`git clone https://github.com/gbesse/jev-brandsafety.git && cd jev-brandsafety && npm install && npm run demo`. Fixtures are synthetic.

## Call real Jev
Set `TYPESAFE_API_KEY` before a reviewed adapter sends paid requests to `api.typesafe.ai`. This alpha leaves the transport and HTTP server unwired; `npm run live-smoke` makes zero calls.

## Library and integration
Import `classify`, `batch`, `decide`, `extractHtml`, `fetchText`, `DiskCache`, and `FakeJev`. Flat text/HTML objects are supported; the returned categories, risk vector, decision, reason, and cache-hit flag fit a bid-time content integration.

## How it decides
Pass one chooses a top category. Pass two chooses a child and fans out configured risk severity questions. Excluded categories and maximum risk per dimension are code-owned policy. Shadow mode logs the raw block while returning allow. Cache identity includes content, taxonomy version and policy version.

## Standards and boundaries
Editable data is intended to map to [IAB Tech Lab Content Taxonomy 3.1](https://iabtechlab.com/standards/content-taxonomy/) and the historical [GARM Brand Safety Floor + Suitability Framework](https://wfanet.org/knowledge/item/2022/06/17/GARM-Brand-Safety-Floor--Suitability-Framework-3); WFA states GARM was discontinued on 8 August 2024. This project is not affiliated with or certified by IAB Tech Lab, WFA, GARM, any measurement vendor, or standards body, and claims no accreditation. Operator configuration—not bundled labels—is authoritative. No live benchmark is claimed.

## Validation
Run `npm run check && npm run typecheck && npm test && npm run demo`; CI uses Node 22 and 24.

## Related projects
[DecisionPacks](https://github.com/gbesse/decisionpacks), [Question Forge](https://github.com/gbesse/question-forge), and [jev-rerank-server](https://github.com/gbesse/jev-rerank-server).

Independent project; not affiliated with TypeSafe AI. [API docs](https://docs.typesafe.ai/api) · [model notes](https://docs.typesafe.ai/model-jaggedness/jev-1.13/)
