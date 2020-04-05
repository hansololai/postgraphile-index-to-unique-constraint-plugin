# postgraphile-index-to-unique-constraint-plugin
 Convert unique index to fake unique constraint

[![Maintainability](https://api.codeclimate.com/v1/badges/77422efbcad7914cfde3/maintainability)](https://codeclimate.com/github/hansololai/postgraphile-index-to-unique-constraint-plugin/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/77422efbcad7914cfde3/test_coverage)](https://codeclimate.com/github/hansololai/postgraphile-index-to-unique-constraint-plugin/test_coverage)


## Motivation
Postgraphile generate field for unique constraint on a table using a [PgRowByUniqueConstraint](https://github.com/graphile/graphile-engine/blob/v4/packages/graphile-build-pg/src/plugins/PgRowByUniqueConstraint.js).


However this only works for each unique constraints, not unique index. To resolve this issue, one could have created a `PgRowByUniqueIndex` plugin, but this creates a lot of redundant code. And because the unique index behave exactly like unique constraint. So I think it would work well to inject a plugin in the `build` phase, (not `init` phase) to create "fake" constraint from unique index. 

## Usage
```
npm install postgraphile-index-to-unique-constraint-plugin
```

Then add it to the postgraphile plugins
import { addFakeUniqueConstraintFromIndex } from 'postgraphile-polymorphic-relation-plugin';
```
createPostGraphileSchema(client, ['p'], {
        appendPlugins: [
          addFakeUniqueConstraintFromIndex,
        ],
      });
```




