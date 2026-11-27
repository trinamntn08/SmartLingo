package com.smartlingo.preview;

import android.media.AudioAttributes;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.Consumer;

/** Device speech for the bundled learner. All engine and call state stays on the main thread. */
@CapacitorPlugin(name = "DeviceSpeech")
public class DeviceSpeechPlugin extends Plugin {
    private static final long INIT_TIMEOUT_MS = 5_000;
    private static final long PLAYBACK_TIMEOUT_MS = 30_000;
    private static final String UNAVAILABLE =
        "Android text-to-speech is unavailable. Check your phone's Text-to-speech output settings.";
    private static final String PLAYBACK_ERROR =
        "Android could not play this voice. Try a device voice in Profile → Audio & pronunciation.";

    private final Handler main = new Handler(Looper.getMainLooper());
    private final List<Consumer<Boolean>> waiting = new ArrayList<>();
    private TextToSpeech engine;
    private boolean ready;
    private boolean destroyed;
    private Runnable initTimeout;
    private PluginCall playback;
    private String utteranceId;
    private long sequence;
    private Runnable playbackTimeout;

    @PluginMethod
    public void getVoices(PluginCall call) {
        Locale locale = targetLocale(call);
        if (locale == null) {
            call.reject("Choose French or Japanese.");
            return;
        }
        main.post(() -> withEngine(available -> {
            if (!available) {
                call.reject(UNAVAILABLE);
                return;
            }
            JSArray result = new JSArray();
            try {
                Voice defaultVoice = engine.getDefaultVoice();
                for (Voice voice : voicesFor(locale)) {
                    JSObject item = new JSObject();
                    item.put("voiceURI", "android:" + voice.getName());
                    item.put("name", voice.getName());
                    item.put("lang", voice.getLocale().toLanguageTag());
                    item.put("localService", !voice.isNetworkConnectionRequired());
                    item.put("default", voice.equals(defaultVoice));
                    result.put(item);
                }
            } catch (RuntimeException error) {
                call.reject(UNAVAILABLE);
                return;
            }
            JSObject response = new JSObject();
            response.put("voices", result);
            call.resolve(response);
        }));
    }

