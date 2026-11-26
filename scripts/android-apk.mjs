import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../', import.meta.url));
const windows = process.platform === 'win32';
const executable = name => name + (windows ? '.exe' : '');
const pinnedNode = fs.readFileSync(path.join(repository, '.node-version'), 'utf8').trim();
const manifest = JSON.parse(fs.readFileSync(path.join(repository, 'package.json'), 'utf8'));
const pinnedNpm = manifest.packageManager.replace(/^npm@/, '');
export const requirements = Object.freeze({ node: pinnedNode, npm: pinnedNpm, java: 21, platform: 'android-36', buildTools: '35.0.0' });
const applicationId = 'com.smartlingo.preview';
const apkName = 'SmartLingo-preview.apk';
const receiptName = 'SmartLingo-preview.provenance.json';

export function parseArguments(args) {
  const [command, ...rest] = args;
  if (command === 'check-update') {
    if (rest.length < 1 || rest.length > 2 || rest.some(file => !/\.apk$/i.test(file))) {
      throw new Error('Usage: npm run android:check-update -- PREVIOUS.apk [NEW.apk]');
    }
    return { command, previous: rest[0], candidate: rest[1] };
  }
  if (!['doctor', 'build', 'install', 'open'].includes(command)) throw new Error('Usage: android-apk.mjs doctor|build|check-update PREVIOUS.apk [NEW.apk]|install [--serial DEVICE]|open');
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

function versionNumbers(version) {
  return version.split('.').map(Number);
}

export function inspectPrerequisites({
  root = repository, env = process.env, nodeVersion = process.versions.node,
  npmVersion = env.npm_config_user_agent?.match(/^npm\/(\S+)/)?.[1],
  exists = fs.existsSync, execute = run,
} = {}) {
  const issues = [];
  const [nodeMajor, nodeMinor, nodePatch] = versionNumbers(nodeVersion);
  const [requiredMajor, requiredMinor, requiredPatch] = versionNumbers(requirements.node);
  if (nodeMajor !== requiredMajor || nodeMinor < requiredMinor || (nodeMinor === requiredMinor && nodePatch < requiredPatch)) {
    issues.push(`Use Node.js ${requirements.node} or a newer ${requiredMajor}.x release, as required by the learner.`);
  }
  const requiredNpmMajor = requirements.npm.split('.')[0];
  if (npmVersion?.split('.')[0] !== requiredNpmMajor) issues.push(`Run this command with npm ${requiredNpmMajor}.x (repository pin ${requirements.npm}).`);
  let javaHome;
  let javaVersion;
  for (const candidate of javaCandidates(env, root)) {
    const java = path.join(candidate, 'bin', executable('java'));
    if (!exists(java) || !exists(path.join(candidate, 'bin', executable('javac'))) || !exists(path.join(candidate, 'bin', executable('jar')))) continue;
    try {
      const output = execute(java, ['-version'], { capture: true });
      if (javaMajor(output) === requirements.java) { javaHome = candidate; javaVersion = output.trim(); break; }
    } catch { /* Diagnose all available candidates before failing. */ }
  }
  if (!javaHome) issues.push('JDK 21 not found. Set JAVA_HOME to a complete JDK 21 (bin/java, bin/javac and bin/jar), or install Android Studio with JDK 21.');
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
  return { issues, javaHome, javaVersion, sdk, node: nodeVersion, npmVersion };
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

function readApkIdentity(file, report, env, execute) {
  const tools = path.join(report.sdk, 'build-tools', requirements.buildTools);
  const java = path.join(report.javaHome, 'bin', executable('java'));
  const certificate = execute(java, ['-jar', path.join(tools, 'lib/apksigner.jar'), 'verify', '--verbose', '--print-certs', file], { env, capture: true });
  const signers = [...certificate.matchAll(/^Signer #\d+ certificate SHA-256 digest: ([a-f0-9]{64})[ \t]*\r?$/gim)];
  if (signers.length !== 1) throw new Error('Expected exactly one verified APK signing certificate.');
  const badging = execute(path.join(tools, executable('aapt')), ['dump', 'badging', file], { env, capture: true });
  const packageLine = badging.split(/\r?\n/).find(line => line.startsWith('package: ')) ?? '';
  if (/\bsplit='/.test(packageLine)) throw new Error('Use the base APK for update verification.');
  const packageId = packageLine.match(/\bname='([^']+)'/)?.[1];
  const versionCode = Number(packageLine.match(/\bversionCode='(\d+)'/)?.[1]);
  const versionName = packageLine.match(/\bversionName='([^']+)'/)?.[1];
  if (!packageId || !Number.isSafeInteger(versionCode) || versionCode < 1 || !versionName) {
    throw new Error('APK manifest did not report a complete package identity and version.');
  }
  return { applicationId: packageId, versionCode, versionName, signerCertificateSha256: signers[0][1].toLowerCase(), badging };
}

function verifyApk(file, report, env, execute) {
  const { badging, ...identity } = readApkIdentity(file, report, env, execute);
  if (identity.applicationId !== applicationId) throw new Error(`APK package ID ${identity.applicationId} does not match ${applicationId}.`);
  if (!badging.includes("sdkVersion:'24'") || !badging.includes("targetSdkVersion:'36'")) throw new Error('APK SDK requirements did not match the Android preview.');
  const tools = path.join(report.sdk, 'build-tools', requirements.buildTools);
  const entries = execute(path.join(tools, executable('aapt')), ['list', file], { env, capture: true }).split(/\r?\n/);
  const requiredBundle = [
    /^assets\/public\/index\.html$/,
    /^assets\/public\/_expo\/.*\.js$/,
    /^assets\/public\/generated-vocabulary-photos\/.*\.jpg$/,
    /^assets\/public\/learning-scenes\/.*\.jpg$/,
    /^assets\/public\/fonts\/.*\.woff2$/,
  ];
  if (!requiredBundle.every(pattern => entries.some(entry => pattern.test(entry)))) {
    throw new Error('APK is missing the bundled learner entry, JavaScript, pictures or fonts.');
  }
  return {
    ...identity, minSdk: 24, targetSdk: 36,
    permissions: [...badging.matchAll(/^uses-permission(?:-sdk-\d+)?: name='([^']+)'/gm)].map(match => match[1]),
    bundledFileCount: entries.filter(entry => entry.startsWith('assets/public/') && !entry.endsWith('/')).length,
  };
}

function verifyPackagedExport(file, webExport, report, env, execute) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'smartlingo-verify-apk-'));
  try {
    const jar = path.join(report.javaHome, 'bin', executable('jar'));
    execute(jar, ['--extract', '--file', file, 'assets/public'], { cwd: temporary, env });
    const exportedPaths = fs.readdirSync(webExport, { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile())
      .map(entry => path.relative(webExport, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
      .sort();
    const digest = createHash('sha256');
    for (const relative of exportedPaths) {
      const bundled = path.join(temporary, 'assets/public', relative);
      const exportedHash = hashFile(path.join(webExport, relative));
      if (!fs.existsSync(bundled) || hashFile(bundled) !== exportedHash) {
        throw new Error(`APK asset does not match the fresh learner export: ${relative}`);
      }
      digest.update(`${exportedHash}  ${relative}\n`);
    }
    return { exportedFileCount: exportedPaths.length, exportedFilesSha256: digest.digest('hex') };
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
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
  const webExport = path.join(root, 'apps/learner/dist');
  const index = path.join(webExport, 'index.html');
  if (fs.existsSync(index)) fs.unlinkSync(index);
  const source = gitState(root, execute);
  execute(process.execPath, [npm(), 'run', 'export', '--workspace', '@smartlingo/learner'], { cwd: root, env });
  if (!fs.existsSync(index)) throw new Error('Fresh learner export did not produce index.html.');
  execute(process.execPath, [path.join(root, 'node_modules/@capacitor/cli/bin/capacitor'), 'sync', 'android'], { cwd: shell, env });
  execute(path.join(report.javaHome, 'bin', executable('java')), [
    '-classpath', path.join(native, 'gradle/wrapper/gradle-wrapper.jar'),
    'org.gradle.wrapper.GradleWrapperMain', '--no-daemon', 'assembleDebug',
  ], { cwd: native, env });
  if (!fs.existsSync(sourceApk)) throw new Error('Gradle did not produce a fresh debug APK.');
  const verification = verifyApk(sourceApk, report, env, execute);
  const exportVerification = verifyPackagedExport(sourceApk, webExport, report, env, execute);
  const current = gitState(root, execute);
  if (source.commit !== current.commit || source.dirty !== current.dirty) {
    throw new Error('The source changed during APK assembly. Build again from a stable checkout.');
  }
  const provenance = {
    schemaVersion: 2, origin: 'https://localhost', variant: 'debug',
    builtAt: new Date().toISOString(), ...source,
    node: report.node, npm: report.npmVersion, java: report.javaVersion, sdk: requirements.platform,
    buildTools: requirements.buildTools, capacitor: manifest.devDependencies['@capacitor/android'],
    bytes: fs.statSync(sourceApk).size, sha256: hashFile(sourceApk),
    exportedIndexSha256: hashFile(index), ...verification, ...exportVerification,
  };
  const output = path.join(root, 'dist/android');
  fs.mkdirSync(output, { recursive: true });
  const target = path.join(output, apkName);
  try {
    fs.copyFileSync(sourceApk, target);
    fs.writeFileSync(path.join(output, receiptName), JSON.stringify(provenance, null, 2) + '\n');
  } catch (error) {
    invalidateArtifacts(root);
    throw error;
  }
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

function assertCompatibleUpdate(previous, candidate) {
  if (previous.applicationId !== applicationId || candidate.applicationId !== applicationId) {
    throw new Error(`Package ID mismatch. Expected ${applicationId} for both APKs. Got ${previous.applicationId} and ${candidate.applicationId}.`);
  }
  if (previous.signerCertificateSha256 !== candidate.signerCertificateSha256) {
    throw new Error('APK signing certificate mismatch. Use the original signing key. Keep the installed app and export a private learning backup if the key is unavailable.');
  }
  if (candidate.versionCode <= previous.versionCode) {
    throw new Error(`The update version code ${candidate.versionCode} must be higher than ${previous.versionCode}.`);
  }
}

function checkUpdateFiles(previous, candidate = path.join(repository, 'dist/android', apkName)) {
  const report = inspectPrerequisites();
  const env = readyEnvironment(report);
  const from = readApkIdentity(path.resolve(previous), report, env, run);
  const to = readApkIdentity(path.resolve(candidate), report, env, run);
  assertCompatibleUpdate(from, to);
  console.log(`Compatible update: ${applicationId} ${from.versionName} (${from.versionCode}) → ${to.versionName} (${to.versionCode}).\nSigning certificate SHA-256: ${to.signerCertificateSha256}`);
}

function checkInstalledUpdate(adb, device, userId, candidate, report, env, execute) {
  const deviceArgs = ['-s', device];
  const packages = execute(adb, [...deviceArgs, 'shell', 'pm', 'list', 'packages', '-u', '--user', userId, applicationId], { env, capture: true })
    .trim().split(/\r?\n/).filter(Boolean);
  if (packages.some(line => !/^package:[\w.]+$/.test(line))) {
    throw new Error('Could not verify installed packages for the current Android user. Installation stopped.');
  }
  if (!packages.includes(`package:${applicationId}`)) return false;

  const installedPaths = execute(adb, [...deviceArgs, 'shell', 'pm', 'path', '--user', userId, applicationId], { env, capture: true });
  const baseApks = [...installedPaths.matchAll(/^package:(\/[^\r\n]+\/base\.apk)\r?$/gm)];
  if (baseApks.length !== 1) {
    throw new Error('Could not identify the installed SmartLingo base APK. Switch to the Android user where SmartLingo is installed and try again.');
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'smartlingo-installed-apk-'));
  const installed = path.join(temporary, 'base.apk');
  try {
    execute(adb, [...deviceArgs, 'pull', baseApks[0][1], installed], { env, capture: true });
    assertCompatibleUpdate(readApkIdentity(installed, report, env, execute), candidate);
    return true;
  } finally {
    fs.rmSync(installed, { force: true });
    fs.rmdirSync(temporary);
  }
}

export function installApk(serial, { root = repository, inspect = inspectPrerequisites, execute = run } = {}) {
  const report = inspect({ root });
  const env = readyEnvironment(report);
  const target = path.join(root, 'dist/android', apkName);
  const receipt = JSON.parse(fs.readFileSync(path.join(root, 'dist/android', receiptName), 'utf8'));
  if (receipt.applicationId !== applicationId || hashFile(target) !== receipt.sha256) throw new Error('APK does not match its build receipt. Run npm run build:apk again.');
  const candidate = verifyApk(target, report, env, execute);
  const adb = path.join(report.sdk, 'platform-tools', executable('adb'));
  const device = selectDevice(execute(adb, ['devices'], { env, capture: true }), serial);
  const userId = execute(adb, ['-s', device, 'shell', 'am', 'get-current-user'], { env, capture: true }).trim();
  if (!/^\d+$/.test(userId)) throw new Error('Could not determine the current Android user. Installation stopped.');
  const updating = checkInstalledUpdate(adb, device, userId, candidate, report, env, execute);
  if (hashFile(target) !== receipt.sha256) throw new Error('APK changed during the compatibility check. Rerun the installer.');
  execute(adb, ['-s', device, 'install', '-r', '--user', userId, target], { env });
  console.log(updating ? 'Compatible update installed.' : 'SmartLingo installed for the current Android user.');
}

function main(args) {
  const options = parseArguments(args);
  if (options.command === 'doctor') {
    const report = inspectPrerequisites();
    console.log(`Node ${report.node}\nnpm ${report.npmVersion ?? 'unknown'}\nJDK: ${report.javaHome ?? 'missing'}\nSDK: ${report.sdk ?? 'missing'}\nRequired: Java 21, SDK Platform 36, Build-Tools ${requirements.buildTools}`);
    if (report.issues.length) throw new Error(report.issues.join('\n'));
    console.log('Android build prerequisites are available. First assembly may download Gradle/Maven dependencies and needs accepted SDK licences.');
  } else if (options.command === 'build') buildApk();
  else if (options.command === 'install') installApk(options.serial);
  else if (options.command === 'check-update') checkUpdateFiles(options.previous, options.candidate);
  else {
    readConfiguration(repository);
    run(process.execPath, [path.join(repository, 'node_modules/@capacitor/cli/bin/capacitor'), 'open', 'android'], { cwd: path.join(repository, 'apps/android') });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(`Android: ${error.message}`); process.exitCode = 1; }
}
