**jsxl** is a utility module providing powerful features for filtering, validating, and transforming JSON objects in **Node.js** applications. 

Use cases of jsxl include:

* inbound application REST APIs, when providing services
    * vaildating and transforming request parameters, arguments, headers, and bodies
    * transforming response bodies 
* outbound application REST APIs, when consuming services
    * transforming request parameters, arguments, headers, and bodies
    * validating and transforming response bodies
* application plugins, when extending applications
    * filtering, validating, and transforming plugin interfaces
	
At **jungle.io**, makers of **jsxl** and of the **jungle application development framework**, we use jsxl extensively for all of the above. 
In fact, jsxl itself is built upon jsxl (just another use case), compiling filters and intrinsic filter-filters. 
Throughout this readme, filter-filters are used for describing patterns of filters.

# Getting Started

To install jsxl from your command line, run

```
npm install jsxl
```

To start using jsxl in code, write

```javascript
const jsxl = require('jsxl');
```

Filtering, validating, and transforming happens through application of jsxl-objects to JSON-objects. jsxl-objects, also known as **filters**, are themselves JSON-objects decorated with modifiers and JavaScript functions. 

Example 1 illustrates successful validation of a JSON-object, an Array of Objects, each object with an attribute *number* of type Number,

```javascript
// example 1, validating
jsxl(
	{
		input: [ { number: 7 }, { number: 8 }, { number: 9 } ]
	},
	[ { number: Number } ], // filter
	(err, output) => {
		console.log(output);
		// yields: [ { number: 7 }, { number: 8 }, { number: 9 } ]
	}
);
```

whereas example 2 illustrates unsuccessful validation of similar.

```javascript
// example 2, invalidating
jsxl(
	{
		input: [ { number: 'a' }, { number: 'b' }, { number: 'c' } ]
	},
	[ { number: Number } ], // filter
	(err, output) => {
		console.log(err);
		// yields: 'input[0].number must be of type Number (not String)'
	}
);
```

Example 3 extends example 1 by filtering out even-numbered objects and multiplying numbers by 3 in remaining objects.

```javascript
// example 3, filtering and transforming
jsxl(
	{
		input: [ { number: 7 }, { number: 8 }, { number: 9 } ]
	},
	[ {
		$filter: (context, object, next) => {
			// reject even-numbered objects
			// note that explicit validation is necessary in $filter
			next(null, !(object && typeof object.number == 'number' && 
			             object.number % 2 == 0)); 
		},
		$type: {
			number: {
				$type: Number,
				$transform: (context, number, next) => {
					next(null, number * 3);
				}
			}
		},
	} ], // filter
	(err, output) => {
		console.log(output);
		// yields: [ { number: 21 }, { number: 27 } ]
	}
);
```

Filters may be compiled and executed combined for single use, as illustrated in above examples, or may be compiled and executed separately for repeated use. 

Example 4 extends example 1, separately compiling and executing the filter.

```javascript
// example 4, compiling and executing filter separately
jsxl.compile(
	[ { number: Number } ], // filter
	(err, filter) => {
		if (err) return console.log(err);
		jsxl.execute(
			{
				input: [ { number: 7 }, { number: 8 }, { number: 9 } ]
			},
			filter, // compiled filter
			(err, output) => {
				console.log(output);
				// yields: [ { number: 7 }, { number: 8 }, { number: 9 } ]
			}
		);
	}
);
```
# Understanding Filter-Filters

Filter-filters are simply filters that define the rules of other filters. jsxl uses filter-filters to validate that filters provided by users of jsxl are defined properly, and if not, rejects those provided filters.

In example, when filtering arrays, filters must state an array of minimum one element, where the one element or - if multiple elements - the merged elements must define the filter of every array element. 

```javascript
// the array filter-filter
Array: {
	$type: [ 'Type' ],
	$minlen: 1,
}
```

Example 5 attempts to filters three arrays, one uses merged element filters, one uses a single element filter, and one has no element filter.

