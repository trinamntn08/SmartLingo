import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CurriculumEditor } from './src/editor/CurriculumEditor';
import { LearnerApp } from './src/app/LearnerApp';
import { WebNavigation, useNavigation } from './src/app/WebNavigation';
import { styles as s } from './src/ui/theme';

export default function App() {
  return <WebNavigation><Workspaces /></WebNavigation>;
}

function Workspaces() {
  const { route, navigate, backTo } = useNavigation();
  const editorOpen = route.kind === 'editor';
  const [editorVisited, setEditorVisited] = useState(editorOpen);
  useEffect(() => {
    if (editorOpen) setEditorVisited(true);
  }, [editorOpen]);
  return <View style={s.app}>
    {/* Keep both workspaces mounted after the first editor visit to preserve unsaved work. */}
    <View style={{ flex: 1, display: editorOpen ? 'none' : 'flex' }}><LearnerApp active={!editorOpen} onOpenEditor={() => navigate({ kind: 'editor' })} /></View>
    {(editorOpen || editorVisited) && <View style={{ flex: 1, display: editorOpen ? 'flex' : 'none' }}>
      <CurriculumEditor onExit={() => backTo({ kind: 'home' }, previous => previous.kind !== 'editor', true)} onHome={() => navigate({ kind: 'languages' })} />
    </View>}
  </View>;
}
