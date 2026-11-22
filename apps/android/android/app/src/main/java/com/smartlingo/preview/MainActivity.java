package com.smartlingo.preview;

import android.os.Bundle;
import android.view.View;
import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LearningBackupPlugin.class);
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        // Keep the complete web UI inside bars/cutouts and above the keyboard on
        // every WebView version. SystemBars' CSS inset adapter is disabled.
        View content = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(content, (view, insets) -> {
            Insets safe = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            Insets keyboard = insets.getInsets(WindowInsetsCompat.Type.ime());
            view.setPadding(safe.left, safe.top, safe.right, Math.max(safe.bottom, keyboard.bottom));
            return WindowInsetsCompat.CONSUMED;
        });
        ViewCompat.requestApplyInsets(content);
    }
}
