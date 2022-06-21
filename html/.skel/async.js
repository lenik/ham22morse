
function sleep(t, fn) {
    setTimeout(fn, t * 1000);
}

function slowly(fn, msg) {
    beginWait();
    var afterJob = function() {
        endWait();
    };
    //sleep(.5, function() {
    if (fn.length) {
        return fn(afterJob);
    } else {
        var ret = fn();
        afterJob();
        return ret;
    }
    //});
}

function beginWait(msg) {
    if (msg == null)
        msg = "Wait...";
    $("#waitbox .text").text(msg);
    $("#waitbox").show();
}

function endWait() {
    $("#waitbox").hide();
}
