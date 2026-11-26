import { createContext, useContext, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Platform } from 'react-native';
import { audio } from '../audio';
import { isAndroidApp, learnerDocumentHref } from '../platform/runtime';
import { parseAndroidRoute, parseRoute, routeHref, type AppRoute } from './routes';

interface EntryState { group: string; index: number; visit: string; href: string; chooser?: true }
interface Entry extends EntryState { route: AppRoute }
interface MoveOptions { replace?: boolean; repeat?: boolean; afterSave?: boolean; snapshot?: Record<string, unknown> }
interface Navigation {
  route: AppRoute;
  visit: string;
  navigate: (route: AppRoute, options?: MoveOptions) => void;
  backTo: (fallback: AppRoute, match?: (route: AppRoute) => boolean, search?: boolean, replaceFallback?: boolean) => void;
  registerBlock: (blocked: boolean, owner?: string) => void;
  read: (key: string) => unknown;
  write: (key: string, value: unknown) => void;
}

const metadataKey = 'smartlingoNavigationV2';
const visitLimit = 96;
const browser = () => Platform.OS === 'web' && typeof window !== 'undefined' ? window : undefined;
const token = () => Math.random().toString(36).slice(2);
const locationHref = (web: Window) => `${web.location.pathname}${web.location.search}${web.location.hash}`;
const hrefFor = (route: AppRoute, web?: Window) => route.kind === 'unavailable' && web ? locationHref(web) : learnerDocumentHref(routeHref(route));
function initialRoute(web?: Window): AppRoute {
  if (!web) return { kind: 'home' };
  const parse = isAndroidApp() ? parseAndroidRoute : parseRoute;
  return parse(web.location.pathname, web.location.search, web.location.hash);
}

function currentMetadata(web: Window): EntryState | undefined {
  const meta: Partial<EntryState> | null | undefined = web.history.state?.[metadataKey];
  if (!meta || typeof meta.group !== 'string' || typeof meta.visit !== 'string' || typeof meta.index !== 'number'
    || !Number.isSafeInteger(meta.index) || meta.index < 0 || meta.href !== locationHref(web)) return;
  return { group: meta.group, index: meta.index, visit: meta.visit, href: meta.href, chooser: meta.chooser === true ? true : undefined };
}

function save(web: Window, entry: Entry, replace: boolean) {
  const { group, index, visit, href, chooser } = entry;
  const meta: EntryState = { group, index, visit, href, chooser };
  const state = { ...web.history.state, [metadataKey]: meta };
  if (replace) web.history.replaceState(state, '', href);
  else web.history.pushState(state, '', href);
}

function firstEntry(): Entry {
  const web = browser();
  const route = initialRoute(web);
  const meta = web && currentMetadata(web);
  return { group: meta?.group ?? token(), index: meta?.index ?? 0, visit: meta?.visit ?? token(), href: hrefFor(route, web), route };
}

const Context = createContext<Navigation | null>(null);

