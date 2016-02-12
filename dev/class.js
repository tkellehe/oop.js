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
    this.__name__ = name;
    add__oop__(this.__value__, this);
    return this;
}});

CLASS.inherit("INIT", { value: function(name, value) {
    // Private stuff needs to be created here as well as some of the other stuff for CLASS!
    this.__init__(name = to_string(name), is_function(value) ? value : function(){});

    // I have got a lot to figure out for this one...
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