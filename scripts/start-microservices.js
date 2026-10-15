#!/usr/bin/env node
/**
 * Kamakhya Trading Co - Microservices Local Orchestrator
 * Launches all decoupled microservices concurrently with colored logs.
 */

const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const services = [
  { name: 'catalog', cmd: 'node', args: ['services/catalog-service/server.js'], color: '\x1b[36m' }, // cyan
  { name: 'auth', cmd: 'node', args: ['services/auth-service/server.js'], color: '\x1b[35m' }, // magenta
  { name: 'orders', cmd: 'node', args: ['services/order-service/server.js'], color: '\x1b[33m' }, // yellow
  { name: 'ai', cmd: 'python', args: ['services/ai-service/main.py'], color: '\x1b[32m' }, // green
  { name: 'gateway', cmd: 'node', args: ['services/api-gateway/server.js'], color: '\x1b[34m' }, // blue
];

const RESET = '\x1b[0m';
const processes = [];

console.log('\x1b[1m\x1b[32m=== Starting Kamakhya Trading Co Decoupled Microservices ===\x1b[0m');
console.log('Orchestrating 5 independent services across Node.js & Python...\n');

services.forEach(({ name, cmd, args, color }) => {
  const proc = spawn(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`${color}[${name}]${RESET} ${data.toString()}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`${color}[${name}:err]${RESET} ${data.toString()}`);
  });

  proc.on('close', (code) => {
    console.log(`${color}[${name}]${RESET} Exited with code ${code}`);
  });

  processes.push(proc);
});

function shutdown() {
  console.log('\n\x1b[1mGracefully shutting down all microservices...\x1b[0m');
  processes.forEach(p => p.kill());
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
