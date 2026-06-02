const fs = require('fs');

const traceability =
  JSON.parse(fs.readFileSync('traceability.json'));

const changedFiles =
  fs.readFileSync('../changed-files.txt')
    .toString()
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean);

const impacted = [];

for (const testName in traceability) {

  const files = traceability[testName];

  const hit = changedFiles.some(
    file => files.includes(file)
  );

  if (hit) {
    impacted.push(testName);
  }
}

console.log('IMPACTED TESTS');
console.log(impacted);
