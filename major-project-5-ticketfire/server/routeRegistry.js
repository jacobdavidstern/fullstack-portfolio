/**
 * Route Registry
 *
 * Express 5 no longer exposes internal route metadata, so routes must register
 * themselves at definition time. This module records method, path, and prefix
 * for logging all registered routes during server initialization.
 */

const registry = [];

function register(method, path, prefix = '') {
  registry.push({ method, path: prefix + path });
  return (req, res, next) => next();
}

module.exports = { registry, register };