```javascript
// example 5, filtering three arrays, one uses merged element filters, one uses a single element filter, and one has no element filter
jsxl({
	input: {
		array1: [ { a: 1, b: 'x' } , { a: 2, b: 'y' }, { a: 3, b: 'z' } ],
		array2: [ 4, 5, 6 ],
		array2: [ 7, 8, 9 ],
	}},
	{ // filter
		array1: [ { a: Number }, { b: String } ],
		array2: [ Number ],
		array3: [ ],
	}, 
	(err, output) => {
		console.log(err);
		// yields: 'filter.array3 must have minimum length 1'
	}
);
```

In example, when filtering objects, filters must state an object of any number of attribute filters.

```javascript
// the object filter-filter
Object: {
	$: 'Type'
}
```

Whereas, when filtering filters (types), filters allow a variety of options

```javascript
// the type filter-filter
Type: {
	$any: [
		'Array',
		'Object',
		String,		// filters previously stated by name
		Function,	// javascript intrinsic types, e.g. Number, String, Date, Boolean, or RegExp
		'null'		// the value null, used for specifying any avalue
	]
}
```

# Understanding Context

In example 3, embedded functions **$filter** and **$transform** receive contexts. In fact, every function embedded in filters receive context.

Contexts provide understanding of filtering path and surrounding state to functions embedded in filters. The deeper into the object the filter processes the deeper the filtering path. Surrounding state, of course, changes accordingly.

Context adheres to the following filter

```javascript
// the context filter
Context: {
	context: { // the parent context
		$type: 'Context',            
		$optional: true,
	},
	parameters: { 
		$: null // named parameters provided in initial context and passed down to every sub context
	},
	scope: { 
		$: null // named attributes setable in every context, visible in same and sub contexts but not in super contexts
	},
	source: null,                    	// any type, current input object
	target: null,                    	// any type, current output object
	path: String,                    	// path to current context
	key:    { $any: [ String, Number ],	// key or index into source
	rename: { $any: [ String, Number ],	// key or index into target, may differ from key if key is being renamed
}
```

When inspecting context, *context.source[context.key]* may be undefined. This is accepted, if the associated filter sets modifers **$optional** or **$default**. Otherwise, this is rejected with an error. 

When inspecting context, *context.target[context.rename]* will likely be undefined, as it has not yet been assigned. The exception to this rule appears when filtering into preexisting targets, in which case the original value will likely remain, as it has not yet been overridden. Preexisting targets are set in initial context.

Inspecting *context.target* allows embedded functions to act conditionally on previosly validated and transformed object entries. Note that such retrospective conditioning is ONLY trustworthy when objects and arrays are processed in serial (NOT parallel) manner. Reference **$parallel** in a later section for further information on parallel processing.


# Initiating Context

In previous examples, filtered object is passed in as 

```javascript
// implicit context
{
	input: [ { number: 7 }, { number: 8 }, { number: 9 } ]
}
```

This represents an initial implict context. Implicit contexts must be objects with single entries, the keys of which represent names of filtered objects. 

The corresponding initial explicit context would read

```javascript
// explicit context
{ 
	key: 'input',
	source: { 
		input: [ { number: 7 }, { number: 8 }, { number: 9 } ] 
	} 
}
```

Note that initial context never holds a parent context nor a path. 

Initial explicit contexts must minimally hold a key, and a source, which in turn holds an entry that corresponds with the key. Initial explict contexts need only be used when additional context (e.g. parameters, scope, and/or target) must be provided.

Example 6 which extends example 3 provides parameters and target in initail context to demonstrate use hereof.

```javascript
// example 6, using explicit initial context
const target = {
	input: [ { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 } ],
	other: 'this is other stuff...'
};
const parameters = {
	modulus: 2	
};
jsxl(
	{	
		target,
		parameters,
		key: 'input',
		source: {
			input: [ { number: 7 }, { number: 8 }, { number: 9 } ]
		}
	}, // explicit context
	[ { 
		$filter: (context, object, next) => {
			// rejects parameter-numbered objects
			// note that explicit validation is necessary in $filter
			next(null, !(object && typeof object.number == 'number' && 
			             object.number % context.parameters.modulus == 0)); 
		},
		$type: { number: Number }
	} ], // filter
	(err, output) => {
		console.log(target);
		// yields: { 
		//    input: [ { number: 7 }, { number: 2 }, { number: 9 }, { number: 4 } ],
		//    other: 'this is other stuff...' 
		// }
	}
);
```
Note that example 6 logs target, not output. Output is, however, nicely filtered into target in place of input. 

