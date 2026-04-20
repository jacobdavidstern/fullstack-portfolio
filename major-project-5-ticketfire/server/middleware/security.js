const helmet = require('helmet');

module.exports = helmet({
  // Defaults are great for a JSON API
  // Add CSP (Content Security Policy) here later to serve HTML
});
