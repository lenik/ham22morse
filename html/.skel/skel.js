if (Vue != null) {
    Vue.prototype.window = window;
    
    window.setView = function(k) {
        var prev = this.view;
        if (prev != null) {
            var $prev = $("#v-" + prev);
            var onleave = $prev.attr("onleave");
            if (onleave != null) eval(onleave);
        }
        
        var navLink = $("#view-nav>[href=" + k + "]");
        navLink.siblings().removeClass("selected");
        navLink.addClass("selected");

        this.view = k;

        var $nextView = $("#v-" + k);
        $nextView.siblings().removeClass("selected");
        $nextView.addClass("selected");
        this.viewData = $nextView.data();
        
        var onenter = $nextView.attr("onenter");
        if (onenter != null) eval(onenter);
        
        return false;
    };
    
    window.appConfig = {
        mounted: function() {
            setView(this.view);
        }
    };
}

function fullScreen() {
    var hideTop = function() {
        $("#proj-info").slideUp({
            done: function() {
                $("#top").addClass("hide");
            }
        });
        $("#footbar").fadeOut();
    };

    var hTimeout;
    hTimeout = setTimeout(hideTop, 3000);

    $("#top").hover(function(e) {
        clearTimeout(hTimeout);
        hTimeout = null;

        $("#top").removeClass("hide");
        $("#proj-info").fadeIn();
        $("#footbar").fadeIn();
    }, function() {
        // TODO kill short-delay opener

        // enable auto-hide
        hTimeout = setTimeout(hideTop, 2000);
    });
}

function extendNull(ctx, opt) {
    if (opt == null)
        return;
    for (var k in opt) {
        if (ctx[k] == null)
            ctx[k] = opt[k];
    }
}

function showError(s) {
    console.error(s);
}

function parseUserAgent(s) {
    s = s.replace(/\(.*?\)/g, ''); // remove comments
    var prefix = '';
    var map = {};
    s.split(/\s+/).forEach(function (g) {
        var slash = g.indexOf('/');
        if (slash == -1)
            prefix = g + " ";
        else {
            map[prefix + g.substr(0, slash)]
                = g.substr(slash + 1).split(/\./).map(
                    function(a) { return a*1; });
            prefix = "";
        }
    });
    return $.extend({ Chrome: [ 0 ], Foo: [ 0 ] }, map);
}

function renderRegExp(data, type, row, meta) {
    if (data == null)
        return;
    // low performance:
    // var api = new $.fn.dataTable.Api(meta.settings);
    var th = $(meta.settings.aoColumns[meta.col].nTh);
    var pattern = th.attr("pattern");
    var replacement = th.attr("replacement");
    if (pattern == null)
        return;
    if (pattern.charAt(0) == "/") {
        pattern = pattern.substr(1);
        var lastSlash = pattern.lastIndexOf("/");
        var mode = pattern.substr(lastSlash + 1);
        pattern = pattern.substr(0, lastSlash);
        pattern = new RegExp(pattern, mode);
    }
    if (replacement == null) replacement = "";
    data = data.replace(pattern, replacement);
    return data;
}

function renderWithImage(data, type, row, meta) {
    if (type != "display")
        return data;
    // low performance:
    // var api = new $.fn.dataTable.Api(meta.settings);
    var th = $(meta.settings.aoColumns[meta.col].nTh);
    var script = $(th).attr("image");
    var fn = eval ("(function (row) { return " + script + " })");
    var href = fn(row);
    if (href != null) {
        href = alterHrefBase(href);
        data = "<img src=\"" + href + "\"> <span>" + data + "</span>";
    }
    return data;
}

