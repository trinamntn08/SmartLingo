import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { lessonSchema, matchesLesson, type Lesson, type LessonPreview } from '@smartlingo/domain';
import { useNavigation } from '../app/WebNavigation';
import { localContentApi } from '../content/api';
import { Badge, Button } from '../ui/controls';
import { BrandHome } from '../ui/BrandHome';
import { Icon } from '../ui/Icon';
import { LessonScreen } from '../ui/LessonScreen';
import { ScreenHeader } from '../ui/ScreenHeader';
import { colors, designTokens, styles as s } from '../ui/theme';
import { DraftFields } from './DraftFields';
import { usePreviewLearning } from './usePreviewLearning';

type Navigation = { kind: 'select'; lesson: Lesson } | { kind: 'reload' };
type UnsavedForm = { saved: Lesson; draft: Lesson; duration: string };
const editableDraft = (lesson: Lesson): Lesson => ({ ...lesson, status: 'draft' });

export function CurriculumEditor({ onExit, onHome }: { onExit: () => void; onHome: () => void }) {
  const { route, visit, navigate, backTo, registerBlock } = useNavigation();
  const editorRoute = route.kind === 'editor' ? route : undefined;
  const requestedId = editorRoute?.lessonId;
  const [catalogue, setCatalogue] = useState<Lesson[]>([]);
  const [search, setSearch] = useState('');
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [saved, setSaved] = useState<Lesson | null>(null);
  const [draft, setDraft] = useState<Lesson | null>(null);
  const [durationText, setDurationText] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<LessonPreview | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [reviewFocused, setReviewFocused] = useState(false);
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const inFlight = useRef(false);
  const unsavedForms = useRef(new Map<string, UnsavedForm>());
  const { width } = useWindowDimensions();
  const wide = width >= 1050;
  const dirty = !!draft && !!saved && (JSON.stringify(draft) !== JSON.stringify(editableDraft(saved)) || durationText !== String(saved.durationMinutes));
  const knownLesson = !requestedId || catalogue.some(lesson => lesson.id === requestedId);
  const previewOpen = !!saved && requestedId === saved.id && editorRoute?.revision === saved.revision && saved.status === 'draft';
  const receipt = previewOpen && !dirty && preview?.lesson.id === saved.id && preview.lesson.revision === saved.revision ? preview : null;

  function resetReview() { setPreview(null); setReviewed(false); }
  function select(lesson: Lesson) {
    const unsaved = unsavedForms.current.get(lesson.id);
    unsavedForms.current.delete(lesson.id);
    setSaved(unsaved?.saved ?? lesson); setDraft(unsaved?.draft ?? editableDraft(lesson)); setDurationText(unsaved?.duration ?? String(lesson.durationMinutes)); resetReview(); setMessage(''); setError(''); setValidationError(false); setConflict(false); setNavigation(null);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  function openLesson(lesson: Lesson) {
    select(lesson);
    navigate({ kind: 'editor', lessonId: lesson.id });
  }
  function closePreview() {
    if (!saved) return;
    resetReview();
    backTo({ kind: 'editor', lessonId: saved.id }, previous => previous.kind === 'editor' && !previous.revision && (!previous.lessonId || previous.lessonId === saved.id));
  }
  function report(failure: unknown) {
    setValidationError(false);
    setError(failure instanceof Error ? failure.message : 'The local API request failed. Your form has been kept.');
    setConflict(typeof failure === 'object' && failure !== null && 'status' in failure && failure.status === 409);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  async function loadLatest(selectedId?: string) {
    if (inFlight.current) return;
    inFlight.current = true; setLoading(true); setError('');
    try {
      const lessons = await localContentApi.listLessons();
      setCatalogue(lessons);
      const selected = selectedId ? lessons.find(lesson => lesson.id === selectedId) : lessons[0];
      if (selected) select(selected); else { setSaved(null); setDraft(null); resetReview(); }
    } catch (failure) { report(failure); }
    finally { inFlight.current = false; setLoading(false); }
  }
  useEffect(() => { void loadLatest(requestedId); }, []);
  useEffect(() => {
    if (!editorRoute || loading || busy) return;
    const selected = requestedId ? catalogue.find(lesson => lesson.id === requestedId) : catalogue[0];
    if (!selected || selected.id === saved?.id) return;
    if (dirty && saved && draft) unsavedForms.current.set(saved.id, { saved, draft, duration: durationText });
    select(selected);
  }, [editorRoute, loading, busy, catalogue, requestedId, saved, draft, dirty, durationText]);
  useEffect(() => { if (!previewOpen) resetReview(); }, [previewOpen]);
  useEffect(() => {
    if (typeof window === 'undefined' || (!dirty && !unsavedForms.current.size)) return;
    function preserveDraft(event: BeforeUnloadEvent) { event.preventDefault(); event.returnValue = ''; }
    window.addEventListener('beforeunload', preserveDraft);
    return () => window.removeEventListener('beforeunload', preserveDraft);
  }, [dirty, visit]);
  useEffect(() => () => registerBlock(false, 'editor'), []);

  function startWrite() {
    inFlight.current = true;
    registerBlock(true, 'editor');
    setBusy(true);
  }
  function finishWrite() {
    inFlight.current = false;
    registerBlock(false, 'editor');
    setBusy(false);
  }

  function clearValidationMessage() { if (validationError) { setValidationError(false); setError(''); } }
  function change(next: Lesson) { setDraft(next); resetReview(); setMessage(''); clearValidationMessage(); }
  function changeDuration(value: string) { setDurationText(value); resetReview(); setMessage(''); clearValidationMessage(); }
  async function saveDraft(): Promise<boolean> {
    if (!draft || !saved || inFlight.current) return false;
    const durationMinutes = /^[0-9]+$/.test(durationText.trim()) ? Number(durationText.trim()) : Number.NaN;
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 60) {
      setValidationError(true);
      setError('Estimated duration must be a whole number from 1 to 60 minutes. Correct this field before saving.');
      scroll.current?.scrollTo({ y: 0, animated: false }); return false;
    }
    const parsed = lessonSchema.safeParse({ ...draft, durationMinutes });
    if (!parsed.success) { setValidationError(true); setError('Required fields need text; word notes may be empty. Meanings allow up to 500 characters, French examples up to 1,000, and other editable fields up to 2,000. Check the form before saving.'); scroll.current?.scrollTo({ y: 0, animated: false }); return false; }
    startWrite(); setError(''); setMessage(''); resetReview();
    try {
      const lesson = await localContentApi.saveDraft(parsed.data, saved.revision);
      setSaved(lesson); setDraft(editableDraft(lesson)); setDurationText(String(lesson.durationMinutes)); setCatalogue(current => current.map(item => item.id === lesson.id ? lesson : item));
      setConflict(false); setMessage(`Draft revision ${lesson.revision} saved locally. Preview this revision before publishing.`);
      return true;
    } catch (failure) { report(failure); return false; }
    finally { finishWrite(); }
  }
  async function previewDraft() {
    if (!saved || dirty || saved.status !== 'draft' || inFlight.current) return;
    startWrite(); setError(''); resetReview();
    try {
      const result = await localContentApi.previewDraft(saved.id, saved.revision);
      setPreview(result);
      navigate({ kind: 'editor', lessonId: saved.id, revision: saved.revision }, { afterSave: true });
      setMessage('Saved-revision preview opened. Practice here is temporary and separate from learner history.');
    }
    catch (failure) { report(failure); }
    finally { finishWrite(); }
  }
  async function publishDraft() {
    if (!saved || !receipt || !reviewed || dirty || inFlight.current) return;
    startWrite(); setError(''); setMessage('');
    try {
      const published = await localContentApi.publishDraft(saved.id, saved.revision, receipt.previewToken);
      setSaved(published); setDraft(editableDraft(published)); setDurationText(String(published.durationMinutes)); setCatalogue(current => current.map(item => item.id === published.id ? published : item));
      resetReview(); setConflict(false); setMessage(`Published revision ${published.revision} to the local catalogue. Return to learning, open Profile, and load published lessons to use it.`);
      navigate({ kind: 'editor', lessonId: published.id }, { replace: true, afterSave: true });
      scroll.current?.scrollTo({ y: 0, animated: false });
    } catch (failure) { resetReview(); report(failure); }
    finally { finishWrite(); }
  }
  function requestNavigation(next: Navigation) {
    if (dirty) { setNavigation(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
    else if (next.kind === 'select') openLesson(next.lesson); else void loadLatest(saved?.id);
  }
  function discardAndNavigate() {
    const next = navigation;
    setNavigation(null);
    if (next?.kind === 'select') openLesson(next.lesson);
    else if (next?.kind === 'reload') void loadLatest(saved?.id);
  }
  async function saveAndNavigate() {
    const next = navigation;
    if (await saveDraft()) {
      setNavigation(null);
      if (next?.kind === 'select') openLesson(next.lesson);
      else if (next?.kind === 'reload') void loadLatest(saved?.id);
    }
  }
  return <View style={s.app}>
    <View style={[s.header, width < 600 && { paddingHorizontal: 16 }]}><View style={s.headerInner}>
      <BrandHome onPress={() => { if (!busy) onHome(); }} />
      <Button compact quiet icon="arrow-left" disabled={busy} onPress={onExit}>Return to learning</Button>
    </View></View>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled"><View style={[s.main, { maxWidth: 1440 }, width < 600 && { padding: 16, paddingTop: 24 }]}>
      <ScreenHeader title="French curriculum editor" />
      {!!navigation && <View style={s.notice}><Text style={s.heading}>Keep your unsaved edits?</Text><Text style={s.body}>Save this draft first, discard the form to continue, or keep editing. Reloading latest will not merge your text.</Text><View style={s.row}>
        {navigation.kind === 'select' && <Button primary disabled={busy || loading} onPress={() => void saveAndNavigate()}>Save draft and switch</Button>}
        <Button disabled={busy || loading} onPress={discardAndNavigate}>Discard edits and continue</Button><Button disabled={busy} onPress={() => setNavigation(null)}>Keep editing</Button>
      </View></View>}
      {!!error && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>The editor request didn’t complete.</Text><Text style={s.body}>{error}</Text>
        {conflict ? <><Text style={s.body}>A newer revision may exist. Your form is still here. Reload latest explicitly before saving again; nothing is merged or retried automatically.</Text><Button disabled={busy || loading} onPress={() => requestNavigation({ kind: 'reload' })}>Reload latest revision</Button></>
          : validationError ? <Text style={s.body}>Correct the form, then save again. No revision has been sent.</Text>
            : <><Text style={s.body}>For local editing, start the API with npm run dev:api, then retry your action. Learner lessons still work without it.</Text>{!saved && <Button disabled={loading} onPress={() => void loadLatest(requestedId)}>Retry loading lessons</Button>}</>}
      </View>}
      {!!message && <View style={[s.notice, { backgroundColor: colors.green }]}><Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text></View>}
      {!loading && !error && !knownLesson && <View style={s.notice}><Text accessibilityRole="alert" style={s.body}>That lesson is unavailable in the local catalogue.</Text><Button onPress={() => navigate({ kind: 'editor' })}>Open the editor catalogue</Button></View>}
      {loading ? <View style={s.card}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Loading local curriculum…</Text></View> : <>
        {!catalogue.length && !error && <View style={s.card}><Text style={s.heading}>No local lessons yet.</Text><Text style={s.body}>The first editor updates existing curriculum. Start the local API with its bundled lesson seeds.</Text><Button onPress={() => void loadLatest()}>Reload catalogue</Button></View>}
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 24, alignItems: 'flex-start', minWidth: 0 }}>
        {!!catalogue.length && <View style={{ width: wide ? 272 : '100%', flexShrink: 0, gap: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, padding: 16, borderRadius: designTokens.radius.md }}>
          <View style={[s.row, { justifyContent: 'space-between' }]}><Text style={s.heading}>Lesson catalogue</Text><Badge>{catalogue.length}</Badge></View>
          <TextInput accessibilityLabel="Search curriculum" placeholder="Find a topic or lesson" value={search} onChangeText={setSearch} style={s.input} />
          {!wide && <Button expanded={catalogueOpen || !!search} onPress={() => setCatalogueOpen(value => !value)}>{catalogueOpen ? 'Hide lesson catalogue' : 'Browse lesson catalogue'}</Button>}
          {(wide || catalogueOpen || !!search) && <ScrollView style={{ maxHeight: wide ? 660 : 260 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            <View>{catalogue.filter(lesson => matchesLesson(lesson, search)).map(lesson =>
              <CatalogueLesson key={lesson.id} lesson={lesson} selected={saved?.id === lesson.id} disabled={busy || saved?.id === lesson.id}
                onPress={() => requestNavigation({ kind: 'select', lesson })} />)}</View>
          </ScrollView>
          }
          {!catalogue.some(lesson => matchesLesson(lesson, search)) && <Text style={s.muted}>No matching lessons.</Text>}
        </View>}
        {knownLesson && saved && draft && (!requestedId || requestedId === saved.id) && <View style={{ flex: wide ? 1 : undefined, width: wide ? undefined : '100%', minWidth: 0, gap: 24 }}>
          <View style={[s.card, { padding: width < 600 ? 16 : 24 }]}><View style={s.row}><Badge>{saved.status} · revision {saved.revision}</Badge>{dirty && <Badge>Unsaved changes</Badge>}</View><Text style={s.heading}>{saved.title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[
              ['Edit draft', !previewOpen], ['Try saved revision', previewOpen && !reviewed], ['Review & publish', reviewed],
            ].map(([title, active], index) => <View key={String(title)} aria-current={active ? 'step' : undefined}
              style={{ flexGrow: 1, flexBasis: 144, flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderBottomWidth: 3,
                borderBottomColor: active ? colors.yellow : colors.line }}>
              <Text style={s.eyebrow}>{index + 1}</Text><Text style={[s.body, { flexShrink: 1 }]}>{title}</Text>
            </View>)}</View>
            <View style={s.row}><Button primary disabled={busy || conflict || (!dirty && saved.status === 'draft')} onPress={() => void saveDraft()}>{busy ? 'Working…' : saved.status === 'published' ? 'Save new draft revision' : 'Save draft revision'}</Button>
              <Button disabled={busy || conflict || dirty || saved.status !== 'draft'} onPress={() => void previewDraft()}>Preview saved revision</Button>
              <Button disabled={busy} onPress={() => requestNavigation({ kind: 'reload' })}>Reload latest revision</Button>
              {editorRoute?.revision && <Button disabled={busy} onPress={closePreview}>Back to draft fields</Button>}
            </View>{dirty && <Text style={s.muted}>{previewOpen ? 'Your unsaved edits are still in the draft fields.' : 'Save your changes before previewing. Editing clears the previous preview receipt and review approval.'}</Text>}
          </View>
          {!!editorRoute?.revision && !previewOpen && <View style={s.notice}><Text accessibilityLiveRegion="polite" style={s.body}>That saved draft revision is unavailable. The current draft is shown below.</Text></View>}
          {previewOpen ? <SavedPreview key={`${saved.id}.${saved.revision}.${visit}`} lesson={receipt?.lesson ?? saved} onClose={closePreview} /> : <DraftFields draft={draft} onChange={change} disabled={busy} durationText={durationText} onDurationChange={changeDuration} />}
          <View style={[s.card, { borderTopWidth: 4, borderTopColor: colors.yellow }]}><Text style={s.eyebrow}>03 · Explicit publication</Text><Text accessibilityRole="header" style={s.heading}>Publication review</Text><Text style={s.body}>Check the French and English for naturalness and accuracy, the accepted exercise answers, picture meaning, level, and media rights. Device speech is synthetic and has not been reviewed.</Text>
            <Text style={s.muted}>{saved.provenance.rights}</Text><Text style={s.muted}>{receipt ? `Preview receipt: revision ${receipt.lesson.revision}. Valid for up to 15 minutes.` : 'Save and preview the current draft to enable review and publication.'}</Text>
            <Pressable accessibilityRole="checkbox" aria-checked={reviewed} aria-disabled={busy || !receipt || dirty} accessibilityState={{ checked: reviewed, disabled: busy || !receipt || dirty }} disabled={busy || !receipt || dirty} onFocus={() => setReviewFocused(true)} onBlur={() => setReviewFocused(false)} onPress={() => setReviewed(!reviewed)} style={({ pressed }) => [s.notice, { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: reviewed ? colors.green : colors.sand, borderWidth: 2, borderColor: reviewFocused ? '#246944' : 'transparent', opacity: pressed ? 0.7 : 1 }]}>
              <View aria-hidden style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.card }}>
                {reviewed && <Icon name="check" color={colors.primary} />}
              </View><Text style={[s.body, { flex: 1 }]}>I have reviewed this saved revision for language, answers, suitability, and rights, and approve its local publication.</Text>
            </Pressable>
            <Button primary disabled={busy || conflict || !receipt || !reviewed || dirty} onPress={() => void publishDraft()}>Publish reviewed revision</Button><Text style={s.muted}>Publication creates a new local revision. Earlier content and learner history are retained.</Text>
          </View>
          <Text style={s.muted}>Unsaved edits stay here when you return to learning. Save before reloading or closing this browser tab.</Text>
        </View>}
        </View>
      </>}
    </View></ScrollView>
  </View>;
}

function CatalogueLesson({ lesson, selected, disabled, onPress }: { lesson: Lesson; selected: boolean; disabled: boolean; onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={`${lesson.topic} · ${lesson.subtitle}`} aria-selected={selected}
    aria-disabled={disabled} accessibilityState={{ selected, disabled }} disabled={disabled} onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={({ pressed }) => ({ padding: 12, gap: 4,
      borderBottomWidth: 1, borderBottomColor: colors.line, borderLeftWidth: 3, borderLeftColor: selected ? colors.yellow : 'transparent',
      backgroundColor: selected ? colors.paper : colors.card,
      opacity: pressed ? 0.75 : 1, ...(focused ? { outlineColor: colors.ink, outlineWidth: 3, outlineStyle: 'solid', outlineOffset: 2 } : {}) })}>
    <Text style={s.eyebrow}>{lesson.topic}</Text><Text style={s.body}>{lesson.subtitle}</Text>
    <Text style={s.muted}>{lesson.level === 'foundation' ? 'Foundations' : lesson.level} · {lesson.status} · r{lesson.revision}</Text>
  </Pressable>;
}

function SavedPreview({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const model = usePreviewLearning();
  const pictureAnswer = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  return <View style={{ gap: 20 }}><View style={[s.notice, { borderLeftWidth: 4, borderLeftColor: colors.yellow }]}><Text style={s.heading}>Saved revision {lesson.revision} · temporary practice</Text><Text style={s.body}>Preview attempts, word saves and completions are temporary.</Text></View><LessonScreen lesson={lesson} model={model} onExit={onClose} />
    <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Author review details</Text><Text style={s.muted}>Answer keys are shown here for curriculum review. These details are separate from learner practice.</Text>
      <Text style={s.body}>Level: {lesson.level} · Target language: {lesson.language} · Explanation language: {lesson.explanationLanguage}</Text>
      <Text style={s.body}>Estimated duration: {lesson.durationMinutes} minutes</Text>
      <Text style={s.eyebrow}>{lesson.pictureActivity.mode === 'meaning' ? 'Meaning answer' : 'Picture answer'}</Text><Text style={s.body}>{pictureAnswer.target} ({pictureAnswer.id})</Text><Text style={s.body}>{lesson.pictureActivity.mode === 'meaning' ? `Meaning prompt: ${pictureAnswer.meaning}` : `Picture description: ${pictureAnswer.pictureAlt}`}</Text>
      <Text style={s.eyebrow}>Accepted sentence answers</Text>{lesson.sentenceActivity.answers.map((answer, index) => <Text key={index} style={s.body}>{index + 1}. {answer}</Text>)}
      <Text style={s.eyebrow}>Answers marked “almost”</Text>{lesson.sentenceActivity.almostAnswers.length ? lesson.sentenceActivity.almostAnswers.map((answer, index) => <Text key={index} style={s.body}>{index + 1}. {answer}</Text>) : <Text style={s.body}>None defined.</Text>}
      <Text style={s.eyebrow}>Source and rights</Text><Text style={s.body}>{lesson.provenance.author}</Text><Text style={s.body}>{lesson.provenance.rights}</Text><Text style={s.body}>{lesson.provenance.review}</Text>
    </View>
  </View>;
}
