const impactedTests = ['login test'];

const grep = impactedTests.join('|');

console.log(
  `npx playwright test --grep "${grep}"`
);
