;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: NAMESPACE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
extend(NAMESPACE, OOP);
function NAMESPACE() { };

register_type("NAMESPACE", NAMESPACE);

// ===========================================================================================================
// Static Functions
// ===========================================================================================================
g_defProp(NAMESPACE, "inherit", { value: function(name, descriptor) {
    g_defProp(NAMESPACE.prototype, name, descriptor);
}});

g_defProp(NAMESPACE, "def", { value: function(name, descriptor) {
    g_defProp(NAMESPACE, name, descriptor);
}});

NAMESPACE.def("__next_id__", { value: 0, writable: true });

// ===========================================================================================================
// Inheritable and Instance Functions.
// ===========================================================================================================

NAMESPACE.inherit("__parent_namespace__", { writable: true });

NAMESPACE.inherit("__init__", { value: function(name, namespace, container) {
    this.__name__             = name;
    this.__parent_namespace__ = namespace;
    this.__value__            = container;
    add__oop__(this.__value__, this);
    return this;
}});

NAMESPACE.inherit("INIT", { value: function(name, namespace, container) {
    if(is_NAMESPACE(namespace)) 
        return this.__init__(to_string(name), namespace, is_object(container) ? container : {});
    THROW.OOPError("Must provide a NAMESPACE object to init a NAMESPACE.");
}, enumerable: true });

NAMESPACE.inherit("__has__", { value: function(name) {
    return has_own_property(this.__value__, name);
}});

NAMESPACE.inherit("HAS", { value: function(name) {
    return this.__has__(to_string(name));
}, enumerable: true });

NAMESPACE.inherit("__get__", { value: function(name) {
    if(this.__has__(name)) 
    {
        return has_own_property(this.__value__[name], "__oop__") 
               && is_OOP(this.__value__[name].__oop__) ? 
               this.__value__[name].__oop__
               :
               this.__value__[name];
    }
        
    if(is_NAMESPACE(this.__parent_namespace__))
        return this.__parent_namespace__.__get__(name);
    THROW.OOPNotFoundError("Could not find property <" + name + "> in namespace tree.");
}});

NAMESPACE.inherit("GET", { value: function(name) {
    return this.__get__(to_string(name));
}, enumerable: true});

NAMESPACE.inherit("__attach__", { value: function(name, value) {
    this.__value__[name] = value;
    return this;
}});

NAMESPACE.inherit("ATTACH", { value: function(name, value) {
    if(is_OOP(name))
        return this.__attach__(name.__name__, name.__value__);
    if(is_OOP(value)) value = value.__value__;
    return this.__attach__(name, value)
}, enumerable: true});

NAMESPACE.inherit("__make_namespace__", { value: function(name, container) {
    if(is_NAMESPACE(container)) {
        if(!this.__has__(name)) this.__value__[name] = container.__value__;
        return container;
    }
    this.__value__[name] = container;
    return new NAMESPACE().INIT(name, this, container);
}});

NAMESPACE.inherit("MAKE_NAMESPACE", { value: function(name, container) {
    if(!is_object(container)) container = {}; 
    return this.__make_namespace__(to_string(name), container);
}, enumerable: true});

NAMESPACE.inherit("__namespace__", { value: function(name) {
    var result;
    if(is_string(name)) {
        if(!is_object(result = this.__value__[name])) result = {};
        if(!is_NAMESPACE(result.__oop__))
            result = this.__make_namespace__(name, result);
    } else if(is_object(name)) {
        // If result already has an __oop__ that is a namespace return that.
        result = is_NAMESPACE(name.__oop__) ? 
            name.__oop__ :
            this.__make_namespace__("" + NAMESPACE.__next_id__++, name);
    } else { result = {} }
    return result;
}});

NAMESPACE.inherit("NAMESPACE", { value: function(name) {
    var result = (is_NAMESPACE(name) ? name : this.__namespace__(name));
    if(is_NAMESPACE(result)) {
        if(result.__parent_namespace__ !== this) {
            result.__parent_namespace__ = this;
            this.__attach__(result.__name__, result.__value__);
        }
    }
    else {
        result = this.__make_namespace__(is_not_usable(name) ? 
            "" + NAMESPACE.__next_id__++ : 
            to_string(name), result);
    }
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
    if(name === "GLOBAL") {
        // Makes sure that there is still an object as the global scope.
        if(!is_object(GLOBAL_NAMESPACE.VALUE)) GLOBAL_NAMESPACE.VALUE = {};
        // Makes sure that if VALUE has been cleaned that __oop__ is still there.
        if(!has_own_property(GLOBAL_NAMESPACE.__value__, "__oop__"))
            add__oop__(GLOBAL_NAMESPACE, GLOBAL_NAMESPACE.VALUE);
        return GLOBAL_NAMESPACE;
    }
    return GLOBAL_NAMESPACE.NAMESPACE(name);
}, enumerable: true });
;