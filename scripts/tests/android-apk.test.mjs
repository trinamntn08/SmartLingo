import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parseArguments, javaMajor, inspectPrerequisites, selectDevice, buildApk, installApk } from '../android-apk.mjs';

const packageId = 'com.smartlingo.preview';
const signer = 'a1'.repeat(32);
const bundleEntries = [
  'index.html', '_expo/index.js', 'generated-vocabulary-photos/apple.jpg',
  'learning-scenes/greetings.jpg', 'fonts/Inter.woff2',
];

function apkBadging({ id = packageId, code = 3, split = '' } = {}) {
  return `package: name='${id}' versionCode='${code}' versionName='test-preview'${split}\nsdkVersion:'24'\ntargetSdkVersion:'36'`;
}

const apkSignature = (digest = signer) => `Signer #1 certificate SHA-256 digest: ${digest}`;
const apkList = () => bundleEntries.map(entry => `assets/public/${entry}`).join('\n');

test('Android CLI rejects unsupported options and install serial injection', () => {
  assert.deepEqual(parseArguments(['build']), { command: 'build' });
  assert.deepEqual(parseArguments(['install', '--serial', '192.168.1.2:5555']), { command: 'install', serial: '192.168.1.2:5555' });
  assert.deepEqual(parseArguments(['check-update', 'old build.apk', 'new build.apk']), { command: 'check-update', previous: 'old build.apk', candidate: 'new build.apk' });
  for (const args of [[], ['build', '--install'], ['build', '--serial', 'phone'], ['install', '--serial', 'a & b'], ['install', '--serial'], ['doctor', '--help'], ['check-update'], ['check-update', 'old.json'], ['check-update', 'a.apk', 'b.apk', 'c.apk']]) assert.throws(() => parseArguments(args));
});

test('prerequisite checks diagnose missing tools and reject obsolete Java', () => {
  const missing = inspectPrerequisites({ env: {}, nodeVersion: '20.0.0', exists: () => false });
  assert.equal(missing.issues.length, 4);
  const wrongJava = inspectPrerequisites({ env: { JAVA_HOME: '/jdk', ANDROID_HOME: '/sdk' }, exists: () => true, execute: () => 'java version "1.8.0_432"' });
  assert.equal(wrongJava.javaHome, undefined);
  assert.match(wrongJava.issues.join('\n'), /JDK 21/);
  assert.equal(javaMajor('openjdk version "21.0.9" 2025-10-21'), 21);
  assert.equal(javaMajor('java version "1.8.0_432"'), 8);
});

test('prerequisite checks use a complete JDK21 and identify missing API36', () => {
  const report = inspectPrerequisites({
    env: { JAVA_HOME: '/jdk', ANDROID_HOME: '/sdk' },
    npmVersion: '11.17.0',
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

function installFixture(t, { installed = true, unreadable = false, id, code = 2, digest, secondSigner = false, split, user = '10' } = {}) {
  const root = fixture(t);
  const target = path.join(root, 'dist/android/SmartLingo-preview.apk');
  const sha256 = createHash('sha256').update(fs.readFileSync(target)).digest('hex');
  fs.writeFileSync(path.join(root, 'dist/android/SmartLingo-preview.provenance.json'), JSON.stringify({ applicationId: packageId, sha256 }));
  const installedPath = '/data/app/smartlingo/base.apk';
  const installs = [];
  let pulled;
  function execute(command, args) {
    const file = args.at(-1);
    if (args.includes('verify')) {
      const signature = apkSignature(file === target ? signer : digest);
      return file !== target && secondSigner ? `${signature}\nSigner #2 certificate SHA-256 digest: ${'fa'.repeat(32)}` : signature;
    }
    if (args.includes('badging')) return file === target ? apkBadging() : apkBadging({ id, code, split });
    if (args[0] === 'list') return apkList();
    if (args[0] === 'devices') return 'List of devices attached\nemulator-5570\tdevice\n';
    assert.deepEqual(args.slice(0, 2), ['-s', 'emulator-5570']);
    if (args.includes('get-current-user')) return `${user}\r\n`;
    if (args.includes('--user')) assert.equal(args[args.indexOf('--user') + 1], user);
    if (args.includes('packages')) return installed ? `package:${packageId}\r\n` : '';
    if (args.includes('path')) return unreadable ? '' : `package:${installedPath}\r\npackage:/data/app/smartlingo/split_config.en.apk\r\n`;
    if (args[2] === 'pull') {
      assert.equal(args[3], installedPath);
      pulled = file;
      fs.writeFileSync(pulled, 'installed APK');
      return '';
    }
    if (args[2] === 'install') { installs.push(args); return ''; }
    assert.fail(`Unexpected command ${command} ${args.join(' ')}`);
  }
  return {
    installs, target,
    pullRemoved: () => pulled && !fs.existsSync(path.dirname(pulled)),
    install: () => installApk('emulator-5570', { root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), execute }),
  };
}

test('an installed app is updated only after matching its signature and version', t => {
  const fixture = installFixture(t);
  fixture.install();
  assert.deepEqual(fixture.installs, [['-s', 'emulator-5570', 'install', '-r', '--user', '10', fixture.target]]);
  assert.ok(fixture.pullRemoved());
});

test('first install still succeeds when the package has no previous installation', t => {
  const fixture = installFixture(t, { installed: false });
  fixture.install();
  assert.equal(fixture.installs.length, 1);
  assert.equal(fixture.pullRemoved(), undefined);
});

test('incompatible or unverifiable installed APKs stop before adb install', t => {
  const cases = [
    [{ id: 'com.other.preview' }, /Package ID mismatch/],
    [{ digest: 'bb'.repeat(32) }, /signing certificate mismatch/],
    [{ code: 3 }, /version code 3 must be higher than 3/],
    [{ code: 4 }, /version code 3 must be higher than 4/],
    [{ unreadable: true }, /Could not identify the installed/],
    [{ secondSigner: true }, /exactly one verified APK signing certificate/],
    [{ split: " split='config.en'" }, /Use the base APK/],
    [{ user: 'Unknown command' }, /Could not determine the current Android user/],
  ];
  for (const [options, problem] of cases) {
    const fixture = installFixture(t, options);
    assert.throws(fixture.install, problem);
    assert.deepEqual(fixture.installs, []);
    if (!options.unreadable && !options.user) assert.ok(fixture.pullRemoved());
  }
});

test('failed preflight invalidates a previous published APK and receipt without executing builds', t => {
  const root = fixture(t);
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: ['missing JDK'] }), execute: () => assert.fail('must not execute') }), /missing JDK/);
  assert.equal(fs.readdirSync(path.join(root, 'dist/android')).length, 0);
});

