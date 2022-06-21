var editor;

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

$(document).ready(function() {

    var mdText = $("#editor")[0];
    if (window.SimpleMDE != undefined) {
        editor = new SimpleMDE({
            element: mdText,
            
            autoDownloadFontAwesome: false, // already there.
            autofocus: true,
            blockStyles: {
                italic: '_'
            },
            hideIcons: [ 'fullscreen', 'guide' ],
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

});
