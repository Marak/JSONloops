#!/usr/bin/env node

require.paths.unshift(require('path').join(__dirname, 'lib'));

var JSONloops = require('JSONloops');


JSONloops.start({
  port: 8080,
  servers: []
});
