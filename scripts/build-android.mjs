import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiBaseUrl = process.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
  console.error('Set VITE_API_BASE_URL to the API origin before building the APK.');
  process.exit(1);
}

let apiUrl;
try {
  apiUrl = new URL(apiBaseUrl);
} catch {
  console.error('VITE_API_BASE_URL must be a valid absolute URL.');
  process.exit(1);
}

const localHosts = new Set(['localhost', '127.0.0.1', '10.0.2.2']);
if (apiUrl.protocol !== 'https:' && !(apiUrl.protocol === 'http:' && localHosts.has(apiUrl.hostname))) {
  console.error('VITE_API_BASE_URL must use HTTPS except for localhost or the Android Emulator host.');
  process.exit(1);
}

if (apiUrl.pathname !== '/' || apiUrl.search || apiUrl.hash) {
  console.error('VITE_API_BASE_URL must be an origin without a path, query, or fragment.');
  process.exit(1);
}

const gradleWrapper = process.platform === 'win32' ? 'gradlew.bat' : 'gradlew';
if (!fs.existsSync(path.join(root, 'android', gradleWrapper))) {
  console.error('Android project not found. Run `npm run android:init` first.');
  process.exit(1);
}

const steps = [
  { command: 'npm', args: ['run', 'build'] },
  { command: 'npx', args: ['cap', 'sync', 'android'] },
  { command: process.platform === 'win32' ? 'gradlew.bat' : './gradlew', args: ['assembleDebug'], cwd: 'android' },
];

for (const step of steps) {
  const result = spawnSync(step.command, step.args, {
    cwd: path.join(root, step.cwd || ''),
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('APK: android/app/build/outputs/apk/debug/app-debug.apk');