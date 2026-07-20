// Pull PrepStep traffic from Cloudflare Web Analytics (RUM) GraphQL API.
// Reads a read-only Account Analytics token from scripts/.metrics.env (gitignored).
// Usage: node scripts/pull-cf-traffic.mjs [days]   (default 30)
// Prints a JSON summary to stdout; feeds .agents/metrics.md.
//
// NOTE: prepstep.co.uk has TWO live Web Analytics site tags (a historical
// duplication worth consolidating). We aggregate both, and restrict to the
// production hosts (prepstep.co.uk + www) so dev traffic on *.pages.dev is
// excluded. The site tag in the repo CLAUDE.md (798fdc...) is stale — ignore it.
import fs from 'node:fs';

const token = fs.readFileSync(new URL('./.metrics.env', import.meta.url), 'utf8')
  .match(/CF_ANALYTICS_TOKEN=(.+)/)?.[1]?.trim();
if (!token) { console.error('No CF_ANALYTICS_TOKEN in scripts/.metrics.env'); process.exit(1); }

const ACC = 'd2ab95cc060e1c5684627a0f46ff1a22';
const TAGS = ['ec5299682ab546c18a47cbfa29cc5fbb', 'aa7bd4c8287c40cd9dfb02efcb077a68']; // both prepstep tags
const PROD_HOSTS = ['prepstep.co.uk', 'www.prepstep.co.uk'];
const days = Number(process.argv[2] || 30);
const fmt = (d) => d.toISOString().slice(0, 10);
const F = fmt(new Date(Date.now() - days * 86400000)), T = fmt(new Date());

const tagOr = TAGS.map((t) => `{siteTag:"${t}"}`).join(',');
const hostOr = PROD_HOSTS.map((h) => `{requestHost:"${h}"}`).join(',');
const filt = `{date_geq:"${F}",date_leq:"${T}",AND:[{OR:[${tagOr}]},{OR:[${hostOr}]}]}`;

const q = `query { viewer { accounts(filter:{accountTag:"${ACC}"}) {
  totals: rumPageloadEventsAdaptiveGroups(filter:${filt},limit:1){count sum{visits}}
  pages: rumPageloadEventsAdaptiveGroups(filter:${filt},limit:20,orderBy:[count_DESC]){count dimensions{requestPath}}
  referrers: rumPageloadEventsAdaptiveGroups(filter:${filt},limit:12,orderBy:[count_DESC]){count dimensions{refererHost}}
  countries: rumPageloadEventsAdaptiveGroups(filter:${filt},limit:12,orderBy:[count_DESC]){count dimensions{countryName}}
  devices: rumPageloadEventsAdaptiveGroups(filter:${filt},limit:6,orderBy:[count_DESC]){count dimensions{deviceType}}
}}}`;

const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: q }),
});
const j = await res.json();
if (j.errors) { console.error('GraphQL errors:', JSON.stringify(j.errors, null, 2)); process.exit(1); }
const acc = j.data.viewer.accounts[0];
const out = {
  window: `${F} to ${T} (${days}d)`,
  note: 'prepstep.co.uk prod hosts only, both site tags aggregated; RUM is sampled at low volume ~1x',
  pageviews: acc.totals?.[0]?.count ?? 0,
  visits: acc.totals?.[0]?.sum?.visits ?? 0,
  topPages: acc.pages.map((r) => ({ path: r.dimensions.requestPath, views: r.count })),
  referrers: acc.referrers.map((r) => ({ host: r.dimensions.refererHost || '(direct/none)', views: r.count })),
  countries: acc.countries.map((r) => ({ country: r.dimensions.countryName, views: r.count })),
  devices: acc.devices.map((r) => ({ device: r.dimensions.deviceType, views: r.count })),
};
console.log(JSON.stringify(out, null, 2));