Also note that some numbers (1 and 3) are replaced with new numbers (7 and 9) while others (2 and 4) remain unchanged in target. This is due to providing target in intial context, the filtered object is "filtrated" into target.

# Managing Types

In previous examples, **$type** is used in conjunction with other $-modifiers. 

The convention used is one of not mixing modified and unmodified filteres (ref. modifiers in a later section). So when modifying filters, we must capture type information in a $type entry.

The following filter uses modifier **$gt** to ensure a minimum value and must thus also specify modifier **$type**.

```javascript
// an object with attribute a, which must be a number greater than 7
{
	a: { 
		$type: Number,
		$gt: 7 // this is a modifier
	}
}
```

The same filter without the minimum-value requirement may be stated as follows

```javascript
// an object with attribute a, which must be a number
{
	a: { 
		$type: Number,
	}
}
```

or in shorthand format as follows

```javascript
// an object with attribute a, which must be a number
{
	a: Number
}
```

Filter types include any of the following JavaScript types (partial filter-filter of types).

```javascript
// partial filter-filter for types
$any: [ 
	RegExp, 
	String, 
	Boolean, 
	Number, 
	Date, 
	Function, 
	[ null ], 
	{ $: null }, 
	{ $transform: (context, type, next) => next(type === null || (type && type.constructor === String) ? null : 'must hold type null or a string litteral') } 
]
```

Note that Arrays hold any number of entries, each of the same type but this may be any type (null) while Objects hold any number of entries, each of different types which are any types (null). 

Are types specified as **null**, then any type is accepted.


# Precompiled Utility Filters

Are types specified as string litterals, then precompiled utility filters with same litteral names are used to validate types. If precompiled filters are not found, filters are rejected with errors.

jsxl provides the following precompiled utility filters:

```javascript
Boolean: {  $any: [ 
	Boolean, 
	{ 
		$type: String, 
		$transform: (context, string, next) => {
			switch (string.toLowerCase()) {
			case 'true': return next(null, true);
			case 'false': return next(null, false);
			}
			next('is an invalid Boolean string');
		}
	}
]}
```

* **"Boolean"**, requires any of Boolean or String which may translate into a Boolean
* **"Number"**, requires any of Number or String which may translate into a Number (conventional punctuation)
* **"IntNumber"**, requires any of Number or String which may translate into a Number (international punctuation)
* **"Date"**, requires any of Date or String which may translate into a Date
* **"RegExp"**, requires any of RegExp or String which may translate into a RegExp
* **"Filter"**, requires any of Function by name 'script' (filter) or anything (null) which may compile into a filter (Function by name 'script')

Users of jsxl may also extend these precompiled utility filters by calling the jsxl useFilters() method.

```javascript
// example 7, adding and using a utility filter
jsxl.useFilters({
	EvenNumbers: [ { 
		$type: Number,
		$transform: (context, number, next) => {
			if (number %2 != 0) return next('%s must be an even number');
			next();
		}
	} ]
});
jsxl(
	{
		input: [ 2, 4, 6 ]
	},
	"EvenNumbers",
	(err, output) => {
		console.log(output);
		// yields: [ 2, 4, 6 ]
	}
);
```

Types may also be specified using the **$merge**- and **$any**-modifiers.

## Merging Types

Type merging is used when wanting to build types in a structured manner, e.g. when having multiple different filters sharing commonalities. 

The filter-filter for merging is the following:

```javascript
// filter-filter for merging types
[ { $: null } ]
```

Note that **$** representes any number of entries (ref. later section on $) and **null** represents any type (ref. later section on null). In other words, merging requires an array of objects with any number of entries of any type. In case an empty array is merged, **null** is substituted in place. In case an array of one entry is merged, that entry itself is used.

Also note that only Object-typed filters may be merged.

```javascript
const ... // TODO
```

## Using any Type

Any (of multiple) types are used when wanting to provide flexibility, e.g. allowing a variety of types to be used, likely types convertible between one another. In case an empty array is specified, **null** is substituted in place. In case an array of one entry is specified, that entry itself is used.

The precompiled utility filter "Date" offers a good example hereof, it is defined as follows:

