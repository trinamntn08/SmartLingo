import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';
import { accessState, clearAccessTokens, setAccessToken } from './access';
import { deployment } from './config';

export function OnlineAccessPanel() {
  const config = deployment();
  const [beta, setBeta] = useState('');
  const [owner, setOwner] = useState('');
  const [state, setState] = useState(accessState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  if (!config.hosted) return null;
  function save(role: 'beta' | 'owner') {
    setMessage(''); setError('');
    try {
      setAccessToken(role, role === 'beta' ? beta : owner);
      if (role === 'beta') setBeta(''); else setOwner('');
      setState(accessState());
      setMessage('Access token applied for this visit. Refresh availability in Practice or Neural French audio, or retry loading lessons in the curriculum editor.');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Access token could not be applied.'); }
  }
  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Online beta services</Text>
    {!config.apiUrl ? <Text style={s.body}>Online services will be available when the website owner connects a server. All bundled lessons, notebook, review, device voices and learning backups are available without it.</Text> : <>
      <Text style={s.body}>Optional AI and neural audio need a beta access token from the site owner. Curriculum editing needs the separate owner token.</Text>
      <Text style={s.muted}>Tokens remain in this tab's memory until you clear access or reload. Never enter OpenAI or Azure provider keys here.</Text>
      <Text style={s.body}>Beta access: {state.beta ? 'token applied' : 'not entered'}. Owner access: {state.owner ? 'token applied' : 'not entered'}.</Text>
      <TextInput accessibilityLabel="Beta access token" placeholder="Beta access token" secureTextEntry maxLength={512} autoComplete="off" autoCorrect={false} autoCapitalize="none" value={beta} onChangeText={setBeta} style={s.input} />
      <Button disabled={!beta.trim()} onPress={() => save('beta')}>Apply beta access</Button>
      <TextInput accessibilityLabel="Owner access token" placeholder="Owner access token" secureTextEntry maxLength={512} autoComplete="off" autoCorrect={false} autoCapitalize="none" value={owner} onChangeText={setOwner} style={s.input} />
      <Button disabled={!owner.trim()} onPress={() => save('owner')}>Apply owner access</Button>
      <Button onPress={() => { clearAccessTokens(); setBeta(''); setOwner(''); setState(accessState()); setError(''); setMessage('Access cleared from this tab. Learning data and saved audio are preserved.'); }}>Clear online access</Button>
      {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}
      {!!error && <Text accessibilityRole="alert" style={s.body}>{error}</Text>}
    </>}
  </View>;
}
