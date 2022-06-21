const checkInterval = 10;

var down = false;
var holdHandler;
var idleHandler;

const cheatLists = [
    { name: 'a-m', list: [
            { name: 'A', code: '.-' },
            { name: 'B', code: '-...' },
            { name: 'C', code: '-.-.' },
            { name: 'D', code: '-..' },
            { name: 'E', code: '.' },
            { name: 'F', code: '..-.' },
            { name: 'G', code: '--.' },
            { name: 'H', code: '....' },
            { name: 'I', code: '..' },
            { name: 'J', code: '.---' },
            { name: 'K', code: '-.-' },
            { name: 'L', code: '.-..' },
            { name: 'M', code: '--' },
    ]}, { name: 'n-z', list: [
            { name: 'N', code: '-.' },
            { name: 'O', code: '---' },
            { name: 'P', code: '.--.' },
            { name: 'Q', code: '--.-' },
            { name: 'R', code: '.-.' },
            { name: 'S', code: '...' },
            { name: 'T', code: '-' },
            { name: 'U', code: '..-' },
            { name: 'V', code: '...-' },
            { name: 'W', code: '.--' },
            { name: 'X', code: '-..-' },
            { name: 'Y', code: '-.--' },
            { name: 'Z', code: '--..' },
    ]}, { name: 'digit', list: [
            { name: '1', code: '.----' },
            { name: '2', code: '..---' },
            { name: '3', code: '...--' },
            { name: '4', code: '....-' },
            { name: '5', code: '.....' },
            { name: '6', code: '-....' },
            { name: '7', code: '--...' },
            { name: '8', code: '---..' },
            { name: '9', code: '----.' },
            { name: '0', code: '-----' },
    ]}
];

function decode(bin) {
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
}

$(document).ready(function() {

    appModel = {
        version: '1.0',
        text: 'hello, world!',
        debug: false,
        mobile: true,
        editMode: false,
        
        showKey: false,
        showHelp: false,
        cheatLists: cheatLists,
        
        speed: {
            dash: {
                min: 50, max: 1000, step: 50, value: 150
            },
            letter: {
                min: 100, max: 1500, step: 50, value: 200
            },
            word: {
                min: 500, max: 2500, step: 100, value: 700
            }
        },

        keys: "".split(''),
        lastEvent: {
            code: 'N/A'
        },
        
        holdStart: null,
        holdKey: null,
        holdDuration: null,
        
        idleStart: null,
        idleDuration: null,
        addSpace: false,
        
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
                return decode(bin);
            },
            
            idleType: function() {
                if (app.idleDuration < app.speed.letter.value) return 'none';
                if (app.idleDuration < app.speed.word.value) return 'letter';
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
            },
            tailed: function (tail, f) {
                return function (e) {
                    return e.value + "<div class='tail'>" + tail + "</div>";
                };
            }
        }
    });
    
});
