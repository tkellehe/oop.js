;
function OOP(obj) {
    if(!(this instanceof OOP)) THROW.OOPError("Must use OOP to create instances.");
    g_defProp(this, "VALUE", { value: obj, enumerable: true });
};

OOP.prototype.toValue  = function() { return this.VALUE.toValue() };
OOP.prototype.toString = function() { return this.VALUE.toString() };

function oop(obj) {
    return new OOP(obj);
};

// A function all files are supposed to use to add properties to OOP instances.
function add_to_proto(name, descriptor) {
    g_defProp(OOP.prototype, name, descriptor);
};

// A function all files are supposed to use to add constructors to oop.
function add_constructor(name, descriptor) {
    g_defProp(oop, name, descriptor);
};

g_defProp(oop, "VERSION", { value: "1.0.0" });

g_defProp(global, "oop", { value: oop });
;