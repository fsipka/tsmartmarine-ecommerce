const en = require('./src/i18n/messages/en.json');
const tr = require('./src/i18n/messages/tr.json');
const fr = require('./src/i18n/messages/fr-ca.json');

function compareKeys(obj1, obj2, path = '') {
  const missing = [];
  for (const key in obj1) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
      missing.push(...compareKeys(obj1[key], obj2[key] || {}, currentPath));
    } else if (!(key in (obj2 || {}))) {
      missing.push(currentPath);
    }
  }
  return missing;
}

console.log('=== Missing in TR ===');
const missingTR = compareKeys(en, tr);
if (missingTR.length > 0) {
  missingTR.forEach(k => console.log(k));
} else {
  console.log('None');
}

console.log('\n=== Missing in FR-CA ===');
const missingFR = compareKeys(en, fr);
if (missingFR.length > 0) {
  missingFR.forEach(k => console.log(k));
} else {
  console.log('None');
}

console.log('\n=== Extra in TR (not in EN) ===');
const extraTR = compareKeys(tr, en);
if (extraTR.length > 0) {
  extraTR.forEach(k => console.log(k));
} else {
  console.log('None');
}

console.log('\n=== Extra in FR-CA (not in EN) ===');
const extraFR = compareKeys(fr, en);
if (extraFR.length > 0) {
  extraFR.forEach(k => console.log(k));
} else {
  console.log('None');
}