```javascript
// use of $any to provide flexibility in the Date utility filter
{ 
	$any: [ 
		Date, 
		{ 
			$type: String, 
			$transform: (context, string, next) => {
				string = new Date(string);
				if (string == 'Invalid Date') return next('%s is an invalid Date string');
				next(null, string);
			}
		}
	]
},
```

## Absence of Type

When using other $-modifiers, type is assumed null (any type) unless explicitly specified by one of **$type**, **$merge**, or **$any**. In other words, absence of type means any type,

Note that **$type**, **$merge**, and **$any** cannot be specified simultanuously, but they may be nested within eachother.

## Nesting Types

Types may be nested virtually deep. This comes in handy when merging types. 

The following filter defines an object with entry speed, a non-negative Number less than 3 or a corresponding text.

```javascript
// use of nested types
{
	speed: { 
		$any: [
			{
				$type: {
					$type: Number
					$gte: 0
				},
				$lt: 3
			},
			{
				$type: String,
				$in: [ 'slow', 'normal', 'fast' ]
			}
		] 
	}
}
```

# Using Modifiers

jsxl provides a variety of $-modifiers. 

The modifier filter-filter is listed below and described in further detail in following sub sections.

```javascript
{  
    $type:                       null, 
    $merge:                      [ { $: null } ], 
    $any:                        [ null ], 
    $remove:                     Boolean, 
    $insert:                     null,
    $default:                    null,
    $optional:                   Boolean,
    $map:                        { $any: [ Array, Object, Function ] },
    $parallel:                   Boolean,
    '$lt|$lte|$eq|$ne|$gte|$gt': null,
    '$in|$nin':                  { $any: [ [ null ], { $: null }, Function ] },
    '$inc|$ninc':                { $any: [ Boolean, Number, String, RegExp, Date, Function ] },
    $match:                      { $any: [ String, RegExp, Function ] },
    '$name|$constructor':        { $any: [ String, Function ] },
    '$length|$minlen|$maxlen':   { $any: [ Number, Function ] },
    $message:                    String,
    $rename:                     { $type: String, 
                                     $match: /^[_a-z][_a-z0-9\-]*$/i,
                                     $message: '%s is an invalid name', 
                                     $transform: (context, value, next) => {
                                         if (value === undefined) return next();            
                                         if (context.context === undefined || context.context.key.constructor !== String)
										     return next(cannotRename);
                                         next();
                                    }
                                },
    '$toArray|$toObject':       String,
    '$filter|$transform':       Function,
    $aux:                       null,
};
```

## Modifier $type

Use the $type-modifier only when other $-modifiers are needed. Otherwise the type may be specified directly.

```javascript
// numbers with and without the $type-modifier
{ 
	a: {
		$type: Number,
		$gt: 7 // this is a modifier
	},
	b: Number, // $type-modifier is not needed here
}
```

**Modifier filter is**

```javascript
$type: null
```

In theory, this means that $type-modifiers make hold any type. However, in practise, only the following type values are accepted, others are rejected with errors:

* RegExp
* String
* Boolean
* Number
* Date
* Function 
* Array of accepted type
* Object of accepted types
* null

## Modifier $merge

Use the $merge-modifier when constructing Object-type filters from multiple Object-type filters.

```javascript
// decorating (merging) the orders-filter with paging
const orders = {
	customer: String,
	type: String
};
const page = {
	offset: { $type: Number, $gte: 0 },
	length: { $type: Number, $gt: 0 }
};
const pagedOrders = {
	$merge: [
		orders, 
		page    
	]
}
```
The $merge-modifier must be of type Array of Object, each entry representing a filter component. In case an empty array is specified, null (any type) is substituted in place. In case an array of one type is specified, that type itself is used in place.

**Modifier filter is**

```javascript
$merge: [ { $: null } ]
```

## Modifier $any

Use the $any-modifier when specifying entries of alternative types.

```javascript
// alternative Numbers (Number or convertable String)
{
	number: {  
		$any: [ 
			Number, 
			{ 
				$type: String, 
				$transform: (context, string, next) => {
					string = Number(string);
					if (isNaN(string)) return next('%s is an invalid Number string');
					next(null, string);
				}
			}
		]
	}
}
```

