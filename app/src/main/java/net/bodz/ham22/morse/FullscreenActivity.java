package net.bodz.ham22.morse;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FullscreenActivity extends AppCompatActivity {

    static final int FILE_CHOOSE_RESULT_CODE = 10;

    WebView mWebView;
    MyWebViewClient webViewClient;
    MyWebChromeClient webChromeClient;

    MorseProject project;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }

        setContentView(R.layout.activity_fullscreen);

        View mControlsView = findViewById(R.id.fullscreen_content_controls);
        mControlsView.setVisibility(View.GONE);

        mWebView = (WebView) findViewById(R.id.web_view);

        findViewById(R.id.quit_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ActivityCompat.finishAffinity(FullscreenActivity.this);
            }
        });

        initWebView();
    }

    ///////////////////////////////////////////////////////////////////////////

    void initWebView() {
        WebView.setWebContentsDebuggingEnabled(true);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
//        settings.setBuiltInZoomControls(true);
//        settings.setLoadWithOverviewMode(true);
//        settings.setUseWideViewPort(true); // enable viewport meta-tag.
        settings.setAppCacheEnabled(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);

//        mWebView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
//        mWebView.setScrollbarFadingEnabled(false); // keep on

        mWebView.addJavascriptInterface(new AndroidNatives(this), "android");
        mWebView.addJavascriptInterface(new MorseProject(this), "project");
        mWebView.addJavascriptInterface(this, "activity");

        webViewClient = new MyWebViewClient();
        webChromeClient = new MyWebChromeClient(this, FILE_CHOOSE_RESULT_CODE);
        mWebView.setWebViewClient(webViewClient);
        mWebView.setWebChromeClient(webChromeClient);

        mWebView.loadUrl("file:///android_asset/html/m-morse/index.html");

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case FILE_CHOOSE_RESULT_CODE:
                if (webChromeClient.filePathCallback != null) {
                    Uri result = null;
                    if (resultCode == RESULT_OK) {
                        result = data == null ? webChromeClient.imageUri : data.getData();
                        Log.i("ME", "Uri = " + result);
                    }
                    Uri[] uris = {};
                    if (result != null) uris = new Uri[]{result};
                    webChromeClient.filePathCallback.onReceiveValue(uris);
                }
                break;

            default:
                super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack())
            mWebView.goBack();
        else
            super.onBackPressed();
    }

    @JavascriptInterface
    public void exit() {
        ActivityCompat.finishAffinity(FullscreenActivity.this);
    }

}
