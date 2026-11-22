import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArguments, javaMajor, inspectPrerequisites, selectDevice, buildApk } from '../android-apk.mjs';

test('Android CLI rejects unsupported options and install serial injection', () => {
  assert.deepEqual(parseArguments(['build']), { command: 'build' });
  assert.deepEqual(parseArguments(['install', '--serial', '192.168.1.2:5555']), { command: 'install', serial: '192.168.1.2:5555' });
  for (const args of [[], ['build', '--install'], ['build', '--serial', 'phone'], ['install', '--serial', 'a & b'], ['install', '--serial'], ['doctor', '--help']]) assert.throws(() => parseArguments(args));
});

test('prerequisite checks diagnose missing tools and reject obsolete Java', () => {
  const missing = inspectPrerequisites({ env: {}, nodeVersion: '20.0.0', exists: () => false });
  assert.equal(missing.issues.length, 3);
  const wrongJava = inspectPrerequisites({ env: { JAVA_HOME: '/jdk', ANDROID_HOME: '/sdk' }, exists: () => true, execute: () => 'java version "1.8.0_432"' });
  assert.equal(wrongJava.javaHome, undefined);
  assert.match(wrongJava.issues.join('\n'), /JDK 21/);
  assert.equal(javaMajor('openjdk version "21.0.9" 2025-10-21'), 21);
  assert.equal(javaMajor('java version "1.8.0_432"'), 8);
});

test('prerequisite checks use a complete JDK21 and identify missing API36', () => {
  const report = inspectPrerequisites({
    env: { JAVA_HOME: '/jdk', ANDROID_HOME: '/sdk' },
    exists: file => !file.includes('android-36'),
    execute: () => 'openjdk version "21.0.9"',
  });
  assert.equal(report.javaHome, '/jdk');
  assert.equal(report.sdk, '/sdk');
  assert.deepEqual(report.issues, ['Missing Android SDK Platform 36 (android-36). Install it through Android Studio SDK Manager.']);
});

test('install requires an unambiguous authorised device and never accepts offline devices', () => {
  assert.equal(selectDevice('List of devices attached\nphone\tdevice\n'), 'phone');
  assert.throws(() => selectDevice('List of devices attached\n'));
  assert.throws(() => selectDevice('List of devices attached\nphone\tunauthorized\n'));
  assert.throws(() => selectDevice('List of devices attached\na\tdevice\nb\tdevice\n'));
  assert.equal(selectDevice('List of devices attached\na\tdevice\nb\tdevice\n', 'b'), 'b');
  assert.throws(() => selectDevice('List of devices attached\na\toffline\n', 'a'));
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sll-apk-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('sll-apk-'));
    fs.rmSync(root, { recursive: true, force: true });
  });
  fs.mkdirSync(path.join(root, 'apps/android'), { recursive: true });
  fs.writeFileSync(path.join(root, 'apps/android/capacitor.config.json'), JSON.stringify({ appId: 'com.smartlingo.preview', webDir: '../learner/dist', loggingBehavior: 'none', server: { hostname: 'localhost', androidScheme: 'https' } }));
  fs.mkdirSync(path.join(root, 'dist/android'), { recursive: true });
  for (const name of ['SmartLingo-preview.apk', 'SmartLingo-preview.provenance.json']) fs.writeFileSync(path.join(root, 'dist/android', name), 'stale');
  return root;
}

test('failed preflight invalidates a previous published APK and receipt without executing builds', t => {
  const root = fixture(t);
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: ['missing JDK'] }), execute: () => assert.fail('must not execute') }), /missing JDK/);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('doctor discovers a complete repository-local portable JDK without changing environment', t => {
  const root = fixture(t);
  const portable = path.join(root, '.cache/android-tools/jdk/official-jdk-21');
  fs.mkdirSync(path.join(portable, 'bin'), { recursive: true });
  for (const name of process.platform === 'win32' ? ['java.exe', 'javac.exe'] : ['java', 'javac']) fs.writeFileSync(path.join(portable, 'bin', name), 'fixture');
  const env = { ANDROID_HOME: '/sdk' };
  const report = inspectPrerequisites({ root, env, execute: () => 'openjdk version "21.0.9"' });
  assert.equal(report.javaHome, portable);
  assert.equal(env.JAVA_HOME, undefined);
});

test('failed export removes stale native output and never runs Gradle or publishes', t => {
  const root = fixture(t);
  const oldNative = path.join(root, 'apps/android/android/app/build/outputs/apk/debug/app-debug.apk');
  fs.mkdirSync(path.dirname(oldNative), { recursive: true });
  fs.writeFileSync(oldNative, 'old native APK');
  let calls = 0;
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute: () => { calls++; throw new Error('export failed'); } }), /export failed/);
  assert.equal(calls, 1);
  assert.equal(fs.existsSync(oldNative), false);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('a successful command without a freshly generated APK cannot publish stale output', t => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, 'apps/learner/dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'apps/learner/dist/index.html'), '<html></html>');
  const commands = [];
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute: (command, args) => {
    commands.push(args);
    if (args.includes('export')) fs.writeFileSync(path.join(root, 'apps/learner/dist/index.html'), '<html>fresh</html>');
    return '';
  } }), /fresh debug APK/);
  assert.equal(commands.length, 3);
  assert.equal(commands.some(args => args.includes('install')), false);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('a successful export command that leaves no fresh index cannot sync old learner files', t => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, 'apps/learner/dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'apps/learner/dist/index.html'), '<html>stale</html>');
  let calls = 0;
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute: () => { calls++; return ''; } }), /Fresh learner export/);
  assert.equal(calls, 1);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('a remotely served shell config fails before export or assembly', t => {
  const root = fixture(t);
  const configFile = path.join(root, 'apps/android/capacitor.config.json');
  const config = JSON.parse(fs.readFileSync(configFile));
  config.server.url = 'http://localhost:8081';
  fs.writeFileSync(configFile, JSON.stringify(config));
  assert.throws(() => buildApk({ root, inspect: () => assert.fail('must not preflight'), execute: () => assert.fail('must not execute') }), /no remote navigation/);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('failed signature verification prevents publication after assembly', t => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, 'apps/learner/dist'), { recursive: true });
  const sourceApk = path.join(root, 'apps/android/android/app/build/outputs/apk/debug/app-debug.apk');
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute: (command, args) => {
    if (args.includes('export')) fs.writeFileSync(path.join(root, 'apps/learner/dist/index.html'), '<html>fresh</html>');
    if (args.includes('assembleDebug')) { fs.mkdirSync(path.dirname(sourceApk), { recursive: true }); fs.writeFileSync(sourceApk, 'unsigned'); }
    if (args.includes('verify')) throw new Error('signature invalid');
    return '';
  } }), /signature invalid/);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('bridge logging must be disabled before any private learner backup can be packaged', t => {
  const root = fixture(t);
  const configFile = path.join(root, 'apps/android/capacitor.config.json');
  const config = JSON.parse(fs.readFileSync(configFile));
  delete config.loggingBehavior;
  fs.writeFileSync(configFile, JSON.stringify(config));
  assert.throws(() => buildApk({ root, inspect: () => assert.fail('must not preflight'), execute: () => assert.fail('must not execute') }), /disabled bridge logging/);
});
