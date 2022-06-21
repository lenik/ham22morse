
function convert(data) {
    var n = data.length;
    var dst = [];
    for (var i = 0; i < n; i++) {
        var row = data[i];
        var m = row.ans.length;
        var answers = [];
        for (var j = 0; j < m; j++) {
            answers[j] = {
                text: row.ans[j],
                index: j,
                random: Math.random() * 100000,
            };
        }
        answers.sort( (a, b) => a.random - b.random );
        dst.push({
            q: row.q,
            answers: answers
        });
    }
    return dst;
}

$(document).ready(function() {

    appModel = {
        records: [],
        init: function(s) {
        }
    };

    app = new Vue({
        el: "#body",
        data: appModel,
        computed: {
        },

        watch: {
        },

        methods: {
        }
    });
    
    async function loadData() {
        const res = await fetch('data/lib2022.json');
        const data = await res.json();
        // const src = document.getElementById("data").textContent;
        // const data = JSON.parse(src);
        app.records = convert(data);
        
        var config = window.PagedConfig;
        var previewer = new Paged.Previewer;
        previewer.preview(config.content, config.stylesheets, config.renderTo);
    }
    loadData();
    
});
