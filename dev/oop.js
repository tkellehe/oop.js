;
/**
 * The main wrapper object used by oop.js. 
 * Must be used with the new constructor or when the scope is an instance of OOP.
 */
function OOP() {
    if(!(this instanceof OOP)) THROW.OOPError("Must use OOP to create instances.");
};

g_defProp(OOP.prototype, "def_prop", { value: function(name, descriptor) {
    g_defProp(this, name, descriptor);
    return this;
}});

g_defProp(OOP.prototype, "__value__", { writable:true });

g_defProp(OOP.prototype, "VALUE", {
    get: function()  { return this.__value__ },
    set: function(v) { if(!is_const(v)) this.__value__ = v },
    enumerable: true
});

OOP.prototype.toValue  = function() { return this.VALUE.toValue.apply(this.VALUE, arguments)  };
OOP.prototype.toString = function() { return this.VALUE.toString.apply(this.VALUE, arguments) };

// Used to determine whether or not an object is an instance of OOP.
function is_OOP(obj) { return obj instanceof OOP };

/**
 * The main function used to interface with the oop.js library.
 */
function oop(obj) {
    // If already an OOP then no need in wrapping.
    if(is_OOP(obj)) return obj;
    if(is_const(obj)) THROW.OOPError("Cannot wrap constant values."); // Can later of a CONST type...
    // Creates a new OOP that is used to wrap oop.js functionality around the object.
    var newOOP   = new OOP();
    newOOP.VALUE = obj;
    return newOOP;
};

// The is_OOP was added as a tool to assist users in knowing if an object has been wrapped.
add_tool("is_OOP", { value: is_OOP, enumerable: true });

// A function all files are supposed to use to add properties to OOP instances.
function add_to_proto(name, descriptor) {
    g_defProp(OOP.prototype, name, descriptor);
};

// A function all files are supposed to use to add constructors to oop.
function add_tool(name, descriptor) {
    g_defProp(oop, name, descriptor);
    g_defProp(oop[name], "__descriptor__", {get: function() { return descriptor }});
};

// Floods an object with all of the enumerated properties attached to oop.
add_tool("FLOOD", { value: function(obj) {
    // Only will attach the properties if the obj is not const.
    // Loops through each enumerable property and uses the descriptor attached to attach properly.
    if(!is_const(obj)) for(var name in oop) g_defProp(obj, name, oop[name].__descriptor__);
    return obj;
}, enumerable: true});

g_defProp(oop, "VERSION", { value: "1.0.0" });

g_defProp(global, "oop", { value: oop });
;