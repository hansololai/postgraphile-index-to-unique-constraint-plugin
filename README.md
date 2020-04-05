# postgraphile-index-to-unique-constraint-plugin
 Convert unique index to fake unique constraint

[![Maintainability](https://api.codeclimate.com/v1/badges/77422efbcad7914cfde3/maintainability)](https://codeclimate.com/github/hansololai/postgraphile-index-to-unique-constraint-plugin/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/77422efbcad7914cfde3/test_coverage)](https://codeclimate.com/github/hansololai/postgraphile-index-to-unique-constraint-plugin/test_coverage)


## Motivation
Postgraphile generate field for unique constraint on a table using a [plugin](https://github.com/graphile/graphile-engine/blob/v4/packages/graphile-build-pg/src/plugins/PgRowByUniqueConstraint.js).


