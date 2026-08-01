const { searchDocuments } = require('./src/utils/searchEngine.js');
const { getFilterCount } = require('./src/utils/filterEngine.js');
const docs = require('./src/data/documents.json').documents;

console.log('=== Filter Test: Type=map AND Region=India ===');

const filters = {
  types: ['map'],
  regions: ['India'],
  languages: [],
  institutions: [],
  subjects: [],
  dateFrom: null,
  dateTo: null
};

const results = searchDocuments(docs, '', filters);
console.log('Results with both filters:', results.length);
console.log('Matching documents:');
results.forEach(d => console.log('  -', d.title, '(type:', d.type + ', region:', d.region + ')'));

console.log('\n=== Filter Count Accuracy Test ===');
console.log('Count for type=map (no other filters):', getFilterCount(docs, 'type', 'map'));
console.log('Count for region=India (no other filters):', getFilterCount(docs, 'region', 'India'));

console.log('\nCount for type=map WITH region=India filter active:');
const filterWithRegion = { regions: ['India'] };
console.log(getFilterCount(docs, 'type', 'map', filterWithRegion));

console.log('\nCount for region=India WITH type=map filter active:');
const filterWithType = { types: ['map'] };
console.log(getFilterCount(docs, 'region', 'India', filterWithType));