    @PluginMethod
    public void speak(PluginCall call) {
        Locale locale = targetLocale(call);
        String text = call.getString("text");
        Double rate = call.getDouble("rate");
        if (locale == null || text == null || text.trim().isEmpty()
            || text.length() > TextToSpeech.getMaxSpeechInputLength()
            || rate == null || !(rate == 0.7 || rate == 0.85 || rate == 1.0)) {
            call.reject("Invalid Android speech request.");
            return;
        }

        main.post(() -> {
            stopPlayback();
            playback = call;
            utteranceId = Long.toString(++sequence);
            String id = utteranceId;
            withEngine(available -> {
                if (!id.equals(utteranceId)) return;
                if (available) startPlayback(id, locale, text, rate.floatValue(), call.getString("voiceName", ""));
                else finishPlayback(id, UNAVAILABLE);
            });
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        main.post(() -> {
            stopPlayback();
            call.resolve();
        });
    }

    private static Locale targetLocale(PluginCall call) {
        String language = call.getString("language", "");
        if ("fr-FR".equals(language)) return Locale.FRANCE;
        if ("ja-JP".equals(language)) return Locale.JAPAN;
        return null;
    }

    private void withEngine(Consumer<Boolean> action) {
        if (ready || destroyed) {
            action.accept(ready);
            return;
        }
        waiting.add(action);
        if (initTimeout != null) return;
        Runnable timeout = () -> completeInitialization(false);
        initTimeout = timeout;
        main.postDelayed(timeout, INIT_TIMEOUT_MS);
        try {
            engine = new TextToSpeech(getContext().getApplicationContext(), status -> main.post(() -> {
                if (initTimeout == timeout) completeInitialization(status == TextToSpeech.SUCCESS);
            }));
        } catch (RuntimeException error) {
            completeInitialization(false);
        }
    }

    private void completeInitialization(boolean initialized) {
        main.removeCallbacks(initTimeout);
        initTimeout = null;
        if (initialized) {
            try {
                ready = engine.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) {}
                    @Override public void onDone(String id) { main.post(() -> finishPlayback(id, null)); }
                    @Override public void onError(String id) { main.post(() -> finishPlayback(id, PLAYBACK_ERROR)); }
                    @Override public void onStop(String id, boolean interrupted) { main.post(() -> finishPlayback(id, null)); }
                }) == TextToSpeech.SUCCESS;
                engine.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build());
            } catch (RuntimeException error) {
                ready = false;
            }
        }
        if (!ready) closeEngine();
        List<Consumer<Boolean>> pending = new ArrayList<>(waiting);
        waiting.clear();
        for (Consumer<Boolean> action : pending) action.accept(ready);
    }

    private List<Voice> voicesFor(Locale locale) {
        List<Voice> matches = new ArrayList<>();
        Set<Voice> voices = engine.getVoices();
        if (voices == null) return matches;
        for (Voice voice : voices) {
            Set<String> features = voice.getFeatures();
            if (locale.getLanguage().equals(voice.getLocale().getLanguage())
                && (features == null || !features.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED))) {
                matches.add(voice);
            }
        }
        matches.sort(Comparator.comparing(Voice::isNetworkConnectionRequired)
            .thenComparing(voice -> !locale.toLanguageTag().equals(voice.getLocale().toLanguageTag()))
            .thenComparing(Voice::getName));
        return matches;
    }

    private void startPlayback(String id, Locale locale, String text, float rate, String preferred) {
        try {
            List<Voice> options = voicesFor(locale);
            if (options.isEmpty()) {
                String language = locale.getDisplayLanguage(Locale.ENGLISH);
                finishPlayback(id, "No " + language + " voice is available. In Android Settings, find "
                    + "Text-to-speech output and install " + language + " voice data, then retry.");
                return;
            }
            Voice voice = options.stream().filter(option -> option.getName().equals(preferred))
                .findFirst().orElse(options.get(0));
            if (engine.setVoice(voice) != TextToSpeech.SUCCESS
                || engine.setSpeechRate(rate) != TextToSpeech.SUCCESS
                || engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, id) != TextToSpeech.SUCCESS) {
                finishPlayback(id, PLAYBACK_ERROR);
                return;
            }
            playbackTimeout = () -> {
                finishPlayback(id, PLAYBACK_ERROR);
                stopEngine();
            };
            main.postDelayed(playbackTimeout, PLAYBACK_TIMEOUT_MS);
        } catch (RuntimeException error) {
            finishPlayback(id, PLAYBACK_ERROR);
        }
    }

    private void finishPlayback(String id, String error) {
        if (playback == null || !utteranceId.equals(id)) return;
        if (playbackTimeout != null) main.removeCallbacks(playbackTimeout);
        playbackTimeout = null;
        PluginCall call = playback;
        playback = null;
        utteranceId = null;
        if (error == null) call.resolve();
        else call.reject(error);
    }

    private void stopPlayback() {
        if (playback == null) return;
        finishPlayback(utteranceId, null);
        stopEngine();
    }

    private void stopEngine() {
        if (!ready) return;
        try { engine.stop(); } catch (RuntimeException error) { /* Engine may have disconnected. */ }
    }

    private void closeEngine() {
        if (engine == null) return;
        try { engine.shutdown(); } catch (RuntimeException error) { /* Engine may have disconnected. */ }
        engine = null;
        ready = false;
    }

    @Override
    protected void handleOnPause() {
        stopPlayback();
    }

    @Override
    protected void handleOnDestroy() {
        destroyed = true;
        stopPlayback();
        if (initTimeout != null) completeInitialization(false);
        closeEngine();
    }
}