test('doctor discovers a complete repository-local portable JDK without changing environment', t => {
  const root = fixture(t);
  const portable = path.join(root, '.cache/android-tools/jdk/official-jdk-21');
  fs.mkdirSync(path.join(portable, 'bin'), { recursive: true });
  for (const name of process.platform === 'win32' ? ['java.exe', 'javac.exe', 'jar.exe'] : ['java', 'javac', 'jar']) fs.writeFileSync(path.join(portable, 'bin', name), 'fixture');
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
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute: (command) => {
    if (command === 'git') return '';
    calls++;
    throw new Error('export failed');
  } }), /export failed/);
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
    if (command !== 'git') commands.push(args);
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
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute: (command) => {
    if (command !== 'git') calls++;
    return '';
  } }), /Fresh learner export/);
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

test('a source commit changed during assembly cannot claim the resulting APK', t => {
  const root = fixture(t);
  const webExport = path.join(root, 'apps/learner/dist');
  const sourceApk = path.join(root, 'apps/android/android/app/build/outputs/apk/debug/app-debug.apk');
  let commit = 'before-build';
  const execute = (command, args, { cwd } = {}) => {
    if (args[0] === 'rev-parse') return commit;
    if (args.includes('export')) {
      fs.mkdirSync(webExport, { recursive: true });
      fs.writeFileSync(path.join(webExport, 'index.html'), 'fresh export');
    }
    if (args.includes('assembleDebug')) {
      fs.mkdirSync(path.dirname(sourceApk), { recursive: true });
      fs.writeFileSync(sourceApk, 'signed APK');
      commit = 'after-build';
    }
    if (args.includes('verify')) return apkSignature();
    if (args.includes('badging')) return apkBadging();
    if (args[0] === 'list') return apkList();
    if (args[0] === '--extract') {
      const destination = path.join(cwd, 'assets/public');
      fs.mkdirSync(destination, { recursive: true });
      fs.copyFileSync(path.join(webExport, 'index.html'), path.join(destination, 'index.html'));
    }
    return '';
  };
  assert.throws(() => buildApk({ root, inspect: () => ({ issues: [], javaHome: '/jdk', sdk: '/sdk' }), npm: () => '/npm-cli.js', execute }), /source changed during APK assembly/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'dist/android')), []);
});

test('bridge logging must be disabled before any private learner backup can be packaged', t => {
  const root = fixture(t);
  const configFile = path.join(root, 'apps/android/capacitor.config.json');
  const config = JSON.parse(fs.readFileSync(configFile));
  delete config.loggingBehavior;
  fs.writeFileSync(configFile, JSON.stringify(config));
  assert.throws(() => buildApk({ root, inspect: () => assert.fail('must not preflight'), execute: () => assert.fail('must not execute') }), /disabled bridge logging/);
});
