const notes = require('../dev-review-notes.json');
const pending = notes.filter(n => n.status !== 'fixed');
pending.forEach(n => {
  console.log(`${n.id}: [${n.topic||'?'}/${n.subConcept||'?'}/${n.screenType||'?'}] ${n.note}`);
});
console.log('---');
console.log('Total pending:', pending.length);
