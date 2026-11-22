package com.smartlingo.preview;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** A single user-selected JSON document; no directory or storage permission. */
@CapacitorPlugin(name = "LearningBackup")
public class LearningBackupPlugin extends Plugin {
    private static final int MAX_BYTES = 5_000_000;
    private volatile boolean savePending = false;
    private volatile byte[] pendingContents;

    @PluginMethod
    public synchronized void save(PluginCall call) {
        String filename = call.getString("filename");
        String contents = call.getString("contents");
        // Capacitor serializes activity-call options into savedInstanceState.
        // Keep private backup bytes in memory, never in the Android Binder bundle.
        call.getData().remove("contents");
        if (filename == null || !filename.matches("[A-Za-z0-9][A-Za-z0-9._-]{0,119}\\.json")) {
            call.reject("Choose a valid JSON backup filename.");
            return;
        }
        if (contents == null || contents.isEmpty() || contents.length() > MAX_BYTES) {
            call.reject("Backup must contain at most 5,000,000 bytes of UTF-8 JSON.");
            return;
        }
        byte[] encoded = contents.getBytes(StandardCharsets.UTF_8);
        if (encoded.length > MAX_BYTES) {
            call.reject("Backup must contain at most 5,000,000 bytes of UTF-8 JSON.");
            return;
        }
        if (savePending) {
            call.reject("A backup save is already open.");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        pendingContents = encoded;
        savePending = true;
        try {
            startActivityForResult(call, intent, "documentSelected");
        } catch (RuntimeException error) {
            clearPending();
            call.reject("The Android document picker could not open.");
        }
    }

    @ActivityCallback
    private void documentSelected(PluginCall call, ActivityResult result) {
        if (call == null) {
            clearPending();
            return;
        }
        Intent data = result.getData();
        Uri uri = data == null ? null : data.getData();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            clearPending();
            call.reject("Backup save cancelled.");
            return;
        }
        getBridge().execute(() -> writeDocument(call, uri));
    }

    private void writeDocument(PluginCall call, Uri uri) {
        byte[] contents = pendingContents;
        if (contents == null) {
            clearPending();
            call.reject("The app restarted while saving. Export your backup again.");
            return;
        }
        try (OutputStream output = getContext().getContentResolver().openOutputStream(uri, "wt")) {
            if (output == null) throw new java.io.IOException("No document stream");
            output.write(contents);
            output.flush();
            // Closing can fail too: acknowledge only after try-with-resources.
        } catch (Exception error) {
            clearPending();
            call.reject("Backup could not be saved. Choose another location and retry.");
            return;
        }
        clearPending();
        JSObject saved = new JSObject();
        saved.put("saved", true);
        call.resolve(saved);
    }

    private void clearPending() {
        pendingContents = null;
        savePending = false;
    }

    @Override
    protected void handleOnDestroy() {
        clearPending();
    }
}
