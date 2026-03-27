const fs = require('fs');
const path = require('path');

// Dev Review notes API — saves feedback to a JSON file on disk
// so both the browser and Claude can read/write the same notes
module.exports = function(app) {
  const NOTES_FILE = path.join(__dirname, '..', 'dev-review-notes.json');

  // Ensure file exists
  if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, '[]');
  }

  app.get('/api/dev-review', (req, res) => {
    try {
      const data = fs.readFileSync(NOTES_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch {
      res.json([]);
    }
  });

  // Run question-to-lesson mapping script
  app.get('/api/run-mapping', (req, res) => {
    const topic = req.query.topic;
    if (!topic) return res.status(400).json({ error: 'Missing topic parameter' });

    const { execSync } = require('child_process');
    try {
      execSync(`node scripts/map-questions-to-lessons.js ${topic}`, {
        cwd: path.join(__dirname, '..'),
        timeout: 30000
      });
      const mapFile = path.join(__dirname, '..', 'scripts', 'question-lesson-map.json');
      const data = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
      // Also copy to public for direct fetch
      fs.copyFileSync(mapFile, path.join(__dirname, '..', 'public', 'question-lesson-map.json'));
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/dev-review', (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        fs.writeFileSync(NOTES_FILE, body);
        res.json({ ok: true });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  });
};
