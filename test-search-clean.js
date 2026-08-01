const { searchDocuments } = require('./src/utils/searchEngine.js');
const docs = require('./src/data/documents.json').documents;

console.log('=== Test 1: "nav" ===');
const r1 = searchDocuments(docs, 'nav');
console.log('Total results:', r1.length);
console.log('Top 3 results:');
r1.slice(0, 3).forEach(d => console.log('  -', d.title, '(score:', d.score + ')'));

console.log('\n=== Test 2: "map" ===');
const r2 = searchDocuments(docs, 'map');
console.log('Total results:', r2.length);
console.log('Top 3 results:');
r2.slice(0, 3).forEach(d => console.log('  -', d.title, '(score:', d.score + ')'));

console.log('\n=== Test 3: "café" (with accent) ===');
const r3 = searchDocuments(docs, 'café');
console.log('Total results:', r3.length);
if (r3.length > 0) {
  r3.slice(0, 3).forEach(d => console.log('  -', d.title, '(score:', d.score + ')'));
} else {
  console.log('  No results found');
}

console.log('\n=== Test 4: "xyznonexistent" (made-up word) ===');
const r4 = searchDocuments(docs, 'xyznonexistent');
console.log('Total results:', r4.length);
