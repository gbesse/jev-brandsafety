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

Run `node examples/policy-contrast.mjs` to apply three advertiser-owned limits to one synthetic risk vector: block, review and allow. The policy changes the action; the fixture does not claim measured classifier quality. / Trois limites de l'annonceur donnent bloquer, revoir ou autoriser sur le même risque synthétique. / Tres límites del anunciante producen bloquear, revisar o permitir ante el mismo riesgo sintético.
Pass one chooses a top category. Pass two chooses a child and fans out configured risk severity questions. Excluded categories and maximum risk per dimension are code-owned policy. Shadow mode logs the raw block while returning allow. Cache identity includes content, taxonomy version and policy version.

## Standards and boundaries
Editable data is intended to map to [IAB Tech Lab Content Taxonomy 3.1](https://iabtechlab.com/standards/content-taxonomy/) and the historical [GARM Brand Safety Floor + Suitability Framework](https://wfanet.org/knowledge/item/2022/06/17/GARM-Brand-Safety-Floor--Suitability-Framework-3); WFA states GARM was discontinued on 8 August 2024. This project is not affiliated with or certified by IAB Tech Lab, WFA, GARM, any measurement vendor, or standards body, and claims no accreditation. Operator configuration—not bundled labels—is authoritative. No live benchmark is claimed.

## Shareable demo report

Run `npm run demo:report` to capture this repository’s bundled example as one JSON object with the project purpose, version and complete demo output. The command fails if the demo fails, so the report is useful when sharing a reproducible first look or reporting unexpected behavior. The bundled demo’s data and safety boundaries still apply.

## Validation
Run `npm run check && npm run typecheck && npm test && npm run demo`; CI uses Node 22 and 24.

## Related projects
[DecisionPacks](https://github.com/gbesse/decisionpacks), [Question Forge](https://github.com/gbesse/question-forge), and [jev-rerank-server](https://github.com/gbesse/jev-rerank-server).

Independent project; not affiliated with TypeSafe AI. [API docs](https://docs.typesafe.ai/api) · [model notes](https://docs.typesafe.ai/model-jaggedness/jev-1.13/)

## Contrôle d’adoption · Adoption check · Comprobación de adopción

[Français : essayer un cas concret](examples/adoption-check.md) · [English: try a concrete case](examples/adoption-check.md) · [Español: pruebe un caso concreto](examples/adoption-check.md).

## Complete cache context / Contexte complet / Contexto completo

EN: Cache keys now bind complete taxonomy, risk dimensions, policy content, provider identity and shadow mode. Reusing a version label cannot carry a shadow `allow` into enforcement. Fake fixture contents identify the synthetic provider; custom providers cache only when they supply a stable `cacheIdentity` that changes with configuration. Returned objects are detached from cache values. Missing/out-of-range risk replies and invented categories fail instead of defaulting to harmless severity. This is a decision aid, not a validated advertiser-safety benchmark.

FR : Le cache lie désormais taxonomie complète, dimensions de risque, contenu de politique, identité fournisseur et mode shadow. Réutiliser un numéro de version ne transfère plus un `allow` simulé vers l’application réelle. Les fixtures identifient le fournisseur synthétique ; un fournisseur personnalisé n’utilise le cache qu’avec un `cacheIdentity` stable qui change avec sa configuration. Les sorties sont détachées du cache. Risques absents/hors limites et catégories inventées échouent au lieu de devenir un risque nul. Il s’agit d’une aide à la décision, pas d’un benchmark validé de sûreté publicitaire.

ES: La caché vincula taxonomía completa, dimensiones de riesgo, política, identidad de proveedor y modo shadow. Reutilizar versión ya no transfiere un `allow` simulado a aplicación real. Fixtures identifican al proveedor sintético; proveedores personalizados solo usan caché con `cacheIdentity` estable que cambie con configuración. Salidas separadas de valores en caché. Riesgos ausentes/fuera de rango y categorías inventadas fallan en vez de asumir riesgo nulo. Es ayuda a la decisión, no benchmark validado de seguridad publicitaria.


FR : La taxonomie est contrôlée avant cache ou fournisseur : catégories et enfants non vides, identifiants non vides et uniques dans l’arbre ; dimensions de risque uniques, distinctes des questions réservées `top` et `child`. Une sévérité retournée doit être un entier de 0 à 3. Les configurations ambiguës échouent sans appel ; cela ne prouve ni la qualité sémantique ni la conformité d’une publicité.

EN: Taxonomy is checked before cache or provider work: nonempty categories and children, nonempty identities unique across the tree; unique risk dimensions distinct from reserved `top` and `child` questions. Returned severity must be an integer from 0 to 3. Ambiguous configurations fail without calls; this proves neither semantic quality nor advertising compliance.

ES: La taxonomía se valida antes de caché o proveedor: categorías e hijos no vacíos, identidades no vacías y únicas en el árbol; dimensiones de riesgo únicas y distintas de `top` y `child`. La gravedad devuelta debe ser un entero de 0 a 3. Las configuraciones ambiguas fallan sin llamadas; no demuestra calidad semántica ni cumplimiento publicitario.