The $any-modifier must be of type Array of null (any), each entry representing an alternative type. In case an empty array is specified, null (any type) is substituted in place. In case an array of one type is specified, that type itself is used in place.

### Modifer $remove

Use the $remove-modifier when wanting to remove input entries from output.

```javascript
// removing secrets
{
	secrets: { $remove: true }
}
```

The $remove-modifier must be of type Boolean (**true** or **false**).

Note the absence of the $type-modifier. Hence, secrets are of any type, which really doesnt matter since the secrets-entry is removed regardless.

### Modifer $insert

Use the $insert-modifier when wanting to override entries or insert upon undefined entries.

```javascript
// seeking orders per customer, open orders only
{
	state: { $insert: 'open' },
	id: String,
	$: { $remove: true }
}
```

The $insert-modifier may be of any type, including a Function. When of type Function, the $insert-modifier is called with arguments (context, entry, next).

```javascript
// seeking orders per customer, open orders only
{
	state: { $insert: (context, state, next) => next(null, 'open') },
	id: String,
	$: { $remove: true }
}
```

Either of the above filters may be applied to a full customer object and yield the following output query:

```javascript
{
	state: 'open',
	id: <customer-id>,
}
```
Note that state need not have a $type-modifier, it will be overridden/inserted regardless with the specified value. However, if the $insert-function cannot guarantee a String type, then specifing a String type may be advisable.

### Modifer $default

Use the $default-modifier when wanting to insert only upon undefined entries.

```javascript
// validating order
{
	delivery: { 
		$type: String,
		$in: [ 'express', 'priority', 'batch' ], 
		$default: 'priority'
	},
	// other order detail...
}
```

The $default-modifier may be of any type, including a Function. When of type Function, the $default-modifier is called with arguments (context, entry, next).

```javascript
// validating order
{
	delivery: { 
		$type: String,
		$in: [ 'express', 'priority', 'batch' ],
		$default: (context, delivery, next) => next(null, 'priority') 
	},
	// other order detail...
}
```

In either case, when orders are submitted without delivery specifications, they are defaulted to priority-delivery.

### Modifer $optional

Use the $optional-modifier when wanting to allow absence of certain entries.

```javascript
// validating customer address
{
	street: String,
	number: Number,
	extension: { $type: String, $optinal: true },
	floor:     { $type: String, $optinal: true },
	side:      { $type: String, $optinal: true }
}
```
The $optional-modifier must be of type Boolean (**true** or **false**).

### Modifer $map

Use the $map-modifier when wanting to map entries from String to object entry or from Number to array entry.

```javascript
// validating and mapping order on request
{
	delivery: { 
		$type: Number,
		$map: { express: 0, priority: 1, batch: 2 }, 
		$default: 'priority'
	},
	// other order detail...
}

// mapping order on response
{
	delivery: { 
		$type: String,
		$map: [ 'express', 'priority', 'batch' ] 
	},
	// other order detail...
}
```

Note that order delivery speeds are mapped from String to Number upon request and from Number to String upon response.

Also note that the $type-modifier specifies type of the mapped entry, not the entry itself. The entry itself is controlled by the $map-modifier, String if map is of type Object or Number if map is of type Array.

The $map-modifier may be of type Object, Array, or Function. When of type Function, the $map-modifier is called with arguments (context, entry, next).

```javascript
// validating and mapping order on request
{
	delivery: { 
		$type: Number,
		$map: (context, delivery, next) => next(null, { express: 0, priority: 1, batch: 2 }), 
		$default: 'priority'
	},
	// other order detail...
}

// mapping order on response
{
	delivery: { 
		$type: String,
		$map: (context, delivery, next) => next (null, [ 'express', 'priority', 'batch' ])
	},
	// other order detail...
}
```

### Modifer $parallel

Use the $parallel-modifier when wanting to optimize filtering objects or arrays which in turn have entries that filter by calling lengthy asynchronous services, e.g. disk i/o or web services.

