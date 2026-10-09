# jev-brandsafety — contrôle d’adoption · adoption check · comprobación de adopción

## Français

Point de départ local, après la préparation indiquée dans le README :

```sh
node examples/policy-contrast.mjs
```

Appliquez trois politiques d’annonceur au même contenu fictif. Comparez les décisions et leurs seuils : la catégorie de contenu seule ne décide pas du placement.

## English

Local starting point, after the setup described in the README:

```sh
node examples/policy-contrast.mjs
```

Apply three advertiser policies to the same fictional content. Compare decisions and thresholds: a content category alone does not decide placement.

## Español

Punto de partida local, después de la preparación descrita en el README:

```sh
node examples/policy-contrast.mjs
```

Aplique tres políticas de anunciantes al mismo contenido ficticio. Compare decisiones y umbrales: la categoría del contenido por sí sola no decide la colocación.
## Variante synthétique · Synthetic variation · Variante sintética

```text
page_id=42; advertiser_A.max_risk=0.6; advertiser_B.max_risk=0.8
```

FR : adaptez une copie de la fixture locale à cette situation, puis vérifiez le comportement décrit ci-dessus. Les valeurs sont illustratives, pas des résultats Jev mesurés.

EN: adapt a copy of the local fixture to this situation, then check the behavior described above. Values are illustrative, not measured Jev output.

ES: adapte una copia de la fixture local a esta situación y compruebe el comportamiento descrito arriba. Los valores son ilustrativos, no resultados Jev medidos.
