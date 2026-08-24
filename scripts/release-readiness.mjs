#!/usr/bin/env node

/**
 * V3C.40 Release Readiness Pipeline
 *
 * Canonical orchestration layer for BiblicalMeal validation gates.
 * Runs existing validation commands in the required order and
 * produces a clear pass/fail verdict.
 *
 * This script does NOT duplicate validation logic.
 * It orchestrates existing npm scripts:
 *   1. lint
 *   2. format:check
 *   3. typecheck
 *   4. test
 *   5. build
 *
 * Exit codes:
 *   0 - RELEASE READY (all gates passed)
 *   1 - NOT RELEASE READY (one or more gates failed)
 */

import { execSync } from 'node:child_process';

const GATES = [
  { name: 'Lint', command: 'npm run lint', critical: true },
  { name: 'Format', command: 'npm run format:check', critical: true },
  { name: 'Typecheck', command: 'npm run typecheck', critical: true },
  { name: 'Tests', command: 'npm test', critical: true },
  { name: 'Build', command: 'npm run build', critical: true },
];

const results = [];
let allPassed = true;

console.log('');
console.log('V3C.40 Release Readiness Check');
console.log('═'.repeat(40));
console.log('');

for (const gate of GATES) {
  try {
    execSync(gate.command, {
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    results.push({ name: gate.name, status: 'PASS', critical: gate.critical });
    console.log(`PASS  ${gate.name}`);
  } catch (error) {
    results.push({ name: gate.name, status: 'FAIL', critical: gate.critical });
    allPassed = false;
    console.log(`FAIL  ${gate.name}`);

    // Show error output for failed gate
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.error(error.stderr);
    }

    // If critical gate fails, stop processing
    if (gate.critical) {
      console.log('');
      console.log('Critical gate failed. Stopping pipeline.');
      break;
    }
  }
}

console.log('');
console.log('─'.repeat(40));

if (allPassed) {
  console.log('Status: RELEASE READY');
  console.log('');
  console.log('All repository validation gates passed.');
  process.exit(0);
} else {
  console.log('Status: NOT RELEASE READY');
  console.log('');
  console.log('One or more required validation gates failed.');

  // List failed gates
  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.log('');
    console.log('Failed gates:');
    for (const gate of failed) {
      console.log(`  - ${gate.name}`);
    }
  }

  process.exit(1);
}
