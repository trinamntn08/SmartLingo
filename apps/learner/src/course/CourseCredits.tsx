import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import type { OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

export function CourseCredits({ course }: { course: OpenCourse }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const hasSources = course.sources.length > 0;
  if (!hasSources && (course.language === 'fr-FR' || !course.provenance)) return null;
  async function follow(url: string) {
    setError('');
    try { await Linking.openURL(url); } catch { setError('The external link could not be opened. All course study material is available here.'); }
  }
  return <View style={{ gap: 12, minWidth: 0, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#DCE3DB' }}>
    <Button expanded={open} onPress={() => setOpen(value => !value)}>{hasSources
      ? (open ? 'Hide source credits' : 'Source credits and licence')
      : (open ? 'Hide authorship' : 'Authorship and review')}</Button>
    {open && <View testID="course-source-credits" style={s.notice}>
      <Text accessibilityRole="header" style={s.heading}>{hasSources ? 'Source credits' : 'Authorship and review'}</Text>
      {hasSources && <Text style={s.muted}>All study material is included here. These optional links open the original source and licence.</Text>}
      {!!course.provenance && <View style={{ gap: 8 }}>
        <Text style={s.body}>Author: {course.provenance.author}</Text>
        <Text style={s.body}>Rights: {course.provenance.rights}</Text>
        <Text style={s.muted}>Review: {course.provenance.review}</Text>
      </View>}
      {course.sources.map(source => <View key={source.id} style={{ gap: 8 }}>
        <Text style={s.body}>{source.title}</Text>
        <Text style={s.body}>Creator: {source.creator}</Text>
        <Text style={s.muted}>{source.copyrightNotice}</Text>
        <Button onPress={() => void follow(source.sourceUrl)}>Open original source</Button>
        <Button onPress={() => void follow(source.licenseUrl)}>Creative Commons Attribution 4.0 (CC BY 4.0)</Button>
        <Text style={s.muted}>Retrieved: {source.retrievedOn}</Text>
        <Text style={s.body}>Adaptation scope: {source.scope}</Text>
        <Text style={s.body}>Changes: {source.changes}</Text>
        <Text style={s.body}>Excluded from this adaptation:</Text>
        {source.excludedAssets.map(asset => <Text key={asset} style={s.muted}>• {asset}</Text>)}
      </View>)}
      {!!error && <Text accessibilityRole="alert" style={s.muted}>{error}</Text>}
    </View>}
  </View>;
}
