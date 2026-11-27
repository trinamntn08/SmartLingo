import { StyleSheet, Text, View } from 'react-native';
import { Button } from './controls';
import { colors, designTokens, styles as s } from './theme';

interface StudyLaunchCardProps {
  title: string;
  context?: string;
  status?: string;
  action: { label: string; href: string; onOpen: () => void; disabled: boolean };
  featured?: boolean;
  largeTitle?: boolean;
  testID?: string;
}

export function StudyLaunchCard({ title, context, status, action, featured, largeTitle, testID }: StudyLaunchCardProps) {
  return <View testID={testID} style={[s.card, launch.container, featured && launch.featured]}>
    {context && <Text style={launch.context}>{context}</Text>}
    <Text accessibilityRole="header" aria-level={2} style={[s.heading, largeTitle && launch.largeTitle]}>{title}</Text>
    {status && <Text accessibilityLiveRegion="polite" style={s.muted}>{status}</Text>}
    <View style={s.row}>
      <Button primary={featured} quiet={!featured} href={action.href} disabled={action.disabled} onPress={action.onOpen}>
        {action.label}
      </Button>
    </View>
  </View>;
}

const launch = StyleSheet.create({
  container: { padding: 16, gap: 12, borderWidth: 0, minWidth: 0 },
  featured: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.sageTint },
  largeTitle: { fontSize: 34, lineHeight: 40 },
  context: { ...designTokens.typography.smallLabel, color: colors.primary, fontWeight: '700' },
});
