;(function (global, g_linker, g_defProp, g_XHR, g_enURI, g_eval, g_script) {
// If linker is already defined, then use the linker to load the script tag and link with the others.
if(g_linker !== undefined) return g_linker(g_script);

// Holds basic functions that will do something related to a status.
var _status_objects = {
    "OK": function(xhr, scope, callback, error) { callback.call(scope, xhr.responseText) },
    "ERROR": function(xhr, scope, callback, error) { error.call(scope, xhr) }
};

// Determines which status object to return.
function _status(status_value) {
    if(status_value === 200 || status_value === 0)
        return _status_objects.OK;
    else
        return _status_objects.ERROR;
};

// Fetches the file then calls the correct status function.
function _fetch(filename, context, callback, error) {
    var xhr = new g_XHR();
    xhr.open('GET', g_enURI(filename));
    xhr.onload = function() {
        _status(xhr.status)(xhr, context, callback, error);
    };
    xhr.send();
};

var _files_loaded = [];
_files_loaded.next_id = 0;

// Used to keep track of current files loaded.
function _add_link(id, code) {
    if(_files_loaded[id] !== undefined) throw new Error("Conflicting ids: " + id);
    _files_loaded[id] = code;
};

var _completed = false, _result;

function _wrap_up() {
    var code = "";
    for(var i = _files_loaded.length; --i >= 0;)
        code = (_files_loaded[i] || "") + code;
    _result = g_eval.call(global, code);
    _oncomplete(_result);
    return _result;
};

function linker(tag) {
    // If there is not a file to load then ignore.
    if(tag.getAttribute("linker-file") === null) return linker;
    var is_start = tag.getAttribute("linker-start") !== null,
        is_end   = tag.getAttribute("linker-end") !== null,
        is_id    = tag.getAttribute("linker-id") !== null,
        id       = +(is_id ? tag.getAttribute("linker-id") : _files_loaded.next_id++),
        file     = tag.getAttribute("linker-file");

    if(is_start && is_id && id !== 0) { throw new Error("Cannot start at an id != 0.") }
    if(!is_start && !is_id && id === 0) { id = _files_loaded.next_id++ }
    else if(is_start && id !== 0) { id = 0; --_files_loaded.next_id }

    _fetch(file, _limited_scope, 
           function(code) { _add_link(id, code); if(is_end) _wrap_up(); },
           function(xhr) { console.error(xhr.status, xhr.responseText); if(is_end) _wrap_up(); }
           );
};

var _limited_scope = { "linker": linker };

g_defProp(linker, "content", { get: function() {
    var array = [];
    for(var i = _files_loaded.length; --i >= 0;)
        array[i] = _files_loaded[i] || "";
    return array;
}});

g_defProp(linker, "compile", { value: _wrap_up });

var _oncomplete = function(){};

g_defProp(linker, "oncomplete", { value: function(f) {
    if(_completed)
        _oncomplete(_result);
    else
        _oncomplete = f;
}});

// Check to see if this script has anything.
linker(g_script);

g_defProp(linker, "VERSION", { value: "1.0.0" });

g_defProp(global, "linker", { value: linker });

})(this, this.linker, Object.defineProperty, XMLHttpRequest, encodeURI, 
   function g_eval(code) { return eval(code) },
   // Gets the last script tag.
   (function(){ var scripts = document.getElementsByTagName("script"); return scripts[scripts.length - 1] })()
);