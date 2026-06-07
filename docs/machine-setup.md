# Machine Setup — 11plus-prep

Bootstrap checklist for getting a fresh machine (or reinstall) to the point
where it can build, test, smoke and deploy this app. Written after the first
laptop deploy (June 2026) hit every one of these gaps in sequence.

Everything below assumes the repo is already cloned to
`~/Documents/11plus-prep` and the claude-config layer is deployed
(see `claude-config/SETUP.md` for that side).

## 1. Git identity (global, once per machine)

```bash
git config --global user.name "Ben Jackson"
git config --global user.email "benjacko82@hotmail.com"
```

Without this, the first commit fails with "Author identity unknown".

## 2. Dependencies — BOTH package.json files

```bash
cd ~/Documents/11plus-prep
npm install                      # app (react-scripts, puppeteer, etc.)
cd workers/ai-tutor && npm install   # Worker (wrangler etc.)
```

The Worker has its own `package.json` — forgetting it means wrangler/Worker
tooling is missing when you first touch `workers/`.

## 3. Puppeteer Chrome (needed by the smoke test)

`npm install` is *supposed* to download Chrome, but a corrupted partial
download happened on the laptop and the installer refuses to repair itself
("browser folder exists but the executable is missing").

Healthy path:

```bash
npx puppeteer browsers install chrome
```

If it fails with "folder exists but executable missing":

1. Move the broken folder aside (or delete it):
   `~/.cache/puppeteer/chrome/win64-<version>`
2. Re-run the install. If extraction still doesn't produce `chrome.exe`,
   the downloaded zip is left in `~/.cache/puppeteer/chrome/` — extract it
   manually (PowerShell):
   ```powershell
   Expand-Archive -Path "$env:USERPROFILE\.cache\puppeteer\chrome\<version>-chrome-win64.zip" `
     -DestinationPath "$env:USERPROFILE\.cache\puppeteer\chrome\win64-<version>" -Force
   ```
3. Manually extracted Chrome lacks the ACLs its sandbox needs ("Sandbox
   cannot access executable... Access is denied"). Fix — run via
   **PowerShell**, not Git Bash (Git Bash mangles `/grant` into a path):
   ```powershell
   icacls "$env:USERPROFILE\.cache\puppeteer\chrome\win64-<version>" /grant '*S-1-15-2-1:(OI)(CI)(RX)' /T /Q
   ```
4. Verify:
   ```bash
   "$HOME/.cache/puppeteer/chrome/win64-<version>/chrome-win64/chrome.exe" --headless --dump-dom "data:text/html,<p>ok</p>"
   ```
5. Clean up the zip and any `.broken`/partial folders afterwards (~400 MB).

## 4. Cloudflare auth (deploys)

```bash
npx wrangler login    # opens browser OAuth — interactive, do it yourself
npx wrangler whoami   # verify
```

Token persists per machine. Needed for `deploy.sh` (Pages) and any Worker
deploys from `workers/ai-tutor`.

## 5. `.env` (gitignored — never syncs)

CRA bakes `REACT_APP_*` values into the bundle at build time. Without
`.env`, a build "succeeds" but ships with no Worker URL and no auth.
Create `~/Documents/11plus-prep/.env` with:

```
REACT_APP_TUTOR_API_URL=https://11plus-ai-tutor.benjacko82.workers.dev
REACT_APP_CLERK_PUBLISHABLE_KEY=<pk_... from the PC's .env, or Clerk dashboard>
REACT_APP_SENTRY_DSN=<from the PC's .env, or Sentry project settings>
```

All three are public-by-design values (publishable key, DSN, public URL) —
recoverable in a pinch from the live bundle at https://11plus-prep.pages.dev/.
As of June 2026 production uses a Clerk `pk_test_` key (dev instance) —
swapping to `pk_live_` is a pre-launch task; check the current live bundle
rather than assuming.

If you use a `.env.local` for local Worker development, note `deploy.sh`
auto-renames it during builds so localhost URLs never reach production.

## 6. Gitignored content — does NOT arrive with the clone

| Content | Recovery |
|---|---|
| `research/` text library (`*.md`, incl. `gl-topic-research/`) | `git restore --source=e727cea --worktree -- research/` (March 2026 snapshot) — or copy the PC's copy, which may be newer |
| Scanned/binary research: `research/kingsbury/`, `research/maths-reference/`, `research/past-papers/`, `Examples for English and VR/`, `Micro-Lesson Research/`, `Lesson Plan Examples/`, `difficulty-scores/` | PC only — copy via drive/USB if needed. Oracle deep audits depend on these |
| `.env` | Section 5 above |

The `11plus-oracle` agent definition is part of the claude-config layer,
not this repo — if it's missing, see claude-config (PC-side TODO as of
June 2026: it still needs copying in from the PC).

## 7. Verify the machine end-to-end

```bash
CI=true npx react-scripts test --watchAll=false   # full unit suite
bash deploy.sh                                    # tests → smoke → build → deploy
```

`deploy.sh` is the deploy gate — it fails loudly at whichever step the
machine isn't ready for, in dependency order. A machine that passes
`deploy.sh` is fully set up.
