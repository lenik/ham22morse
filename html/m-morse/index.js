$(document).ready(function() {

    $(document.body).keydown(function (e) {
        var el = $(e.target);
        if (el.hasClass("editable")) return;
        if (el.is("input, select")) return;

        switch (e.key) {
        case 'Enter': // ENTER
            if (! app.editMode) {
                enterEditor();
                return false;
            }
            return;
            
        case 'Escape': // ESC
            if (app.editMode) {
                leaveEditor();
                return false;
            }
            return;
            
        case 'F1':
            app.showHelp = ! app.showHelp;
            return false;
            
        case 'F2':
            app.showKey = ! app.showKey;
            return false;
            
        case 'F12':
            app.debug = ! app.debug;
            return false;
        }
    });

    setTimeout(leaveEditor, 100);

});
