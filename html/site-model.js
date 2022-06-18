
Vue.prototype.site = window.site = {
    menu1: [
        { href: "../m-blank/index.html", iconfa: "fa-file-o", label: "空白页" },
        { href: "../m-lunar/index.html", iconfa: "fa-moon", label: "月历" }
    ],
    
    itemIm: function (item) {
        if (item.href == null)
            item.href = "/files/" + item.dir + "/" + item.name;
        return alterHref(item.href);
    }
    
};

function rowIm(rowOrId, keyOrProps, fallback) {
    var id, props;
    if (typeof(rowOrId) == "object") {
        id = rowOrId[0];
        if (keyOrProps == null) keyOrProps = 1;
        props = rowOrId[keyOrProps];
    } else {
        id = rowOrId;
        props = keyOrProps;
    }
    if (fallback == null)
        fallback = "";
        
    if (props == null) return fallback;
    var images = props.images;
     if (images == null || images.length == 0) return fallback;
    var first = images[0];
    var href = site.itemIm(first, id);
    return href;
}

function objIm(obj, fallback) {
    if (fallback == null) fallback = "";
    var props = obj.properties;
    if (props == null) return fallback;
    var images = props.images;
     if (images == null || images.length == 0) return fallback;
    var first = images[0];
    var href = site.itemIm(first);
    return href;
}
