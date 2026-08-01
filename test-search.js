const { searchDocuments } = require('./src/utils/searchEngine.js');
const docs = require('./src/data/documents.json').documents;

console.log('=== Test 1: nav ===');
const r1 = searchDocuments(docs, 'nav');
console.log('Results:', r1.length);
r1.slice(0, 3).forEach(d => console.log(' -', d.title, '(score:', d.score, ')'));

console.log('\n=== Test 2: map ===');
const r2 = searchDocuments(docs, 'map');
console.log('Results:', r2.length);
r2.slice(0, 3).forEach(d => console.log(' -', d.title, '(score:', d.score, ')'));

console.log('\n=== Test 3: café ===');
const r3 = searchDocuments(docs, 'café');
console.log('Results:', r3.length);

console.log('\n=== Test 4: xyznonexistent ===');
const r4 = searchDocuments(docs, 'xyznonexistent');
console.log('Results:', r4.length);
