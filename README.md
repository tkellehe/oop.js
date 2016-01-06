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
