;
// Create property __type__!! Or better a __oop__...
// PLace an __oop__ which will be used to help store namespace trees better...

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: OOP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var TYPES = {};

function register_type(name, type) {
    g_defProp(TYPES, name, { value: type, enumerable: true });
};

function OOP() {};

register_type("OOP", OOP);

// ===========================================================================================================
// Static Functions
// ===========================================================================================================

g_defProp(OOP, "inherit", { value: function(name, descriptor) {
    g_defProp(OOP.prototype, name, descriptor);
}});

g_defProp(OOP, "def", { value: function(name, descriptor) {
    g_defProp(OOP, name, descriptor);
}});

// ===========================================================================================================
// Inheritable and Instance Functions.
// ===========================================================================================================

OOP.inherit("def", { value: function(name, descriptor) {
    g_defProp(this, name, descriptor);
    return this;
}});

OOP.inherit("__value__", { writable:true });

OOP.inherit("VALUE", {
    get: function()  { return this.__value__ },
    set: function(v) { 
        this.__value__ = v;
        if(is_object(v)) v.__oop__ = this;
    },
    enumerable: true
});

OOP.inherit("__name__", { writable:true });

OOP.inherit("NAME", {
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

add_tool("TYPES", { value: TYPES, enumerable: true });

// Floods an object with all of the enumerated properties attached to oop.
add_tool("FLOOD", { value: function(obj) {
    // Only will attach the properties if the obj is not const and object.
    // Loops through each enumerable property and uses the descriptor attached in order to attach properly.
    if(!is_const(obj) && is_object(obj)) 
        for(var name in oop) g_defProp(obj, name, oop[name].__descriptor__);
    return obj;
}, enumerable: true});

// Removes the __oop__ handle attached to the objects.
// (Needs to loop through each property and clean those as well...)
add_tool("CLEAN", { value: function(obj) {
    var result;
    if(is_OOP(obj)) result = obj.VALUE;
    delete result.__oop__;
    return result;
}, enumerable: true});

g_defProp(oop, "VERSION", { value: "1.0.0" });

g_defProp(global, "oop", { value: oop });
;