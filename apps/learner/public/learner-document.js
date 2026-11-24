// Shared by the classic service worker and the exported preview server.
function isLearnerDocumentPath(pathname) {
  if (pathname === '/' || pathname === '/index.html' || pathname === '/languages' || pathname === '/languages/') return true;
  if (!pathname.startsWith('/') || pathname.length > 1400) return false;
  let parts;
  try { parts = pathname.slice(1).replace(/\/$/u, '').split('/').map(decodeURIComponent); }
  catch { return false; }
  const [area, language, section, item, extra, final] = parts;
  const key = value => !!value && /^[a-z0-9][a-z0-9_.:-]{0,179}$/iu.test(value);
  const question = value => /^[a-z0-9][a-z0-9_.:-]{0,240}$/iu.test(value);
  const positive = value => !!value && /^[1-9]\d{0,8}$/u.test(value);
  const topic = value => !!value && value.length <= 180 && !/[\x00-\x1f\x7f]/u.test(value);
  if (area === 'editor') return parts.length === 1 || (parts.length <= 3 && key(language) && (section === undefined || positive(section)));
  if (language !== 'fr' && language !== 'ja') return false;

  switch (area) {
    case 'today': case 'report': case 'profile': return parts.length === 2;
    case 'slang': return language === 'fr' && parts.length === 2;
    case 'review': return parts.length === 2 || (parts.length === 3 && ['notebook', 'practice'].includes(section));
    case 'lesson': return parts.length <= 4 && key(section) && (item === undefined || ['dialogue', 'vocabulary', 'listening', 'picture', 'sentence', 'finish'].includes(item));
    case 'course': return parts.length <= 5 && key(section) && (item === undefined || key(item)) && (extra === undefined || key(extra));
    case 'learn': break;
    default: return false;
  }

  if (section === undefined) return true;
  if (section === 'topics') return parts.length <= 4 && (item === undefined || topic(item));
  if (item !== undefined && !key(item)) return false;
  if (section === 'listening') return parts.length <= 5 && (extra === undefined || (item !== 'library' && question(extra)));
  if (section === 'speaking') return parts.length <= 6 && (extra === undefined || (positive(extra) && positive(final)));
  return section === 'letters' && language === 'ja' && parts.length <= 6 && (extra === undefined || extra === 'study' || extra === 'recognition')
    && (final === undefined || (extra === 'recognition' && key(final)));
}

if (typeof module !== 'undefined') module.exports = { isLearnerDocumentPath };