$(document).ready(function() {

    window.userAgent = parseUserAgent(navigator.userAgent);
        if (userAgent.Chrome[0] > 600) {
            $("body").click(function() {
                document.documentElement.webkitRequestFullScreen();
                screen.orientation.lock("portrait");
            });
        }
        
        if (navigator.getBattery)
            navigator.getBattery().then(function(batteryManager) {
                window.batteryManager = batteryManager;
            });
        //require Secure Context.
        //if (navigator.getGamepads)
        //    window.gamepads = navigator.getGamepads();
        
    if ($.fn.ajaxCall)
        $("form.ajax").submit(function (event) {
            var form = $(event.target);
            form.ajaxCall();
        });

    if ($.fn.dataTable) {
        // Remember the last selection after reload.
        $.fn.dataTable.Api.register("ajax.reload_enh()", function (cb, reset) {
            var model = this;
            var tr = this.row(".selected").node();
            var id = $(tr).data("id");
            return this.ajax.reload(function() {
                    if (id != null) {
                        var tr = model.row("[data-id=" + id + "]").node();
                        $(tr).addClass("selected");
                    }
                    cb();
                }, reset);
        });

        $("table.dataTable").each(function(i, table) {
            var $table = $(table);
            
            var dataHref = $table.attr("data-href");
            var dataFilter = $table.attr("data-filter");
            var dom = $table.attr("dom");
                
            var fields = [];
            var formatMap = {};
            var renders = [];
            $("thead th", $table).each(function(i, th) {
                var field = $(th).data("field");
                var fmt = $(th).data("format");
                var render = $(th).data("render");
                
                fields.push(field);
                if (fmt != null)
                    formatMap[field] = fmt;
                
                // if (render == null) {
                //     var dot = field.indexOf('.');
                //     if (dot != -1)
                //         render = field.substr(dot + 1);
                // }
                if (render != null)
                    renders[i] = render;
            });
            
            var query = {
                row: "array", // or "object"
                columns: fields.join(","),
                formats: JSON.stringify(formatMap)
            };
            if (dataFilter != null) {
                try {
                    var filter = eval('ans = ' + dataFilter);
                    $.extend(query, filter);
                } catch (err) {
                    alert("Bad filter: " + err + "\n" + dataFilter);
                    return;
                }
            }
            
            var columnDefs = [
                { targets : "hidden", visible : false },
                { targets : "detail", visible : false },
                { targets : "no-search", searchable : false },
                { targets : "no-sort", orderable : false },
                { targets: "regexp", render: renderRegExp },
                { targets: "with-image", className: "with-image", render: renderWithImage }
            ];
            
            $("th script.render", $table).each(function (i, script) {
                var $script = $(script);
                var js = $script.text();
                var $th = $($script.closest("th"));
                var index = $th.index();
                var fn = eval("(function (data, type, row) {" + js.trim() + "})");
                renders[index] = fn;
            });
            renders.forEach(function (val, i) {
                columnDefs.push({
                    targets: i,
                    render: val
                });
            });
            
            var config = {
                // displayStart : 10,

                ajax: dataHref == null ? null : function(data, callback, opts) {
                        $.ajax({
                            url: dataHref + "/__data__",
                            data: query,
                            method: "POST"
                        }).done(function(data) {
                            if (typeof(data) != "object")
                                showError("Invalid response: " + data);
                            else
                                callback({ data: data.rows });
                        }).fail(function (xhr, status, err) {
                            showError("Failed to query index data: " + err);
                        });
                    },
                autoWidth: false,
                columnDefs: columnDefs,
                dom: dom != null ? dom : 'C<"clear">lfrtip',
                
                language : {
                    emptyTable : "没有相关的记录。",
                    info : '当前页 _PAGE_ / 共 _PAGES_ 页。',
                    lengthMenu : '每页显示 _MENU_ 条记录',
                    loadingRecords : "下载数据中…",
                    search : '查找: ',
                    zeroRecords : '没有找到相关的记录。',
                    paginate : {
                        first : "开始",
                        previous : "前一页",
                        next : "后一页",
                        last : "结束"
                    }
                },
                
                // lengthMenu : [ [ 10, 20, 50, 100, ], [ 10, 20, 50, 100 ] ],
                
                order: [ [ 0, "desc" ] ],
                
                paginate: ! $table.attr("no-paginate"),
                paginationType : "bootstrap",
                
                responsive : true
            };

            if ($table.attr("no-colvis") != null)
                config.colVis = {
                    buttonText : "列",
                    label : function(index, title, th) {
                        return (index + 1) + '. ' + title;
                    },
                    showAll : '显示全部'
                };

            if ($table.attr("no-tableTools") != null)
                config.tableTools = {
                    sSwfPath : "../libjs/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                };

            if ($table.attr("config") != null) {
                var script = $table.attr("config");
                var cb = eval("(function(config) {" + script + "})");
                cb(config);
            }
            var dt = $table.DataTable(config);

            dt.rows().on('click', 'tr', function(e) {
                var tr = $(this);
                var row = dt.row(this); // could be the header.
                var data = row.data();
                if (data == null)
                    return null;

                var id = data[0];
                if (id == undefined)
                    return;

                if ($(this).hasClass("selected"))
                    $(this).removeClass("selected");
                else {
                    dt.$("tr.selected").removeClass("selected");
                    $(this).addClass("selected");
                }

                //$(itab).trigger("rowClick", [ row ]);
            }); // row tr.onclick
            
        }); // each .dataTable
    }

    if ($.fn.inlineEdit)
        $(".editable").inlineEdit();

    if (window.IScroll != null) {
        $.fn.iscroll = function(opts) {
            this.each(function (i, el) {
                var $sel = $(el);

                // iscroll only supports single-child, so wrap multiple children if necessary.
                if ($sel.children().length > 1) {
                    var $wrapper = $(".iscroll-wrapper", $sel);
                    if ($wrapper.length == 0) {
                        var div = document.createElement("div");
                        $wrapper = $(div);
                        $wrapper.addClass("iscroll-wrapper");

                        $wrapper.append($sel.children());
                        $sel.append($wrapper);
                    }
                }

                if (opts == null)
                    opts = {
                        click: true,
                        mouseWheel: true,
                        keyBindings: true
                    };

                // TODO document.ready.. not work..
                new IScroll(el, opts);
            });
        };

        $(".iscroll").iscroll();
    }

});
