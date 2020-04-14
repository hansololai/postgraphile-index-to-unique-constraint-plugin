import { Plugin } from 'postgraphile';
import { PgEntityKind, PgAttribute, PgConstraint } from 'graphile-build-pg';
import { GraphileBuild } from './postgraphile_types';

/**
 * @description "Set unique constraint using smart comments"
 * @param builder
 */
export const uniqueConstraintFromSmartComment: Plugin = (builder) => {
  builder.hook('build', (build) => {
    const {
      pgIntrospectionResultsByKind: { class: classes, constraint },
    } = build as GraphileBuild;
    classes.forEach((c) => {
      // Only allow fake unique constraints for views
      // for mat view and table, it should be set by query. not smart comment
      const uniqueTag = c.tags.unique;
      if (uniqueTag && c.classKind === 'v') {
        // figure out the attributes
        if (typeof uniqueTag === 'string') {
          const text = uniqueTag;
          const attNames = text.substring(text.indexOf('(') + 1, text.indexOf(')'));
          const attriNums: number[] = [];
          const attrs: PgAttribute[] = [];
          attNames.split(',').forEach((n) => {
            const ind = c.attributes.findIndex((a) => a.name === n);
            const attr = c.attributes[ind];
            if (!attr) {
              throw new Error(`Cannot find attribute ${n} for unique constraint ${uniqueTag}`);
            }
            attriNums.push(ind);
            attrs.push(attr);
          });
          const id = `${Math.random()}`;
          const uniqueConstraint: PgConstraint = {
            id,
            classId: c.id,
            description: 'Unique Constraint',
            tags: {},
            class: c,
            comment: '',
            foreignClass: undefined,
            foreignClassId: undefined,
            foreignKeyAttributeNums: [],
            foreignKeyAttributes: [],
            keyAttributeNums: attriNums,
            keyAttributes: attrs,
            kind: PgEntityKind.CONSTRAINT,
            name: `${id}_unique_constraint`,
            type: 'u',
            namespace: c.namespace,
            isIndexed: true,
          };
          constraint.push(uniqueConstraint);
          c.constraints.push(uniqueConstraint);
        }
      }
    });
    return build;
  });
};
