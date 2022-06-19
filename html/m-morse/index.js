var editor;
var cmOpts = {
    lineNumbers: true,
    lint: true,
    indentWithTabs: false,
    tabSize: 4,
    indentUnit: 4,
    theme: "solarized",
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
    extraKeys: {
        "Ctrl-Q": function(cm){
            cm.foldCode(cm.getCursor());
        },
        "Tab": function (cm) {
            cm.replaceSelection("    ", "end");
        }
    },
};

function refreshEditors() {
    if (editor != null) {
        editor.value(app.text);
    }
    
    if (app.folded) {
        // re-fold all
        CodeMirror.commands.foldAll(scriptEditor);
    } else {
    }
}

function enterEditor() {
    editor.codemirror.focus();
    app.editMode = true;
}

function leaveEditor() {
    // editor.codemirror.blur();
    editor.codemirror.display.input.blur();
    app.editMode = false;
}

function append(ch) {
    var pos = editor.codemirror.getCursor();
    editor.codemirror.setSelection(pos, pos);
    editor.codemirror.replaceSelection(ch);
}

function tapDown() {
    if (idleHandler != null) {
        clearInterval(idleHandler);
        idleHandler = null;
        app.idleStart = app.idleDuration = null;
    }
    
    down = true;
    app.holdStart = Date.now();
    app.holdKey = '.';
    app.holdDuration = 0;
    holdHandler = setInterval(function() {
        app.holdDuration = Date.now() - app.holdStart;
        if (app.holdDuration >= app.dashMin) {
            app.holdKey = '-';
        }
    }, checkInterval);
}

function tapUp() {
    if (holdHandler != null) {
        clearInterval(holdHandler);
        holdHandler = null;
    }
    if (down) {
        var duration = Date.now() - app.holdStart;
        app.holdDuration = duration;
        var newKey = '.';
        if (duration >= app.dashMin) {
            newKey = '-';
        }
        app.keys.push(newKey);
        
        app.idleStart = Date.now();
        app.idleDuration = 0;
        app.addSpace = false;
        idleHandler = setInterval(function () {
            app.idleDuration = Date.now() - app.idleStart;
            var nKey = app.keys.length;
            if (nKey) {
                if (app.idleDuration >= app.letterMin) {
                    var char = app.keyChar;
                    if (debug) return;
                    app.keys = [];
                    append(char);
                    return;
                }
            } else {
                if (app.idleDuration >= app.wordMin) {
                    var char = ' ';
                    if (debug) return;
                    append(char);
                    app.addSpace = true;
                    clearInterval(idleHandler);
                    app.idleStart = app.idleDuration = null;
                }
            }
        }, checkInterval);
    }
    down = false;
    app.holdStart = null;
    app.holdDuration = null;
    app.holdKey = null;
}

$(document).ready(function() {

    $(document.body).keydown(function (e) {
        var el = $(e.target);
        if (el.hasClass("editable")) return;
        if (el.is("input, select")) return;

        switch (e.keyCode) {
        case 10: // ENTER
        case 13:
            if (! app.editMode) {
                enterEditor();
                return false;
            }
            return;
            
        case 27: // ESC
            if (app.editMode) {
                leaveEditor();
                return false;
            }
            return;
            
        case 32: // SPC
        case 46: // DEL
            return;
        }
    });

    var mdText = $("#editor")[0];
    if (window.SimpleMDE != undefined) {
        editor = new SimpleMDE({
            element: mdText,
            
            autoDownloadFontAwesome: false, // already there.
            autofocus: true,
            blockStyles: {
                italic: '_'
            },
            initialValue: app.text,
        	insertTexts: {
        		horizontalRule: ["", "\n\n-----\n\n"],
        		image: ["![](http://", ")"],
        		link: ["[", "](http://)"],
        		table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
        	},
            placeholder: "支持 Markdown 哦！",
            renderingConfig: {
                codeSyntaxHighlighting: false,
            },
            spellChecker: false,
            tabSize: 4,
            //toolbarTips: false,
            
        });
        editor.codemirror.on("change", function() {
            app.text = editor.value();
        });
        editor.codemirror.on("focus", enterEditor);
        editor.codemirror.on("blur", leaveEditor);
    }

    // fullScreen();

    body = $('body');
    body.on('keydown', function (e, t) {
        if (event.repeat) return;
        if (app.editMode) return;
        if (e.key == '.') {
            app.lastEvent = e;
            tapDown();
        }
    });

    body.on('keyup', function (e, t) {
        tapUp();
    });

    setTimeout(leaveEditor, 100);
});
