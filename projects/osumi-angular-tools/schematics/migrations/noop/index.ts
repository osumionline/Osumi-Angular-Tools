import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function noop(_tree: Tree, _context: SchematicContext): Rule {
  return (_tree: Tree) => {
    return _tree;
  };
}
