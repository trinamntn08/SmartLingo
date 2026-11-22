import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../', import.meta.url));
const windows = process.platform === 'win32';
const executable = name => name + (windows ? '.exe' : '');
export const requirements = Object.freeze({ node: 22, java: 21, platform: 'android-36', buildTools: '35.0.0' });
const applicationId = 'com.smartlingo.preview';
const apkName = 'SmartLingo-preview.apk';
const receiptName = 'SmartLingo-preview.provenance.json';

export function parseArguments(args) {
  const [command, ...rest] = args;
  if (!['doctor', 'build', 'install', 'open'].includes(command)) throw new Error('Usage: android-apk.mjs doctor|build|install [--serial DEVICE]|open');
  if (!rest.length) return { command };
  if (command !== 'install' || rest.length !== 2 || rest[0] !== '--serial' || !/^[A-Za-z0-9_.:-]+$/.test(rest[1])) {
    throw new Error('Only install accepts --serial DEVICE; all other arguments are rejected.');
  }
  return { command, serial: rest[1] };
}

function run(command, args, { cwd = repository, env = process.env, capture = false } = {}) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', maxBuffer: 8 * 1024 * 1024, windowsHide: true });
  if (result.error || result.status !== 0) {
    throw new Error(`${path.basename(command)} failed${result.status == null ? '' : ` (exit ${result.status})`}: ${result.error?.message ?? (capture ? result.stderr?.trim() : 'see output above')}`);
  }
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

