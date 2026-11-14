// Deliberately limited to the TOML subset emitted by this repository.
// Unknown syntax fails instead of being silently accepted.
export function parseProjectToml(text) {
  const root = {};
  let target = root;
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    const section = line.match(/^\[([a-zA-Z0-9_.-]+)\]$/);
    if (section) {
      target = root;
      for (const part of section[1].split('.')) {
        if (['__proto__', 'constructor', 'prototype'].includes(part)) throw new Error('Invalid TOML section');
        if (!Object.hasOwn(target, part)) target[part] = {};
        if (!target[part] || typeof target[part] !== 'object') throw new Error('Conflicting TOML section');
        target = target[part];
      }
      continue;
    }
    const pair = line.match(/^([a-zA-Z0-9_-]+)\s*=\s*(.*)$/);
    if (!pair) throw new Error('Unsupported TOML syntax at line ' + (i + 1));
    const [, key, raw] = pair;
    if (['__proto__', 'constructor', 'prototype'].includes(key) || Object.hasOwn(target, key)) throw new Error('Invalid or duplicate TOML key');
    let value;
    if (raw === '"""') {
      const content = [];
      while (++i < lines.length && lines[i].trim() !== '"""') content.push(lines[i]);
      if (i === lines.length) throw new Error('Unterminated TOML string');
      value = content.join('\n');
    } else if (/^"(?:[^"\\]|\\.)*"$/.test(raw)) {
      value = JSON.parse(raw);
    } else if (/^(true|false)$/.test(raw)) {
      value = raw === 'true';
    } else if (/^\d+$/.test(raw)) {
      value = Number(raw);
    } else throw new Error('Unsupported TOML value at line ' + (i + 1));
    target[key] = value;
  }
  return root;
}
export function parseSkill(text) {
  const match = text.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  if (!match) throw new Error('Skill needs YAML frontmatter and instructions');
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(name|description):\s+(.+)$/);
    if (!pair || Object.hasOwn(fields, pair[1])) throw new Error('Unsupported or duplicate skill field');
    fields[pair[1]] = pair[2].trim();
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.name || '') || fields.name.length > 64) throw new Error('Invalid skill name');
  if (!fields.description || match[2].trim().length < 40) throw new Error('Skill description/instructions missing');
  return { ...fields, body: match[2] };
}
