import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { audio } from './src/audio';
import { CurriculumEditor } from './src/editor/CurriculumEditor';
import { LearnerApp } from './src/app/LearnerApp';
import { setEditorHash } from './src/app/learnerHistory';
import { styles as s } from './src/ui/theme';

export default function App() {
  const [editorOpen, setEditorOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#editor');
  const [editorVisited, setEditorVisited] = useState(editorOpen);
  const [homeRequest, setHomeRequest] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateRoute = () => {
      const open = window.location.hash === '#editor';
      audio.stop();
      setEditorOpen(open);
      if (open) setEditorVisited(true);
    };
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);
  function showEditor(open: boolean) {
    audio.stop();
    if (open) setEditorVisited(true);
    setEditorOpen(open);
    setEditorHash(open);
  }
  function goHome() { showEditor(false); setHomeRequest(current => current + 1); }
  return <View style={s.app}>
    {/* Keep both workspaces mounted after the first editor visit to preserve unsaved work. */}
    <View style={{ flex: 1, display: editorOpen ? 'none' : 'flex' }}><LearnerApp active={!editorOpen} onOpenEditor={() => showEditor(true)} homeRequest={homeRequest} /></View>
    {editorVisited && <View style={{ flex: 1, display: editorOpen ? 'flex' : 'none' }}><CurriculumEditor onExit={() => showEditor(false)} onHome={goHome} /></View>}
  </View>;
}