export function javaMajor(output) {
  const match = output.match(/(?:openjdk|java) version "(\d+)(?:\.(\d+))?/);
  return match ? Number(match[1] === '1' ? match[2] : match[1]) : undefined;
}

function portableJdks(root) {
  const directory = path.join(root, '.cache/android-tools/jdk');
  try {
    return fs.readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isDirectory()).map(entry => path.join(directory, entry.name));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function javaCandidates(env, root) {
  const local = env.LOCALAPPDATA;
  return [...new Set([
    env.JAVA_HOME,
    ...portableJdks(root),
    env.ProgramFiles && path.join(env.ProgramFiles, 'Java', 'jdk-21'),
    env.ProgramFiles && path.join(env.ProgramFiles, 'Android', 'Android Studio', 'jbr'),
    local && path.join(local, 'Programs', 'Android Studio', 'jbr'),
    '/usr/lib/jvm/java-21-openjdk-amd64', '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
  ].filter(Boolean))];
}

export function inspectPrerequisites({ root = repository, env = process.env, nodeVersion = process.versions.node, exists = fs.existsSync, execute = run } = {}) {
  const issues = [];
  if (Number(nodeVersion.split('.')[0]) < requirements.node) issues.push('Node.js 22 or newer is required.');
  let javaHome;
  let javaVersion;
  for (const candidate of javaCandidates(env, root)) {
    const java = path.join(candidate, 'bin', executable('java'));
    if (!exists(java) || !exists(path.join(candidate, 'bin', executable('javac')))) continue;
    try {
      const output = execute(java, ['-version'], { capture: true });
      if (javaMajor(output) === requirements.java) { javaHome = candidate; javaVersion = output.trim(); break; }
    } catch { /* Diagnose all available candidates before failing. */ }
  }
  if (!javaHome) issues.push('JDK 21 not found. Set JAVA_HOME to a complete JDK 21 (bin/java and bin/javac), or install Android Studio with JDK 21.');
  const sdkCandidates = [...new Set([env.ANDROID_HOME, env.ANDROID_SDK_ROOT, env.LOCALAPPDATA && path.join(env.LOCALAPPDATA, 'Android', 'Sdk'), env.HOME && path.join(env.HOME, 'Android', 'Sdk')].filter(Boolean))];
  const sdk = sdkCandidates.find(candidate => exists(path.join(candidate, 'platform-tools', executable('adb')))) ?? sdkCandidates[0];
  if (!sdk) issues.push('Android SDK not found. Set ANDROID_HOME to the SDK directory.');
  else {
    for (const [relative, instruction] of [
      [path.join('platform-tools', executable('adb')), 'Android SDK Platform-Tools'],
      [path.join('platforms', requirements.platform, 'android.jar'), `Android SDK Platform 36 (${requirements.platform})`],
      [path.join('build-tools', requirements.buildTools, executable('aapt')), `Android SDK Build-Tools ${requirements.buildTools}`],
      [path.join('build-tools', requirements.buildTools, 'lib', 'apksigner.jar'), `Android SDK Build-Tools ${requirements.buildTools} (apksigner)`],
    ]) if (!exists(path.join(sdk, relative))) issues.push(`Missing ${instruction}. Install it through Android Studio SDK Manager.`);
  }
  return { issues, javaHome, javaVersion, sdk, node: nodeVersion };
}

function readyEnvironment(report) {
  if (report.issues.length) throw new Error(report.issues.join('\n'));
  return {
    ...process.env, JAVA_HOME: report.javaHome, ANDROID_HOME: report.sdk, ANDROID_SDK_ROOT: report.sdk,
    PATH: `${path.join(report.javaHome, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
  };
}

function npmCli() {
  const candidates = [process.env.npm_execpath, path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')];
  const found = candidates.find(file => file && file.endsWith('npm-cli.js') && fs.existsSync(file));
  if (!found) throw new Error('npm CLI not found. Run this command with npm run build:apk using a normal Node/npm installation.');
  return found;
}

function readConfiguration(root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'apps/android/capacitor.config.json'), 'utf8').replace(/^\uFEFF/, ''));
  if (config.appId !== applicationId || config.webDir !== '../learner/dist' || config.server?.hostname !== 'localhost' || config.server?.androidScheme !== 'https' || config.server?.url || config.server?.allowNavigation || config.loggingBehavior !== 'none') {
    throw new Error('Android config must bundle ../learner/dist at https://localhost with the stable preview application ID, disabled bridge logging and no remote navigation.');
  }
  return config;
}

export function invalidateArtifacts(root) {
  const output = path.join(root, 'dist/android');
  for (const name of [apkName, receiptName]) {
    const file = path.join(output, name);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

function hashFile(file) { return createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }

function gitState(root, execute) {
  return {
    commit: execute('git', ['rev-parse', 'HEAD'], { cwd: root, capture: true }).trim(),
    dirty: execute('git', ['status', '--porcelain'], { cwd: root, capture: true }).trim().length > 0,
  };
}

function verifyApk(file, report, env, execute) {
  const tools = path.join(report.sdk, 'build-tools', requirements.buildTools);
  const java = path.join(report.javaHome, 'bin', executable('java'));
  const certificate = execute(java, ['-jar', path.join(tools, 'lib/apksigner.jar'), 'verify', '--verbose', '--print-certs', file], { env, capture: true });
  const badging = execute(path.join(tools, executable('aapt')), ['dump', 'badging', file], { env, capture: true });
  if (!badging.includes(`package: name='${applicationId}'`) || !badging.includes("sdkVersion:'24'") || !badging.includes("targetSdkVersion:'36'")) throw new Error('APK identity or SDK requirements did not match the Android preview.');
  const entries = execute(path.join(tools, executable('aapt')), ['list', file], { env, capture: true }).split(/\r?\n/);
  if (!entries.includes('assets/public/index.html') || !entries.some(entry => /^assets\/public\/_expo\/.*\.js$/.test(entry)) || !entries.some(entry => /^assets\/public\/vocabulary-photos\/.*\.(jpg|png|webp)$/.test(entry))) throw new Error('APK is missing its bundled learner, JavaScript or pictures.');
  const signer = certificate.match(/Signer #1 certificate SHA-256 digest: ([a-f0-9]+)/i)?.[1];
  if (!signer) throw new Error('APK signature verification did not report a signing certificate.');
  return { signerCertificateSha256: signer, bundledFileCount: entries.filter(entry => entry.startsWith('assets/public/')).length };
}

export function buildApk({ root = repository, execute = run, inspect = inspectPrerequisites, npm = npmCli } = {}) {
  // Invalidate the published pair before any operation can fail. Never hand off
  // yesterday's APK as the output of a failed attempt.
  invalidateArtifacts(root);
  readConfiguration(root);
  const report = inspect({ root });
  const env = readyEnvironment(report);
  const shell = path.join(root, 'apps/android');
  const native = path.join(shell, 'android');
  const sourceApk = path.join(native, 'app/build/outputs/apk/debug/app-debug.apk');
  if (fs.existsSync(sourceApk)) fs.unlinkSync(sourceApk);
  const index = path.join(root, 'apps/learner/dist/index.html');
  if (fs.existsSync(index)) fs.unlinkSync(index);
  execute(process.execPath, [npm(), 'run', 'export', '--workspace', '@smartlingo/learner'], { cwd: root, env });
  if (!fs.existsSync(index)) throw new Error('Fresh learner export did not produce index.html.');
  execute(process.execPath, [path.join(root, 'node_modules/@capacitor/cli/bin/capacitor'), 'sync', 'android'], { cwd: shell, env });
  execute(path.join(report.javaHome, 'bin', executable('java')), [
    '-classpath', path.join(native, 'gradle/wrapper/gradle-wrapper.jar'),
    'org.gradle.wrapper.GradleWrapperMain', '--no-daemon', 'assembleDebug',
  ], { cwd: native, env });
  if (!fs.existsSync(sourceApk)) throw new Error('Gradle did not produce a fresh debug APK.');
  const verification = verifyApk(sourceApk, report, env, execute);
  const provenance = {
    schemaVersion: 1, applicationId, origin: 'https://localhost', variant: 'debug',
    builtAt: new Date().toISOString(), ...gitState(root, execute),
    node: report.node, java: report.javaVersion, sdk: requirements.platform,
    buildTools: requirements.buildTools, capacitor: '8.6.2',
    bytes: fs.statSync(sourceApk).size, sha256: hashFile(sourceApk),
    exportedIndexSha256: hashFile(index), ...verification,
  };
  const output = path.join(root, 'dist/android');
  fs.mkdirSync(output, { recursive: true });
  const target = path.join(output, apkName);
  fs.copyFileSync(sourceApk, target);
  fs.writeFileSync(path.join(output, receiptName), JSON.stringify(provenance, null, 2) + '\n');
  console.log(`Verified debug APK: ${target}\nSHA-256: ${provenance.sha256}\nNo device installation was performed.`);
  return { target, provenance };
}

export function selectDevice(output, serial) {
  const devices = output.split(/\r?\n/).map(line => line.trim().split(/\s+/)).filter(parts => parts.length >= 2 && parts[0] !== 'List' && !parts[0].startsWith('*')).map(([id, state]) => ({ id, state }));
  if (serial) {
    if (!devices.some(device => device.id === serial && device.state === 'device')) throw new Error('Selected device is missing, offline or not authorised for USB debugging.');
    return serial;
  }
  if (devices.length !== 1 || devices[0].state !== 'device') throw new Error('Connect exactly one authorised device, or select an authorised device with --serial DEVICE.');
  return devices[0].id;
}

function installApk(serial) {
  const report = inspectPrerequisites();
  const env = readyEnvironment(report);
  const target = path.join(repository, 'dist/android', apkName);
  const receipt = JSON.parse(fs.readFileSync(path.join(repository, 'dist/android', receiptName), 'utf8'));
  if (receipt.applicationId !== applicationId || hashFile(target) !== receipt.sha256) throw new Error('APK does not match its build receipt. Run npm run build:apk again.');
  verifyApk(target, report, env, run);
  const adb = path.join(report.sdk, 'platform-tools', executable('adb'));
  const device = selectDevice(run(adb, ['devices'], { env, capture: true }), serial);
  run(adb, ['-s', device, 'install', '-r', target], { env });
  console.log('Debug update installed. Existing app data is retained when the signing key matches.');
}

function main(args) {
  const options = parseArguments(args);
  if (options.command === 'doctor') {
    const report = inspectPrerequisites();
    console.log(`Node ${report.node}\nJDK: ${report.javaHome ?? 'missing'}\nSDK: ${report.sdk ?? 'missing'}\nRequired: Java 21, SDK Platform 36, Build-Tools ${requirements.buildTools}`);
    if (report.issues.length) throw new Error(report.issues.join('\n'));
    console.log('Android build prerequisites are available. First assembly may download Gradle/Maven dependencies and needs accepted SDK licences.');
  } else if (options.command === 'build') buildApk();
  else if (options.command === 'install') installApk(options.serial);
  else {
    readConfiguration(repository);
    run(process.execPath, [path.join(repository, 'node_modules/@capacitor/cli/bin/capacitor'), 'open', 'android'], { cwd: path.join(repository, 'apps/android') });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(`Android: ${error.message}`); process.exitCode = 1; }
}