```javascript
// example 8, processing an array in parallel
const request = require('request');
jsxl(
	{
		input: [ 'EUR', 'CHF', 'GBP' ]
	},
	{ 
		$type : [ { 
			$type: String, 
			$transform: (context, currency, next) => {
				request(`http://api.myexchange.io/USD/${currency}`, (err, res, body) => {
					if (err) 
						return next(`%s causes: ${err.message}`);
					if (res.statusCode != 200 ) 
						return next(`%s causes: http response ${res.statusCode}`);
					next(null, body[currency]);
				});
			}
		} ],
		$parallel: true
	},
	(err, output) => {
		console.log(output);
		// yields: [  0.85, 0.91, 0.77 ]
	}
);
```

### Modifers $lt, $lte, $eq, $ne, $gte, and $gt

Use any of the $lt-, $lte-, $eq-, $ne-, $gte-, or $gt-modifiers when wanting to compare entries to value boundaries.
 
```javascript
// validating various types
{
	number:  { $type: Number,  $gte: 0          }, // a non-negative number
	string:  { $type: String,  $ne: 'reserved'  }, // any string not reading 'reserved'
	date:    { $type: Date,    $lt:  new Date() }, // a past date
	boolean: { $type: Boolean, $eq:  true       }  // must be true
}
```

Comparisson modifiers may be of any type, including a Function. When of type Function, comparisson modifiers are called with arguments (context, entry, next).

```javascript
// validating various types
{
	number:  { $type: Number,  $gte: (context, number, next) => next(null, 0)          }, // a non-negative number
	string:  { $type: String,  $ne:  (context, number, next) => next(null, 'reserved') }, // any string not reading 'reserved'
	date:    { $type: Date,    $lt:  (context, number, next) => next(null, new Date()) }, // a past date
	boolean: { $type: Boolean, $eq:  (context, number, next) => next(null, true)       }  // must be true
}
```

### Modifers $in and $nin 

Use any of the $in- or $nin-modifiers when wanting to validate entries against array or object entries.

```javascript
// validating order, ensuring proper delivery and avoiding blacklisted customers
{
    delivery: { 
        $type: String,
        $in: [ 'express', 'priority', 'batch' ], 
    },
	customerId: {
		$type: String,
		$nin: (context, customerId, next) => Customer.findBlacklistedIds(next)
	}
    // other order detail...
}
```

$in- and $nin-modifiers may be of types Array, Object, or Function. When of type Function, $in- and $nin-modifiers are called with arguments (context, entry, next).

### Modifers $inc and $ninc 

Use any of the $inc- or $ninc-modifiers when wanting to validate array or object entries holding particular entries. Array entries are compared by value while objet enries are compared by key

```javascript
// validating with arrays and objects
{
    a: { 
        $type: [ String ], 
        $inc: 'A'
    },
	b: {
		$type: { $: Boolean },
		$inc: 'B'
	},
	notc: { 
        $type: [ String ], 
        $ninc: 'C'
    },
	notd: {
		$type: { $: Date },
		$ninc: 'D'
	}
}
```

The $inc- and $ninc-modifiers may be of types Boolean, Number, String, RegExp, Date, or Function. When of type Function, $in- and $nin-modifiers are called with arguments (context, entry, next).

The $inc- and $ninc-modifiers correspond to the $in- and $nin-modifiers repsectively, but with reverse inclusion detection. A $in B is similar to B $inc A whereas A $nin B is similar to B $ninc A.

### Modifer $match

Use the $match-modifier when wanting to String-match entries.

```javascript
// matching id againts valid Id-format
{
	id: { 
        $type: String, 
        $match: /^Id[0-9]{8}/
    }
}

