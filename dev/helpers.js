;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: "is" functions
// -----------------------------------------------------------------------------------------------------------
// Functions that determine whether or not something(s) is the "is".
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function is_function(obj)  { return obj instanceof Function };
function is_object(obj)    { return obj instanceof Object };
function is_instance(obj)  { return !is_function(obj) && is_object(obj) };
function is_undefined(obj) { return obj === undefined };
function is_null(obj)      { return obj === null };
function is_nan(obj)       { return obj !== obj };
function is_finite(obj)    { return isFinite(obj) };
function is_infinite(obj)  { return obj === Infinity || obj === -Infinity };
function is_const(obj)     { return !is_object(obj)   && !is_undefined(obj) &&
                                    !is_null(obj)     && !is_nan(obj)       &&
                                    !is_infinite(obj) };
function is_string(obj)       { return obj instanceof String || typeof obj === "string" };
// Only const strings typeof return "string".
function is_const_string(obj) { return typeof obj === "string" };
function is_not_usable(obj) { return is_undefined(obj) || is_null(obj) || is_infinite(obj) || is_nan(obj) };

function has_own_property(obj, property) {
    if(is_undefined(obj) || is_null(obj)) return false;
    return hasOwnProperty.call(obj, property); 
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: "is" functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: "to" functions
// -----------------------------------------------------------------------------------------------------------
// Handle conversions to particular data types or anything that can start with "to"...
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function to_bool(obj) { return !!obj };
function to_string(obj) { return is_object(obj) ? obj.toString() : obj + "" };
function to_value(obj) { return +obj };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: "to" functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: Inheritance Helpers
// -----------------------------------------------------------------------------------------------------------
// Basic assistance in forcing doing inheritance.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function extend(child, parent) { child.prototype = g_create(parent.prototype); return child; };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: "is" functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START: Error Helpers
// -----------------------------------------------------------------------------------------------------------
// Basic helpers of throwing errors that are specific oop.js errors.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

extend(OOPError, Error);
function OOPError(message) {
   Error.captureStackTrace(this);
   this.message = message;
   this.name = "OOPError";
};

OOPError.prototype.toString = function() { return this.message };

add_tool("OOPError", { value: OOPError, enumerable: true  });

extend(OOPNotFoundError, OOPError);
function OOPNotFoundError(message) {
   Error.captureStackTrace(this);
   this.message = message;
   this.name = "OOPNotFoundError";
};

add_tool("OOPNotFoundError", { value: OOPNotFoundError, enumerable: true });

var THROW = { 
    'OOPError': function(message) { throw new OOPError(message) },
    'OOPNotFoundError': function(message) { throw new OOPNotFoundError(message) }
};

add_tool("THROW", { value: THROW, enumerable: true  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END: Error Helpers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
;