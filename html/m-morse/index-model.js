const debug = false;
const checkInterval = 10;

const dashMin = 200;
const letterMin = 200;
const wordMin = 700;

var down = false;
var holdHandler;
var idleHandler;

$(document).ready(function() {

    appModel = {
        version: '1.0',
        keys: [],
        lastEvent: {
            code: 'N/A'
        },
        
        holdStart: null,
        holdKey: null,
        holdDuration: null,
        
        idleStart: null,
        idleDuration: null,
        
        init: function(s) {
        }
    };

    app = new Vue({
        el: "#body",
        data: appModel,
        computed: {
            keyBin: function() {
                var bin = 1;
                for (var i = 0; i < this.keys.length; i++) {
                    var dash = this.keys[i] == '-' ? 1 : 0;
                    bin = bin * 2 + dash;
                }
                return bin;
            },
            keyChar: function() {
                var bin = this.keyBin;
                switch (bin) {
                    case 0b101: return 'A';
                    case 0b11000: return 'B';
                    case 0b11010: return 'C';
                    case 0b1100: return 'D';
                    case 0b10: return 'E';
                    case 0b10010: return 'F';
                    case 0b1110: return 'G';
                    case 0b10000: return 'H';
                    case 0b100: return 'I';
                    case 0b10111: return 'J';
                    case 0b1101: return 'K';
                    case 0b10100: return 'L';
                    case 0b111: return 'M';
                    case 0b110: return 'N';
                    case 0b1111: return 'O';
                    case 0b10110: return 'P';
                    case 0b11101: return 'Q';
                    case 0b1010: return 'R';
                    case 0b1000: return 'S';
                    case 0b11: return 'T';
                    case 0b1001: return 'U';
                    case 0b10001: return 'V';
                    case 0b1011: return 'W';
                    case 0b11001: return 'X';
                    case 0b11011: return 'Y';
                    case 0b11100: return 'Z';
                    case 0b101111: return '0';
                    case 0b100111: return '1';
                    case 0b100011: return '2';
                    case 0b100001: return '3';
                    case 0b100000: return '4';
                    case 0b110000: return '5';
                    case 0b111000: return '6';
                    case 0b111100: return '7';
                    case 0b111110: return '8';
                    case 0b111111: return '9';

                    case 0b101101: return 'A,';
                    case 0b10101: return 'A:';
                    case 0b100100: return 'E,';
                    case 0b111011: return 'N-';
                    case 0b11110: return 'O:';
                    case 0b10011: return 'U:';

                    case 0b100100: return ',';
                    case 0b1010101: return '.';
                    case 0b1001100: return '?';
                    case 0b110101: return ';';
                    case 0b1111000: return ':';
                    case 0b110010: return '/';
                    case 0b101010: return '+';
                    case 0b1100001: return '-';
                    case 0b110001: return '=';
                    case 0b1101101: return '(';
                    case 0b1000101: return '@';
                    case 0b1010010: return '"';
                    case 0b1011110: return '\'';
                    case 0b100110: return '!';
                }
                return '(n/a)';
            },
            
            idleType: function() {
                if (app.idleDuration < letterMin) return 'none';
                if (app.idleDuration < wordMin) return 'letter';
                return 'word';
            }
        },

        watch: {
        },

        methods: {
            keyName: function (ch) {
                switch (ch) {
                    case '.': return 'dot';
                    case '-': return 'dash';
                }
                return 'other';
            },
            keyGraph: function (ch) {
                switch (ch) {
                    case '.': return "fa-circle";
                    case '-': return "fa-minus";
                }
                return "fa-question";
            },
            say: function (b, n) {
                return b ? n : '';
            },
            sayOn: function (b) {
                return b ? 'on' : '';
            }
        }
    });
    
    function append(ch) {
        $("#editor").append(ch);
    }
    
    body = $('body');
    body.on('keydown', function (e, t) {
        if (event.repeat) return;
        
        if (idleHandler != null) {
            clearInterval(idleHandler);
            idleHandler = null;
            app.idleStart = app.idleDuration = null;
        }
        
        app.lastEvent = e;
        if (e.key == '.') {
            down = true;
            app.holdStart = Date.now();
            app.holdKey = '.';
            app.holdDuration = 0;
            holdHandler = setInterval(function() {
                app.holdDuration = Date.now() - app.holdStart;
                if (app.holdDuration >= dashMin) {
                    app.holdKey = '-';
                }
            }, checkInterval);
        }
        app.holdDuration = null;
    });
    
    body.on('keyup', function (e, t) {
        if (holdHandler != null) {
            clearInterval(holdHandler);
            holdHandler = null;
        }
        if (down) {
            var duration = Date.now() - app.holdStart;
            app.holdDuration = duration;
            var newKey = '.';
            if (duration >= dashMin) {
                newKey = '-';
            }
            app.keys.push(newKey);
            
            app.idleStart = Date.now();
            app.idleDuration = 0;
            idleHandler = setInterval(function () {
                app.idleDuration = Date.now() - app.idleStart;
                var nKey = app.keys.length;
                if (nKey) {
                    if (app.idleDuration >= letterMin) {
                        var char = app.keyChar;
                        if (debug) return;
                        app.keys = [];
                        append(char);
                        return;
                    }
                } else {
                    if (app.idleDuration >= wordMin) {
                        var char = '&nbsp;';
                        char = ' ';
                        if (debug) return;
                        append("<span class='ws'>" + char + "</span>");
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
    });
    
});