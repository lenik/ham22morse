
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
        if (app.holdDuration >= app.speed.dash.value) {
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
        if (duration >= app.speed.dash.value) {
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
                if (app.idleDuration >= app.speed.letter.value) {
                    var char = app.keyChar;
                    if (app.debug) return;
                    app.keys = [];
                    append(char);
                    return;
                }
            } else {
                if (app.idleDuration >= app.speed.word.value) {
                    var char = ' ';
                    if (app.debug) return;
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
    
    var body = $('body');
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
    
});
