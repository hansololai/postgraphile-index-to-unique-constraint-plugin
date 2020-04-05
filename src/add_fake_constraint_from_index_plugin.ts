import { SchemaBuilder, Options } from 'postgraphile';
import { GraphileBuild } from './postgraphile_types';
import { PgConstraint, PgEntityKind, PgClass, PgIndex, PgAttribute } from 'graphile-build-pg';

export const addFakeUniqueConstraintFromIndex = (builder: SchemaBuilder, options: Options) => {
  builder.hook('build', (build) => {
    const {
      pgIntrospectionResultsByKind: {
        index,
        constraint,
        namespaceById,
      }
    } = build as GraphileBuild;
    // this needs to be modify in place on the class and constraints, 
    index.filter((pgIndex) => {
      // we only want unique index that are not in pg catalog and information schema
      // also index must be non-partial, also the index must be on columns, not on
      // some functions
      const {
        isPartial,
        isUnique,
        attributeNums,
        class: theClass,
      } = pgIndex as PgIndex & { class: PgClass };

      const attributes = attributeNums.map((n) => theClass.attributes
        .find((a) => a.num === n));
      return !isPartial && isUnique
        && !['pg_catalog', 'information_schema'].includes((theClass as any).namespaceName)
        && attributes.every((a) => !!a);
    }).forEach(pgIndex => {
      const {
        classId,
        class: theClass,
        description,
        attributeNums,
        name,
        tags,
      } = pgIndex as PgIndex & { class: PgClass };

      // if this is a non-partial unique index, this could also be used as
      // "unique constraint" and constraint fields.
      const attributes = attributeNums.map((n) => theClass.attributes.find(
        (a) => a.num === n,
      ));
      const uniqueConstraint: PgConstraint = {
        class: theClass,
        classId,
        comment: '',
        description,
        foreignClass: undefined,
        foreignClassId: undefined,
        foreignKeyAttributeNums: [],
        foreignKeyAttributes: [],
        id: pgIndex.id,
        keyAttributeNums: attributeNums,
        keyAttributes: (attributes as PgAttribute[]),
        kind: PgEntityKind.CONSTRAINT,
        name: `${name}_constraint`,
        tags,
        type: 'u',
        namespace: namespaceById[theClass.namespaceId],
        isIndexed: true,
      };
      // Because all the class objects are internally using same mem address
      // so it shoud not be immutable edits, but modify in place.
      // Add this constraint to the array of all constraints
      // Because we are adding a "fake" unique constraint to the class,
      // If there already exist one, then we don't have to do it
      // if each attribute num exist in the index attribute num, then we skip it
      const exist = theClass.constraints.find(
        (c) => c.keyAttributeNums.every((num) => attributeNums.includes(num)),
      );
      if (!exist) {
        constraint.push(uniqueConstraint);
        // also add this constraint to the class.
        theClass.constraints.push(uniqueConstraint);
      }
    });
    return build;
  });
};