export function WebNavigation({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState(firstEntry);
  const current = useRef(entry);
  const visits = useRef(new Map<string, Map<string, unknown>>());
  const known = useRef(new Map<number, Entry>([[entry.index, entry]]));
  const blockers = useRef(new Set<string>());
  const restoration = useRef<string | null>(null);
  const afterRestoration = useRef<(() => void) | null>(null);

  function retainVisit(visit: string, snapshot: Map<string, unknown>) {
    visits.current.delete(visit);
    visits.current.set(visit, snapshot);
    if (visits.current.size > visitLimit) visits.current.delete(visits.current.keys().next().value!);
  }

  function display(next: Entry) {
    audio.stop();
    if (current.current.group !== next.group) known.current.clear();
    known.current.set(next.index, next);
    if (known.current.size > visitLimit) known.current.delete(known.current.keys().next().value!);
    current.current = next;
    setEntry(next);
  }

  useLayoutEffect(() => {
    const web = browser();
    if (!web) return;
    const browserHashNavigation = !isAndroidApp();
    save(web, current.current, true);

    function traverse() {
      if (!web) return;
      const previous = current.current;
      const route = initialRoute(web);
      const meta = currentMetadata(web);
      if (restoration.current) {
        const returning = restoration.current === meta?.visit;
        restoration.current = null;
        const complete = afterRestoration.current;
        afterRestoration.current = null;
        if (returning) { complete?.(); return; }
      }
      if (meta?.visit === previous.visit && meta.href === previous.href) return;
      if (meta?.group === previous.group && known.current.get(meta.index)?.visit === meta.visit && meta.index !== previous.index && blockers.current.size) {
        restoration.current = previous.visit;
        web.history.go(previous.index - meta.index);
        return;
      }
      const chooser = route.kind === 'listening' && !route.library && meta?.chooser === true;
      const inPageEditor = route.kind === 'editor' && web.location.hash === '#editor' && !meta;
      const next: Entry = {
        group: meta?.group ?? (inPageEditor ? previous.group : token()),
        index: meta?.index ?? (inPageEditor ? previous.index + 1 : 0),
        visit: meta?.visit ?? token(), href: hrefFor(route, web),
        route: route.kind === 'listening' && chooser ? { ...route, chooser: true } : route,
        chooser: chooser ? true : undefined,
      };
      if (!meta || next.href !== meta.href) save(web, next, true);
      display(next);
    }

    web.addEventListener('popstate', traverse);
    // Android's managed fragments also emit popstate, which owns history restoration.
    if (browserHashNavigation) web.addEventListener('hashchange', traverse);
    return () => {
      web.removeEventListener('popstate', traverse);
      if (browserHashNavigation) web.removeEventListener('hashchange', traverse);
      audio.stop();
    };
  }, []);

  function navigate(route: AppRoute, options: MoveOptions = {}) {
    const previous = current.current;
    if (route.kind === 'editor' && isAndroidApp()) return;
    if (previous.visit !== entry.visit || (blockers.current.size && !options.afterSave)) return;
    if (restoration.current) {
      if (options.afterSave) afterRestoration.current = () => navigate(route, options);
      return;
    }
    const href = learnerDocumentHref(routeHref(route));
    const chooser = route.kind === 'listening' && route.chooser ? true : undefined;
    if (!options.repeat && previous.href === href && previous.chooser === chooser && previous.route.kind === route.kind) return;
    const next: Entry = { group: previous.group, index: previous.index + (options.replace ? 0 : 1), visit: token(), href, route, chooser };
    const web = browser();
    if (web) save(web, next, !!options.replace);
    const firstDiscarded = next.index;
    for (const [index, discarded] of known.current) {
      if (index < firstDiscarded || (options.replace && index !== firstDiscarded)) continue;
      visits.current.delete(discarded.visit);
      known.current.delete(index);
    }
    if (options.snapshot) retainVisit(next.visit, new Map(Object.entries(options.snapshot).map(([key, value]) => [key, { value }])));
    display(next);
  }

  function backTo(fallback: AppRoute, match = (route: AppRoute) => routeHref(route) === routeHref(fallback), search = false, replaceFallback = false) {
    const web = browser();
    if (blockers.current.size || restoration.current || current.current.visit !== entry.visit) return;
    if (web) {
      for (let index = entry.index - 1; index >= 0; index--) {
        const previous = known.current.get(index);
        if (!previous || previous.group !== entry.group) break;
        if (match(previous.route)) { web.history.go(index - entry.index); return; }
        if (!search) break;
      }
    }
    navigate(fallback, { replace: replaceFallback });
  }

  function write(key: string, value: unknown) {
    const snapshot = visits.current.get(entry.visit) ?? new Map<string, unknown>();
    snapshot.set(key, value);
    retainVisit(entry.visit, snapshot);
  }

  return <Context.Provider value={{
    route: entry.route, visit: entry.visit, navigate, backTo,
    registerBlock: (blocked, owner = 'feature') => { if (blocked) blockers.current.add(owner); else blockers.current.delete(owner); },
    read: key => visits.current.get(entry.visit)?.get(key), write,
  }}>{children}</Context.Provider>;
}

export function useNavigation(): Navigation {
  const navigation = useContext(Context);
  if (!navigation) throw new Error('The SmartLingo navigation context is unavailable.');
  return navigation;
}

export function useVisitState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const navigation = useNavigation();
  const [, redraw] = useState(0);
  const read = () => {
    const snapshot = navigation.read(key) as { value: T } | undefined;
    return snapshot ? snapshot.value : initial;
  };
  return [read(), update => {
    navigation.write(key, { value: typeof update === 'function' ? (update as (value: T) => T)(read()) : update });
    redraw(value => value + 1);
  }];
}
