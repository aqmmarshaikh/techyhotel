const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'js', 'firebase-config.js');
let content = fs.readFileSync(configPath, 'utf8');

const fallbacks = {
  FIREBASE_API_KEY: "AIzaSyADbakFclff6oc2IlOXjtCc37lqU4H0RWw",
  FIREBASE_AUTH_DOMAIN: "manage-8103a.firebaseapp.com",
  FIREBASE_DATABASE_URL: "https://manage-8103a-default-rtdb.firebaseio.com",
  FIREBASE_PROJECT_ID: "manage-8103a",
  FIREBASE_STORAGE_BUCKET: "manage-8103a.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID: "242944239701",
  FIREBASE_APP_ID: "1:242944239701:web:bf2a66065bc112d8954cdc",
  FIREBASE_MEASUREMENT_ID: "G-RMVT4M9D0L"
};

const vars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID'
];

vars.forEach(v => {
  const placeholder = `process.env.${v}`;
  const value = process.env[v] || fallbacks[v];
  content = content.replace(placeholder, value);
});

fs.writeFileSync(configPath, content, 'utf8');
console.log('✅ firebase-config.js built successfully');
