$(document).ready(function() {

    appModel = {
        version: '1.0',
        view: 'about',
        views: {
            about: {
                label: "About",
                iconfa: "info"
            },
            options: {
                label: "Options",
                iconfa: "cog"
            }
        },
        stat: {
            views: 0,
            stars: 0,
            upvotes: 0,
            downvotes: 0
        },
        
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
    
    $.ajax("d2.json").done(function(data) {
        var n = data.length;
        for (var i = 0; i < n; i++) {
            var record = data[i];
            var m = record.ans.length;
            record.answers = [];
            for (var j = 0; j < m; j++) {
                record.answers[j] = {
                    text: record.ans[j],
                    index: j,
                    random: Math.random() * 100000,
                };
            }
            record.answers.sort( (a, b) => a.random - b.random );
        }
        app.records = data;
    }).fail(function (xhr, status, err) {
        showError("Failed to query index data: " + err);
    });

});
