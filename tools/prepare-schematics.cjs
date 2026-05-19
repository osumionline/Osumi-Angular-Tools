const { readdirSync, readFileSync, renameSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const schematicsDir = join(__dirname, '..', 'dist', 'osumi-angular-tools', 'schematics');

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(path);
      continue;
    }

    if (entry.name.endsWith('.js.map')) {
      const contents = readFileSync(path, 'utf8').replace('"file":"index.js"', '"file":"index.cjs"');

      writeFileSync(path, contents);
      renameSync(path, path.replace(/\.js\.map$/, '.cjs.map'));
      continue;
    }

    if (!entry.name.endsWith('.js')) {
      continue;
    }

    const cjsPath = path.replace(/\.js$/, '.cjs');
    const contents = readFileSync(path, 'utf8').replace('//# sourceMappingURL=index.js.map', '//# sourceMappingURL=index.cjs.map');

    writeFileSync(path, contents);
    renameSync(path, cjsPath);
  }
}

walk(schematicsDir);
