;
// Create property __type__!!

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: OOP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The main wrapper object used by oop.js. 
 * Must be used with the new constructor or when the scope is an instance of OOP.
 */
function OOP() {
    if(!(this instanceof OOP)) THROW.OOPError("Must use OOP to create instances.");
};

register_type("OOP", OOP);

// ===========================================================================================================
// Static Functions
// ===========================================================================================================

g_defProp(OOP, "def_to_proto", { value: function(name, descriptor) {
    g_defProp(OOP.prototype, name, descriptor);
}});

g_defProp(OOP, "def_prop", { value: function(name, descriptor) {
    g_defProp(OOP, name, descriptor);
}});

// ===========================================================================================================
// Inheritable and Instance Functions.
// ===========================================================================================================

OOP.def_to_proto("def_prop", { value: function(name, descriptor) {
    g_defProp(this, name, descriptor);
    return this;
}});

OOP.def_to_proto("__value__", { writable:true });

OOP.def_to_proto("VALUE", {
    get: function()  { return this.__value__ },
    set: function(v) { this.__value__ = v },
    enumerable: true
});

OOP.def_to_proto("__name__", { writable:true });

OOP.def_to_proto("NAME", {
    get: function()  { return this.__name__ },
    set: function(v) { if(is_string(v)) this.__name__ = v },
    enumerable: true
});

OOP.prototype.valueOf  = function() { return this.VALUE.valueOf.apply(this.VALUE, arguments)  };
OOP.prototype.toString = function() { return this.VALUE.toString.apply(this.VALUE, arguments) };

// ===========================================================================================================
// Helper functions.
// ===========================================================================================================

// Used to determine whether or not an object is an instance of OOP.
function is_OOP(obj) { return obj instanceof OOP };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: OOP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The main function used to interface with the oop.js library.
 */
function oop(obj) {
    // If already an OOP then no need in wrapping.
    if(is_OOP(obj)) return obj;
    if(!is_object(obj)) THROW.OOPError("Cannot wrap constant values."); // Can later make a CONST type...
    // Creates a new OOP that is used to wrap oop.js functionality around the object.
    var newOOP   = new OOP();
    newOOP.VALUE = obj;
    return newOOP;
};

// The is_OOP was added as a tool to assist users in knowing if an object has been wrapped.
add_tool("is_OOP", { value: is_OOP, enumerable: true });

// A function all files are supposed to use to add constructors to oop.
function add_tool(name, descriptor) {
    g_defProp(oop, name, descriptor);
    g_defProp(oop[name], "__descriptor__", {get: function() { return descriptor }});
};

var TYPES = {};

function register_type(name, type) {
    g_defProp(name, { value: type, enumerable: true });
};

add_tool("TYPES", { value: TYPES, enumerable: true });

// Floods an object with all of the enumerated properties attached to oop.
add_tool("FLOOD", { value: function(obj) {
    // Only will attach the properties if the obj is not const and object.
    // Loops through each enumerable property and uses the descriptor attached in order to attach properly.
    if(!is_const(obj) && is_object(obj)) 
        for(var name in oop) g_defProp(obj, name, oop[name].__descriptor__);
    return obj;
}, enumerable: true});

g_defProp(oop, "VERSION", { value: "1.0.0" });

g_defProp(global, "oop", { value: oop });
;