```

The $match-modifier may be of types String, RegExp, or Function. When of type Function, the $match-modifier is called with arguments (context, entry, next).

```javascript
//  matching id againts valid Id-format
{
	id: { 
        $type: String, 
        $match: (context, id, next) => next(null, /^Id[0-9]{8}/)
    }
}
```

### Modifers $name and $constructor 

Use any of the $name- or $constructor-modifiers when wanting to validate entry name or entry constructor name.

```javascript
// matching plugin and plugin constructor names
{
	plugin: { 
        $name: 'BankOfAmerica',
        $constructor: 'BankPlugin'
    }
}
```

The $name- and $constructor-modifiers may be of types String or Function. When of type Function, the $name- and $constructor-modifiers are called with arguments (context, entry, next).

```javascript
// matching plugin and plugin constructor names
{
	plugin: { 
        $name: (context, plugin, next) => next(null, 'BankOfAmerica'),
        $constructor: (context, plugin, next) => next(null, 'BankPlugin'),
    }
}
```

Note that plugin need not have a $type-modifier, plugin type will be tested by means of the constructor name as opposed to the constructor function itself.

### Modifers $length, $minlen, and $maxlen 

Use any of the $length-, $minlen, or $maxlen-modifiers when wanting to validate entry lengths.

```javascript
// matching lengths of arrays
{
	short: { 
        $type: [ Number ],
        $maxlen: 6
    },
	exact: { 
        $type: [ Number ],
        $length: 7
    },
	long: { 
        $type: [ Number ],
        $minlen: 8
    }
}
```

The $length-, $minlen-, and $maxlen-modifiers may be of types Number or Function. When of type Function, the $length-, $minlen-, and $maxlen-modifiers are called with arguments (context, entry, next).

```javascript
// matching lengths of arrays
{
	short: { 
        $type: [ Number ],
        $maxlen: (context, short, next) => next(null, 6)
    },
	exact: { 
        $type: [ Number ],
        $length: (context, exact, next) => next(null, 7)
    },
	long: { 
        $type: [ Number ],
        $minlen: (context, long, next) => next(null, 8)
    }
}
```

### Modifer $message

Use the $message-modifier when wanting to override any the standard validation messages.

```javascript
// vaildating IP-address format
{
	ip: { 
        $type: String, 
        $match: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        $message: '%s must be a well-formed IP-address (0-255.0-255.0-255.0-255)'
    }
}
```

The $message-modifier must be of type String and must include a '%s' placeholder (preferable at the front) for the entry path.

### Modifer $rename

Use the $rename-modifier when wanting to rename input entries upon output.

```javascript
// renaming entry
{
	connect: { 
        $type: String, 
		$rename: 'base'
        $transform: (context, connect, next) => {
			MongoClient.connect(connect, next);
		}
    }
}
```

The $rename-modifier must be of type String.

### Modifer $toArray

Use the $toArray-modifier when wanting to convert an object-entry to an array-entry.

```javascript
// eaxmple 8, converting object to array
jsxl(
{
	input: {
		nyc: { city: 'New York City' },
		atl: { city: 'Atlanta' },
		chi: { city: 'Chicago' }
	}
},
{
	$type: {
		$: { 
	        city: String 
	    }
	},
	$toArray: 'initials'
},
(err, output) => {
	console.log(output);
	// yields: [ { city: 'New York City', initials: 'nyc' },
	//           { city: 'Atlanta', initials: 'atl' },
	//           { city: 'Chicago', initials: 'chi' } 
	//         ]
});
```

The $toArray-modifier must be of type String and must represent output sub entry keys consuming input entry keys.

### Modifer $toObject

Use the $toObject-modifier when wanting to convert an array-entry to an object-entry.

```javascript
// eaxmple 9, converting array to object
jsxl(
{
	input: [ { city: 'New York City', initials: 'nyc' },
             { city: 'Atlanta', initials: 'atl' },
             { city: 'Chicago', initials: 'chi' } 
           ]
},
{
	$type: [
		{ 
	        city: String,
	        initials: String
	    }
	],
	$toObject: 'initials'
},
(err, output) => {
	console.log(output);
	// yields: { nyc: { city: 'New York City' },
	//           atl: { city: 'Atlanta' },
	//           chi: { city: 'Chicago' } 
	//         }
});
```

The $toObject-modifier must be of type String and must represent input sub entry keys producing output entry keys .

### Modifer $filter

Use the $filter-modifier when wanting to filter out any entries.

```javascript
// filtering out disabled plugins
{
	plugins: [ {
		$type: { 
	        enabled: Boolean,
	        name: String,
			handler: Function
	    },
		$filter: (context, plugin, next) => {
			next(null, plugin.enabled);
		}
	} ]
}
```

The $filter-modifier must be of type Function and is called with arguments (context, entry, next). The $filter-modifier must return a boolean value, undefined and true means keep whereas false means discard.

### Modifer $transform

Use the $transform-modifier when wanting to transform any entries.

```javascript
// transforming entry from connection string to database connection
{
    redis: { 
        $type: String, 
        $transform: (context, connect, next) => {
            RedisClient.connect(connect, next);
        }
    }
}
```

The $transform-modifier must be of type Function and is called with arguments (context, entry, next). The $transform-modifier must return a the transformed value, undefined is interpreted as unchanged.

### Modifer $aux

Use the $aux-modifier when wanting to capture additional values in context to be referenced from child or successive sibling contexts.

```javascript
// transforming entry from connection string to database connection
{
    date: { 
        $type: String, 
        $transform: (context, date, next) => {
            next(null, new Date(date));
        },
		$aux: (context, date, next) => next(null, date) // keep original format
    }
}
```

The $aux-modifier may be of any type, including a Function. When of type Function, the $aux-modifier is called with arguments (context, entry, next).

# Method overview

jsxl provides the following methods described in following sub sections.

* inline
* compile
* compileMultiple
* execute
* useFilters
* merge

### Method inline

Use the inline method when wanting to compile and execute filters once only. The inline method has no explicit method but is called directly on the module.

```javascript
// example 9, compiling and executing filter once
jsxl(
    {
        input: 7
    },
    Number, // filter
    (err, output) => {
        console.log(output);
        // yields: 7
    }
);
```

**Method syntax is**

```javascript
jsxl(input, filter [, options ], function next(err [, output ] ))
```

**options** are yet to be described...

### Method compile

Use the compile method when wanting to compile filters once but execute multiple times.

```javascript
// example 10, compiling filter once
jsxl.compile(
    Number, // filter
    (err, filter) => {
        console.log(filter);
        // yields: [Function: Filter]
    }
);
```

**Method syntax is**

```javascript
jsxl.compile(filter [, options ], function next(err [, filter ] ))
```

**options** are yet to be described...

### Method compileMultiple

Use the compileMultiple method when wanting to compile multiple filters once but execute every filter multiple times.

```javascript
// example 11, compiling filter once
jsxl.compileMultiple(
	{
		number: Number, 
		string: String,
		date: Date
	}, // filters
    (err, filters) => {
        console.log(filters);
        // yields: {
		//             number: [Function: Filter]
		//             string: [Function: Filter]
		//             date: [Function: Filter]
		//         }
    }
);
```

**Method syntax is**

```javascript
jsxl.compileMultiple(filters [, options ], function next(err [, filters ] ))
```

**options** are yet to be described...

### Method execute

Use the execute method when wanting to compile filters once but execute multiple times.

```javascript
// example 12, compiling filter once
jsxl.execute(
    {
        input: 7
    },
    filter, // previously calculated in example 10
    (err, output) => {
        console.log(output);
        // yields: 7
    }
);
```

**Method syntax is**

```javascript
jsxl.execute(context, filter, function next(err [, output ] ))
```

### Method useFilters

Use the useFilters method when wanting to provide often used filtering patterns.

```javascript
// example 13, providing often used filtering patterns
jsxl.useFilters({
	IP: { 
        $type: String, 
        $match: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        $message: '%s must be a well-formed IP-address (0-255.0-255.0-255.0-255)'
    }
});
jsxl(
	{
		input: '127.1.1.1'
	},
	"IP",
	(err, output) => {
	console.log(output);
	// yields: '127.1.1.1'
});
```

Note that filter reference is a String litteral of the filter name, in this example "IP".

**Method syntax is**

```javascript
jsxl.useFilter(filters)
```

### Method merge 

Method merge performs a deep merge of two filters, a merge which understands jsxl $-modifiers and merges accordingly. Method merge is used internally when resolving $merge-modified filters. 

Use the merge method when wanting to merge two filters as an alternative to embedding the filters into a merged filter.

```javascript
// example 14, merging two filters
merged = jsxl.merge(filter1, filter2); 
// provides the same filtering effect as
merged = { 
	$merge: [
		filter1,
		filter2
	]
};
```

Method merge may aslo be used to simply deep merge two regular objects, they dont have to be filters.

**Method syntax is**

```javascript
jsxl.merge(filter1, filter2)
```

# Known Pitfalls

To be detailed...

* the compile/iterate scenario
* use of null, does not deep copy, hence output may overlap input