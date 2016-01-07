# oop.js

----

Wrapper functions to create a look and feel of common langauges.

----

## oop.js 101

`oop.js` does not flood the global scope with a bunch of functions and objects. Instead, a single function `oop` is
created within the scope that `oop.js` is loaded into.

---

#### VERSION

Provides the version of `oop.js` that is currently in use.

--

#### Errors

`oop.js` provides access to the unique error objects that `oop.js` can throw at runtime. All inherit from `OOPError` which 
inherits from `Error`.

| Error | Description |
| :------------ |:--------------- |
| `OOPError` | Most common error thrown. All errors thrown in `oop.js` inherit from this class. Basically, this error is thrown when a specific error does not exist. | 
| `OOPNotFoundError` | Thrown when something within `oop.js` cannot be found. |

--

#### THROW

The `oop` function provides a property called `THROW`. This object contains functions 
that take in messages needed for a particular error then throws that error. `THROW` is used internally to
`oop.js` when throwing errors. This object is provided in order to assist with any debugging problems
you might run into to help determine any errors involving `oop.js`.

--

#### FLOOD

Every property attached to `oop` has a property called `__descriptor__`. This is the object used to determine how to attach
the property to `oop`. The `FLOOD` property will attach all enumerable properties that `oop` has utilizing the
`__descriptor__` to the object passed in. Then returns the object.

```javascript
var LIB = oop.FLOOD({});
console.log(LIB.FLOOD === oop.FLOOD); // => true
```

--

#### Checking Instances

To make it easier to check against classes `oop.js` provides each wrapper type
with a function attached to `oop` like the following: `oop.is_OOPCLASSNAME`. These return a boolean value
which is determined by taking the object passed in and checking using the `instanceof` operator.

For example, the `OOP` class has the function `oop.is_OOP`.

`oop.js` does provide an object attached to `oop` called `TYPES`. This object contains a reference to 
each function used to create the `OOP` instances.

--

#### CLEAN

`oop.js` tries to not damage objects by adding a bunch of mess, but there is one thing that all objects wrapped will get and that is the property `__oop__`. This property stores a reference to the wrapper around the object.

```javascript
var myObject = {};
oop(myObject);
console.log(myObject.hasOwnProperty("__oop__")); // => true
```

In order to properly remove the `OOP` instance, __do not__ just use `delete` use the `oop.CLEAN` method. This will trace through the object removing any other components that might also have an `__oop__` property then the function will return the cleansed object.

```javascript
var myObject = {};
oop(myObject);
oop.CLEAN(myObject);
console.log(myObject.hasOwnProperty("__oop__")); // => false
```

Also, the `CLEAN` function can take in `OOP` instances and will do the same for the `__value__` property and return the cleaned object.

```javascript
var myObject = {};
var myOOP = oop(myObject);
oop.CLEAN(myOOP);
console.log(myObject.hasOwnProperty("__oop__")); // => false
```

--

#### Creating OOP instances (BASICS)

The `oop` function is the main source to creating `OOP` instances properly. All `OOP` classes use an init function to build themselves which is hidden by the `oop` function. But, this is just the basics. So, to create an `OOP` instance merely pass an object into 
`oop`.

```javascript
var myObject = {};
var myOOP = oop(myObject);
```

The first thing to point out is that all `OOP` instances have a property called `NAME` and `VALUE`. The `NAME` is not too important and can be set with a string. 

```javascript
var myObject = {};
var myOOP = oop(myObject);
myOOP.NAME = "Bob";
console.log(myOOP.NAME); // => Bob
```

Now, the `VALUE` is the object stored within the `OOP` instance. 

```javascript
var myObject = {};
var myOOP = oop(myObject);
console.log(myOOP.VALUE === myObject); // => true
```

Setting this will attach the `__oop__` (which is `myOOP`) to the object set into it.

```javascript
var myObject = {};
var myOOP = oop(myObject);
var myObject2 = {};

myOOP.VALUE = myObject2;

console.log(myObject2 === myOOP.VALUE);           // => true
console.log(myObject2.hasOwnProperty("__oop__")); // => true
console.log(myObject2.__oop__ === myOOP);         // =? true
```
