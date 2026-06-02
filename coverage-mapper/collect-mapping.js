const fs = require('fs');

const traceability = {

  "login test": [
    "frontend-angular/app.js",
    "backend-springboot/AuthController.java"
  ],

  "checkout test": [
    "frontend-angular/app.js",
    "backend-springboot/OrderController.java"
  ]
};

fs.writeFileSync(
  'traceability.json',
  JSON.stringify(traceability, null, 2)
);

console.log('traceability.json generated');
