;
// NOTES: Need to remove attaching NAMESPACE objects to __value__...

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: NAMESPACE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
inherit_to_from(NAMESPACE, OOP);
function NAMESPACE() { };

// ===========================================================================================================
// Static Functions
// ===========================================================================================================
g_defProp(NAMESPACE, "def_to_proto", { value: function(name, descriptor) {
    g_defProp(NAMESPACE.prototype, name, descriptor);
}});

g_defProp(NAMESPACE, "def_prop", { value: function(name, descriptor) {
    g_defProp(NAMESPACE, name, descriptor);
}});

NAMESPACE.def_prop("__next_id__", { value: 0, writable: true });

// ===========================================================================================================
// Inheritable and Instance Functions.
// ===========================================================================================================

NAMESPACE.def_to_proto("__parent_namespace__", { writable: true });

NAMESPACE.def_to_proto("__init__", { value: function(name, namespace, container) {
    this.__name__             = name;
    this.__parent_namespace__ = namespace;
    this.__value__            = container;
    return this;
}});

NAMESPACE.def_to_proto("INIT", { value: function(name, namespace, container) {
    if(is_NAMESPACE(namespace)) 
        return this.__init__(to_string(name), namespace, is_object(container) ? container : {});
    THROW.OOPError("Must provide a NAMESPACE object to init a NAMESPACE.");
}, enumerable: true });

NAMESPACE.def_to_proto("__has__", { value: function(name) {
    return has_own_property(this.__value__, name);
}});

NAMESPACE.def_to_proto("HAS", { value: function(name) {
    return this.__has__(to_string(name));
}, enumerable: true });

NAMESPACE.def_to_proto("__get__", { value: function(name) {
    if(this.__has__(name)) return this.__value__[name];
    if(is_NAMESPACE(this.__parent_namespace__))
        return this.__parent_namespace__.__get__(name);
    THROW.OOPNotFoundError("Could not find property <" + name + "> in namespace tree.");
}});

NAMESPACE.def_to_proto("GET", { value: function(name) {
    return this.__get__(to_string(name));
}, enumerable: true});

NAMESPACE.def_to_proto("__attach__", { value: function(name, value) {
    this.__value__[name] = value;
    return this;
}});

NAMESPACE.def_to_proto("ATTACH", { value: function(name, value) {
    return this.__attach__(name, value)
}, enumerable: true});

NAMESPACE.def_to_proto("__make_namespace__", { value: function(name, container) {
    if(is_NAMESPACE(container)) {
        if(!this.__has__(name)) this.__value__[name] = container.__value__;
        return container;
    }
    this.__value__[name] = container;
    return new NAMESPACE().INIT(name, this, container);
}});

NAMESPACE.def_to_proto("MAKE_NAMESPACE", { value: function(name, container) {
    if(!is_object(container)) container = {}; 
    return this.__make_namespace__(to_string(name), container);
}, enumerable: true});

NAMESPACE.def_to_proto("__namespace__", { value: function(name) {
    var result;
    if(is_string(name)) {
        try      { result = this.__get__(name) }
        catch(e) { result = this.__make_namespace__(name) }
    } else if(is_object(name)) {
        result = this.__make_namespace__("" + NAMESPACE.__next_id__++, name);
    } else { result = {} }
    return result;
}});

NAMESPACE.def_to_proto("NAMESPACE", { value: function(name) {
    if(is_NAMESPACE(name)) return name;
    var result = this.__namespace__(name);
    if(!is_NAMESPACE(result)) result = this.__make_namespace__(to_string(name), result);
    return result; 
}, enumerable: true})

// ===========================================================================================================
// Helper functions.
// ===========================================================================================================

// Used to determine whether or not an object is an instance of NAMESPACE.
function is_NAMESPACE(obj) { return obj instanceof NAMESPACE };

add_tool("is_NAMESPACE", { value: is_NAMESPACE, enumerable: true });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: NAMESPACE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var GLOBAL_NAMESPACE = new NAMESPACE().__init__("GLOBAL", undefined, {});

g_defProp(global, "GLOBAL", { value: GLOBAL_NAMESPACE });

add_tool("MAKE_NAMESPACE", { value: function (name, parent_namespace) {
    if(!is_NAMESPACE(parent_namespace)) parent_namespace = GLOBAL_NAMESPACE;
    return parent_namespace.MAKE_NAMESPACE(name);
}, enumerable: true});

add_tool("NAMESPACE", { value: function(name) {
    if(name === "GLOBAL") return GLOBAL_NAMESPACE;
    return GLOBAL_NAMESPACE.NAMESPACE(name);
}, enumerable: true });
;