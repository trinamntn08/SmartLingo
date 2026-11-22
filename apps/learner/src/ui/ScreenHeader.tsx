import type { ReactNode } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { designTokens, styles as s } from './theme';

export function ScreenHeader({ title, eyebrow, subtitle, action }: {
  title: string; eyebrow?: string; subtitle?: string; action?: ReactNode;
}) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  return <View style={[s.row, { alignItems: 'center', justifyContent: 'space-between', gap: 14 }]}>
    <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : 340, minWidth: 0, gap: 6 }}>
      {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
      <Text accessibilityRole="header" style={[s.title, compact && s.compactTitle]}>{title}</Text>
      {subtitle && <Text style={[s.body, { maxWidth: 680 }]}>{subtitle}</Text>}
    </View>
    {action}
  </View>;
}
