const fs = require('fs');
const path = require('path');

const EXPORT_REGEX = /^export\s+(?:(?:(?:let|const|function|var|class)\s+(\w+))?)\s*(?=[(){}=])/;

const IMPORT_REGEX = /^import.+from\s+('|")(.+)\1.+$/;

const TMP = './tmp';
const MAIN_FILE = 'inject.js';
const ENTRY_POINT = path.join(TMP, MAIN_FILE);

const files = fs.readdirSync(TMP);
const loadedFiles = {};

const fileAsModuleName = file => `./${file.replace(/\..+/, '')}`;

for (const file of files) {
  const moduleName = fileAsModuleName(file);
  const name = path.join(TMP, file);
  const data = fs.readFileSync(name).toString('utf8');
  const lines = data.split(/\r?\n/);

  const changedLines = [];
  const exportObjects = [];
  const importObjects = [];

  for (const line of lines) {
    if (/^import/.test(line)) {
      const matches = IMPORT_REGEX.exec(line);
      if (matches) {
        const importedModule = matches[2];
        importObjects.push(importedModule);
      }
    } else if (/^export/.test(line)) {
      const matches = EXPORT_REGEX.exec(line);
      const exportedItem = matches[1];
      exportObjects.push(exportedItem);

      const exportTokenRemovedLine = line.replace(/^export\s+/, '');
      changedLines.push(exportTokenRemovedLine);
    } else {
      changedLines.push(line); // no changes
    }
  }

  loadedFiles[moduleName] = {
    status: 'done',
    data: changedLines.join('\n'),
    exports: exportObjects,
    imports: importObjects,
    bundled: false
  };
}

const outFile = [];

for (const moduleName in loadedFiles) {
  const scope = loadedFiles[moduleName];
  if (scope.imports.length === 0) {
    if (scope.bundled) {
      // noop
    } else {
      scope.bundled = true;
      outFile.push(scope.data);
    }

    continue;
  }

  for (const importedModuleName of scope.imports) {
    if (loadedFiles[importedModuleName].bundled) {
      continue;
    }

    loadedFiles[importedModuleName].bundled = true;
    outFile.push(loadedFiles[importedModuleName].data);
  }

  if (scope.bundled) {
    // noop
  } else {
    scope.bundled = true;
    outFile.push(scope.data);
  }
}

fs.writeFileSync('./dist/src/inject.js', outFile.join('\n'), {
  encoding: 'utf8'
});
