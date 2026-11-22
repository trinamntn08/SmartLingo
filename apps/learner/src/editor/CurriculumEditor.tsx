import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { lessonSchema, matchesLesson, type Lesson, type LessonPreview } from '@smartlingo/domain';
import { localContentApi } from '../content/api';
import { audio } from '../audio';
import { Badge, Button } from '../ui/controls';
import { BrandHome } from '../ui/BrandHome';
import { LessonScreen } from '../ui/LessonScreen';
import { colors, styles as s } from '../ui/theme';
import { DraftFields } from './DraftFields';
import { usePreviewLearning } from './usePreviewLearning';

type Navigation = { kind: 'select'; lesson: Lesson } | { kind: 'reload' };
const editableDraft = (lesson: Lesson): Lesson => ({ ...lesson, status: 'draft' });

export function CurriculumEditor({ onExit, onHome }: { onExit: () => void; onHome: () => void }) {
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [reviewFocused, setReviewFocused] = useState(false);
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const inFlight = useRef(false);
  const { width } = useWindowDimensions();
  const wide = width >= 1050;
  const dirty = !!draft && !!saved && (JSON.stringify(draft) !== JSON.stringify(editableDraft(saved)) || durationText !== String(saved.durationMinutes));

  function resetReview() { setPreview(null); setPreviewOpen(false); setReviewed(false); }
  function select(lesson: Lesson) {
    setSaved(lesson); setDraft(editableDraft(lesson)); setDurationText(String(lesson.durationMinutes)); resetReview(); setMessage(''); setError(''); setValidationError(false); setConflict(false); setNavigation(null);
    scroll.current?.scrollTo({ y: 0, animated: false });
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
      const selected = lessons.find(lesson => lesson.id === selectedId) ?? lessons[0];
      if (selected) select(selected); else { setSaved(null); setDraft(null); resetReview(); }
    } catch (failure) { report(failure); }
    finally { inFlight.current = false; setLoading(false); }
  }
  useEffect(() => { void loadLatest(); }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const resetOnLeave = () => {
      if (window.location.hash !== '#editor') { audio.stop(); setPreview(null); setPreviewOpen(false); setReviewed(false); }
    };
    window.addEventListener('hashchange', resetOnLeave);
    return () => window.removeEventListener('hashchange', resetOnLeave);
  }, []);

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
    inFlight.current = true; setBusy(true); setError(''); setMessage(''); resetReview();
    try {
      const lesson = await localContentApi.saveDraft(parsed.data, saved.revision);
      setSaved(lesson); setDraft(editableDraft(lesson)); setDurationText(String(lesson.durationMinutes)); setCatalogue(current => current.map(item => item.id === lesson.id ? lesson : item));
      setConflict(false); setMessage(`Draft revision ${lesson.revision} saved locally. Preview this revision before publishing.`);
      return true;
    } catch (failure) { report(failure); return false; }
    finally { inFlight.current = false; setBusy(false); }
  }
  async function previewDraft() {
    if (!saved || dirty || saved.status !== 'draft' || inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(''); setReviewed(false); setPreview(null);
    try { const result = await localContentApi.previewDraft(saved.id, saved.revision); setPreview(result); setPreviewOpen(true); setMessage('Saved-revision preview opened. Practice here is temporary and separate from learner history.'); }
    catch (failure) { report(failure); }
    finally { inFlight.current = false; setBusy(false); }
  }
  async function publishDraft() {
    if (!saved || !preview || !reviewed || dirty || inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(''); setMessage('');
    try {
      const published = await localContentApi.publishDraft(saved.id, saved.revision, preview.previewToken);
      setSaved(published); setDraft(editableDraft(published)); setDurationText(String(published.durationMinutes)); setCatalogue(current => current.map(item => item.id === published.id ? published : item));
      resetReview(); setConflict(false); setMessage(`Published revision ${published.revision} to the local catalogue. Return to learning, open Profile, and load published lessons to use it.`);
      scroll.current?.scrollTo({ y: 0, animated: false });
    } catch (failure) { resetReview(); report(failure); }
    finally { inFlight.current = false; setBusy(false); }
  }
  function requestNavigation(next: Navigation) {
    if (dirty) { setNavigation(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
    else if (next.kind === 'select') select(next.lesson); else void loadLatest(saved?.id);
  }
  function discardAndNavigate() {
    const next = navigation;
    setNavigation(null);
    if (next?.kind === 'select') select(next.lesson);
    else if (next?.kind === 'reload') void loadLatest(saved?.id);
  }
  async function saveAndNavigate() {
    const next = navigation;
    if (await saveDraft()) {
      setNavigation(null);
      if (next?.kind === 'select') select(next.lesson);
      else if (next?.kind === 'reload') void loadLatest(saved?.id);
    }
  }
  return <View style={s.app}>
    <View style={[s.header, width < 600 && { paddingHorizontal: 16 }]}><View style={s.headerInner}><View style={[s.row, { maxWidth: '100%' }]}><BrandHome onPress={() => { audio.stop(); resetReview(); onHome(); }} /><Badge>LOCAL EDITOR</Badge></View><Button onPress={() => { audio.stop(); resetReview(); onExit(); }}>← Return to learning</Button></View></View>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled"><View style={[s.main, { maxWidth: 1440 }, width < 600 && { padding: 16, paddingTop: 24 }]}>
      <View style={{ gap: 10 }}><Text style={s.eyebrow}>French curriculum workshop</Text><Text accessibilityRole="header" style={s.title}>Draft. Try. Review.</Text>
        <Text style={[s.body, { maxWidth: 760 }]}>A quiet workspace for shaping practical French lessons. Save a draft, try its saved revision, then approve publication.</Text>
      </View>
      {!!navigation && <View style={s.notice}><Text style={s.heading}>Keep your unsaved edits?</Text><Text style={s.body}>Save this draft first, discard the form to continue, or keep editing. Reloading latest will not merge your text.</Text><View style={s.row}>
        {navigation.kind === 'select' && <Button primary disabled={busy || loading} onPress={() => void saveAndNavigate()}>Save draft and switch</Button>}
        <Button disabled={busy || loading} onPress={discardAndNavigate}>Discard edits and continue</Button><Button disabled={busy} onPress={() => setNavigation(null)}>Keep editing</Button>
      </View></View>}
      {!!error && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>The editor request didn’t complete.</Text><Text style={s.body}>{error}</Text>
        {conflict ? <><Text style={s.body}>A newer revision may exist. Your form is still here. Reload latest explicitly before saving again; nothing is merged or retried automatically.</Text><Button disabled={busy || loading} onPress={() => requestNavigation({ kind: 'reload' })}>Reload latest revision</Button></>
          : validationError ? <Text style={s.body}>Correct the form, then save again. No revision has been sent.</Text>
            : <><Text style={s.body}>For local editing, start the API with npm run dev:api, then retry your action. Learner lessons still work without it.</Text>{!saved && <Button disabled={loading} onPress={() => void loadLatest()}>Retry loading lessons</Button>}</>}
      </View>}
      {!!message && <View style={[s.notice, { backgroundColor: colors.green }]}><Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text></View>}
      {loading ? <View style={s.card}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Loading local curriculum…</Text></View> : <>
        {!catalogue.length && !error && <View style={s.card}><Text style={s.heading}>No local lessons yet.</Text><Text style={s.body}>The first editor updates existing curriculum. Start the local API with its bundled lesson seeds.</Text><Button onPress={() => void loadLatest()}>Reload catalogue</Button></View>}
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 28, alignItems: 'flex-start', minWidth: 0 }}>
        {!!catalogue.length && <View style={{ width: wide ? 270 : '100%', flexShrink: 0, gap: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, padding: 18, borderRadius: 18 }}>
          <View style={[s.row, { justifyContent: 'space-between' }]}><Text style={s.heading}>Lesson catalogue</Text><Badge>{catalogue.length}</Badge></View>
          <TextInput accessibilityLabel="Search curriculum" placeholder="Find a topic or lesson" value={search} onChangeText={setSearch} style={s.input} />
          {!wide && <Button expanded={catalogueOpen || !!search} onPress={() => setCatalogueOpen(value => !value)}>{catalogueOpen ? 'Hide lesson catalogue' : 'Browse lesson catalogue'}</Button>}
          {(wide || catalogueOpen || !!search) && <ScrollView style={{ maxHeight: wide ? 660 : 260 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            <View style={{ gap: 8 }}>{catalogue.filter(lesson => matchesLesson(lesson, search)).map(lesson =>
              <CatalogueLesson key={lesson.id} lesson={lesson} selected={saved?.id === lesson.id} disabled={busy || saved?.id === lesson.id}
                onPress={() => requestNavigation({ kind: 'select', lesson })} />)}</View>
          </ScrollView>
          }
          {!catalogue.some(lesson => matchesLesson(lesson, search)) && <Text style={s.muted}>No matching lessons.</Text>}
          <Text style={s.muted}>French · Local curriculum</Text>
        </View>}
        {saved && draft && <View style={{ flex: wide ? 1 : undefined, width: wide ? undefined : '100%', minWidth: 0, gap: 22 }}>
          <View style={[s.card, { gap: 18, padding: width < 600 ? 18 : 24 }]}><View style={s.row}><Badge>{saved.status} · revision {saved.revision}</Badge><Badge>{dirty ? 'Unsaved changes' : 'Form matches saved revision'}</Badge></View><Text style={s.heading}>{saved.title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[
              ['01', 'Edit draft', !previewOpen], ['02', 'Try saved revision', previewOpen], ['03', 'Review & publish', reviewed],
            ].map(([number, title, active]) => <View key={String(number)} style={{ flexGrow: 1, flexBasis: 150, padding: 14, borderRadius: 12, backgroundColor: active ? colors.green : colors.paper, gap: 6 }}><Text style={s.eyebrow}>{number}</Text><Text style={s.body}>{title}</Text></View>)}</View>
            <View style={s.row}><Button primary disabled={busy || conflict || (!dirty && saved.status === 'draft')} onPress={() => void saveDraft()}>{busy ? 'Working…' : saved.status === 'published' ? 'Save new draft revision' : 'Save draft revision'}</Button>
              <Button disabled={busy || conflict || dirty || saved.status !== 'draft'} onPress={() => void previewDraft()}>Preview saved revision</Button>
              <Button disabled={busy} onPress={() => requestNavigation({ kind: 'reload' })}>Reload latest revision</Button>
              {preview && <Button disabled={busy} onPress={() => { audio.stop(); resetReview(); }}>Back to draft fields</Button>}
            </View>{dirty && <Text style={s.muted}>Save your changes before previewing. Editing clears the previous preview receipt and review approval.</Text>}
          </View>
          {previewOpen && preview ? <SavedPreview key={`${preview.lesson.id}.${preview.lesson.revision}.${preview.previewToken}`} preview={preview} onClose={() => { audio.stop(); resetReview(); }} /> : <DraftFields draft={draft} onChange={change} disabled={busy} durationText={durationText} onDurationChange={changeDuration} />}
          <View style={[s.card, { borderTopWidth: 4, borderTopColor: colors.yellow }]}><Text style={s.eyebrow}>03 · Explicit publication</Text><Text accessibilityRole="header" style={s.heading}>Publication review</Text><Text style={s.body}>Check the French and English for naturalness and accuracy, the accepted exercise answers, picture meaning, level, and media rights. Device speech is synthetic and has not been reviewed.</Text>
            <Text style={s.muted}>{saved.provenance.rights}</Text><Text style={s.muted}>{preview && !dirty ? `Preview receipt: revision ${preview.lesson.revision}. Valid for up to 15 minutes.` : 'Save and preview the current draft to enable review and publication.'}</Text>
            <Pressable accessibilityRole="checkbox" aria-checked={reviewed} aria-disabled={busy || !preview || dirty} accessibilityState={{ checked: reviewed, disabled: busy || !preview || dirty }} disabled={busy || !preview || dirty} onFocus={() => setReviewFocused(true)} onBlur={() => setReviewFocused(false)} onPress={() => setReviewed(!reviewed)} style={({ pressed }) => [s.notice, { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: reviewed ? colors.green : colors.sand, borderWidth: 2, borderColor: reviewFocused ? '#246944' : 'transparent', opacity: pressed ? 0.7 : 1 }]}>
              <Text style={s.heading}>{reviewed ? '☑' : '☐'}</Text><Text style={[s.body, { flex: 1 }]}>I have reviewed this saved revision for language, answers, suitability, and rights, and approve its local publication.</Text>
            </Pressable>
            <Button primary disabled={busy || conflict || !preview || !reviewed || dirty} onPress={() => void publishDraft()}>Publish reviewed revision</Button><Text style={s.muted}>Publication creates a new local revision. Earlier content and learner history are retained.</Text>
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
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={({ pressed }) => ({ padding: 14, gap: 6, borderRadius: 12,
      borderWidth: 1, borderColor: selected ? colors.ink : colors.line, backgroundColor: selected ? colors.green : colors.card,
      opacity: pressed ? 0.75 : 1, ...(focused ? { outlineColor: colors.ink, outlineWidth: 3, outlineStyle: 'solid', outlineOffset: 2 } : {}) })}>
    <Text style={s.eyebrow}>{lesson.topic}</Text><Text style={s.body}>{lesson.subtitle}</Text>
    <Text style={s.muted}>{lesson.level === 'foundation' ? 'Foundations' : lesson.level} · {lesson.status} · r{lesson.revision}</Text>
  </Pressable>;
}

function SavedPreview({ preview, onClose }: { preview: LessonPreview; onClose: () => void }) {
  const model = usePreviewLearning();
  const lesson = preview.lesson;
  const pictureAnswer = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  return <View style={{ gap: 20 }}><View style={[s.notice, { backgroundColor: colors.yellow }]}><Text style={s.heading}>Saved revision {lesson.revision} · temporary practice</Text><Text style={s.body}>This is the real lesson interface. Attempts, word saves, and completion here exist only in this preview and do not touch your learner notebook or progress.</Text></View><LessonScreen lesson={lesson} model={model} onExit={onClose} />
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
