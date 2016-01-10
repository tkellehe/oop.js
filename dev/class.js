;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
extend(CLASS, OOP);
function CLASS() { };

register_type("CLASS", CLASS);

// ===========================================================================================================
// Static Functions
// ===========================================================================================================
g_defProp(CLASS, "inherit", { value: function(name, descriptor) {
    g_defProp(CLASS.prototype, name, descriptor);
}});

g_defProp(CLASS, "def", { value: function(name, descriptor) {
    g_defProp(CLASS, name, descriptor);
}});

// ===========================================================================================================
// Inheritable and Instance Functions.
// ===========================================================================================================

CLASS.inherit("__init__", { value: function(name, value) {
    this.__name__             = name;
    add__oop__(this.__value__, this);
    return this;
}});

CLASS.inherit("INIT", { value: function(name, value) {
    this.__init__(to_string(name), is_object(value) ? value : {});
}, enumerable: true });

// ===========================================================================================================
// Helper functions.
// ===========================================================================================================

// Used to determine whether or not an object is an instance of CLASS.
function is_CLASS(obj) { return obj instanceof CLASS };

add_tool("is_CLASS", { value: is_CLASS, enumerable: true });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: CLASS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

add_tool("CLASS", { value: function(name, value) {
    return new CLASS().INIT(name, value);
}, enumerable: true})
;