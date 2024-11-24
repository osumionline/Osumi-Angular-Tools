import { chain, noop } from '@angular-devkit/schematics';

export function ngAdd() {
  return chain([noop()]);
}
