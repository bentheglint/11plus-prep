#!/usr/bin/env node
// Common-word ambiguity gate for VR hiddenWords (benchmark fix #7).
// A hidden-words item is AMBIGUOUS if — besides the keyed boundary — some OTHER
// adjacent boundary also hides a COMMON English word of the same target length
// (so a child could defensibly pick a different pair). The existing shipped bank
// has ZERO such cases; new (longer) sentences must match that bar.
//
// "Common" = a curated set of everyday 3-4 letter words (function words + frequent
// nouns/verbs a child would actually recognise). The full 274k dictionary is NOT
// used, because it flags archaic/dialect words (buss, hebe, veto) no child considers.
//
// Usage: node scripts/data-generation/scan-hw-ambiguity.mjs <json-with-hiddenWords>
//   Exit 0 = clean, Exit 1 = ambiguities found (printed).

import fs from 'node:fs';

const COMMON = new Set((
  'the and for are but not you all any can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use dad mum cat dog sun run big red top bed box cup hat leg bag car bus egg pen pig cow hen fox owl bat ant bee arm ear eye toe jam ice sea sky air art end age ago act add ask bit buy cry cut dry eat far few fit fly fun gap god hit hot job joy key kid law lay lot low map mix mud net nut oil pan pat pay pet pot ray rid row rub sad set sit six ten tie tin war wet win zip son men cap bin ' +
  'this that then them they what when with your from have been were will more some time into only over back down good much most best than name game home book tree star moon snow rain bear fish bird cake road door hand foot head hair gold herb herd hero gear idea next near open meat meal seat rest span path plan part word ring wand wing band drum crab frog clip twin flat grip grin drag glow slab bran tram chum shin plot pram spud blot clap prop slip slot swim glue crop flap grit clog mind cold tone lend claw nest corn fern wasp wren tuna dart harp fork iron once onto thin inch itch hear chin care fare salt seed sale page leaf read rose kite bean rice cart oven dear raid seal vase beam fear swan wear want went here dark wood boat coat goat load help hope jump king lamp land last left life like line lion list live long look made make many milk mile miss must nice note play pull push race rich ride rock roof room rope rule sand sell send ship shoe shop shot show side sing sink size skin slow soft song soon stop such sure tail take talk tall team tell tent test text tiny told took trip true turn type wait walk wall warm wash wave week well whom wide wife wild wind wine wire wise wish work yard year zero zone'
).split(/\s+/).filter(w => w.length >= 3 && w.length <= 4));

const file = process.argv[2];
if (!file) { console.error('usage: scan-hw-ambiguity.mjs <json>'); process.exit(2); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const hw = data.hiddenWords || [];

function hitsAt(opts, i, L) {
  const a = (opts[i] || '').toLowerCase(), b = (opts[i + 1] || '').toLowerCase();
  const out = [];
  for (let k = 1; k <= L - 1; k++) {
    if (k <= a.length && (L - k) <= b.length) {
      const w = a.slice(a.length - k) + b.slice(0, L - k);
      if (COMMON.has(w)) out.push(w);
    }
  }
  return out;
}

const flags = [];
hw.forEach((q, idx) => {
  if (!Array.isArray(q.correctPair)) return;
  const L = (q._hidden || '').length || 4;
  const keyed = q.correctPair[0];
  const keyedW = (q._hidden || '').toLowerCase();
  const others = [];
  for (let i = 0; i + 1 < q.options.length; i++) {
    if (i === keyed) continue;
    const h = hitsAt(q.options, i, L).filter(w => w !== keyedW);
    if (h.length) others.push(`boundary ${i} hides ${h.join('/')}`);
  }
  if (others.length) flags.push({ idx, hidden: q._hidden, sentence: q._sentence || q.options.join(' '), others });
});

console.log(`hiddenWords scanned: ${hw.length}, common-word ambiguities: ${flags.length}`);
flags.forEach(f => console.log(`  ✗ #${f.idx} [${f.hidden}] "${f.sentence}" -> ${f.others.join('; ')}`));
process.exit(flags.length ? 1 : 0);
