'use strict';
const async = require('async');
const Script = require('./script');
const utils = require('./utils');
const compiler1 = require('./compiler1');
const compiler2 = require('./compiler2');
const compiler3 = require('./compiler3');
const format = require('util').format;
const fs = require('fs');
const Context = require('./context');

// TODO
// improve mutual exclusion between modifers, a way to easily prevent modifiers from coexisting in filters

// TODO
// allow parameterized filters - see code commented out

// TODO
// change compileString into one parameterized compilation instead of many non-parameterized compilations, one per modifier combo, make modifiers arguments instead
// not sure current model even works where modifiers are functions...
// a new model must compile both static and functional modifiers into code...

// TODO 
// how to make module more extensible, e.g. plugable validators
// consider allowing auto casting of types, if new Type(input) works, then accept input
// this would remove need for StringNumber, StringDate, and StringBoolean types

// TODO
// add extensibility to simple comparisson modifiers

// TODO
// add $validate-modifier, allow only Function - short hand for validating in $transform

// TODO 
// provide access to config and other environment variables, e.g. _config: or context.env.config 

// TODO 
// look into necessity of use of $id, it seems to lead to multiple similar filter compilations with $id being the only difference

// TODO
// reconsider $args for scope

let v2;
let traceState;	
let startState;	
let trackState;	
let stopState;	
let verbose;
let testing = false;

//compilations							states						
//compile bootstrap with null			0-1
//compile bootstrap with bootstrap 		1-2
//compile jsxl with bootstrap			2-3
//compile jsxl with jsxl				3-4
if (testing) {
	v2 = true;		// v2 governs use of jxsl-based compilers (v2) over use of bootstrap compilers (v1) to outsiders.
	traceState = 0;	// must remain 0, will be changed to 1-4 if any previous intrinsic.js, the state of previous track
	startState = 0;	// must be 0-4, will be adjusted to 0 or traceState depending on startState being bigger or smaller than traceState
	trackState = 4;	// must be 0-4 and >= startState
	stopState  = 4;	// must be 1-4 and >= trackState
	verbose = true;
} else {
	v2 = true;		// v2 governs use of jxsl-based compilers (v2) over use of bootstrap compilers (v1) to outsiders.
	traceState = 0;	// must remain 0, will be changed to 1-4 if any previous intrinsic.js, the state of previous track
	startState = 0;	// must be 0-4, will be adjusted to 0 or traceState depending on startState being bigger or smaller than traceState
	trackState = 4;	// must be 0-4 and >= startState
	stopState  = 4;	// must be 1-4 and >= trackState
	verbose = false;
}

// disable v2 if jsxl compilers have not been prepared.
if (stopState < 3) v2 = false;
// stop compiling v2 if not requested
if (!v2) {
	trackState = Math.min(trackState, 2);
	stopState  = Math.min(stopState, 2);
}

module.exports = whenInitiated(v2 ? compiler2.inline : compiler1.inline);
module.exports.compile = whenInitiated(v2 ? compiler2.compile : compiler1.compile);
module.exports.compileMultiple = whenInitiated(v2 ? compiler2.compileMultiple : compiler1.compileMultiple);	
module.exports.execute = whenInitiated(utils.execute);

module.exports.merge = utils.merge;
module.exports.useFilters = useFilters; 									
module.exports.showIntrinsics = showIntrinsics;

// TODO - consider moving intrinsic filters into place in respective compile functions, using cached inline option


const Shell = (type) => ({ // for filtering modifiers filters
	$escape: {  
// TODO reeval $id			
		$id:							{ $optional: true, $type: String },	// used to transport id of filter, had no futher side effect
// TODO consider making more modifier types Functional like map or rename, allowing them to provide values dynamically
// TODO how do we type check Functional return values ?		
		$type:							{ $optional: true, $type: type }, // require listed type
		'$any+$switch':					{ $optional: true, $type: [ type ] }, // require any of listed types
		
		$remove:						{ $optional: true, $type: Boolean }, // remove item from target
		$insert:						{ $optional: true, $type: null },	// insert item to target, if function, then to be executed at runtime time with parameters
		$default:						{ $optional: true, $type: null },	// if source is undefined, then insert item into target, if function, then to be executed at runtime time with parameters
		$map:							{ $optional: true, $any: [ Function, Array, Object ] }, 	// translate from key to entry,  if source is undefined, if function, then to be executed at runtime time with parameters
		$optional:						{ $optional: true, $type: Boolean }, // accept if source is undefined

		$parallel:						{ $optional: true, $type: Boolean }, // run array or object filtering in parallel as opposed to in series

		$message:						{ $optional: true, $type: String }, // custom message for any failed assertion
		'$lt+$lte+$eq+$ne+$gte+$gt':	{ $optional: true, $type: null }, // assertions, item is compared, if function, then to be executed at runtime time with parameters
		'$in+$nin':						{ $optional: true, $any: [ Function, Array, Object ] }, // assertions, all items are related in a lean way, possibly mattching if RegExp is provided, if function, then to be executed at runtime time with parameters
		'$inc+$ninc':					{ $optional: true, $any: [ Function, Boolean, Number, String, RegExp, Date ] }, // assertions, all items are related in a lean way, possibly mattching if RegExp is provided, if function, then to be executed at runtime time with parameters
		$match:							{ $optional: true, $any: [ Function, String, RegExp ] }, // assertion, item is mattched, if function, then to be executed at runtime time with parameters
		'$name+$constructor':			{ $optional: true, $any: [ Function, String ] }, // assertion, item name constructor name is compared, if function, then to be executed at runtime time with parameters
		'$length+$minlen+$maxlen':		{ $optional: true, $any: [ Function, Number ] }, // assertions, item length is compared, if function, then to be executed at runtime time with parameters

		$rename: 						{ $optional: true, $any: [ Function, String ] }, // rename target item
										
		'$toArray+$toObject':			{ $optional: true, $type: String }, // switch between array and object, use modifier value as key
		'$filter+$transform+$final':	{ $optional: true, $type: Function }, // filter next(err, keep), transform next(err, value), and final next(err) 
		
		$args:							{ $optional: true, $type: null }, // allow values to be carried down
		
		$: 								{ $optional: true, $type: null } // added to allow filtering any object to seek modifiers
	} 
});

utils.systemFilters = {
// TODO consider pushing all intrinsic types into here for lazy compilation and remove the initial waiting...

	Type1: { $any: [
		Array, 	// same as [    null ] 
		Object, // same as { $: null }
		String,	// named precompiled filters
		{ $type: Function, $transform: (context, type, next) => {
// TODO use "Filter" type instead			
			if (utils.isFilter(type)) return next('cannot be recompiled'); 
// TODO could we keep and call compiled filter as opposed to just not compile it
			next();
		}},
		{ $transform: (context, type, next) => { //
			if (type === undefined || type == null) return next(null, null); 
			next(`holds type not supported (${type})`);
		}} 
	]},
	Shell1: Shell('Type1'),
	Object1: { // for filtering unmodified object filters
		$: 'Type1'	
	},
	Array1: { // for filtering array filters
		$filter: (context, filter, next) => {
			if (filter.length > 1) context.source[context.key] = [ utils.merge(...filter) ];
			next(null, true);
		},
		$type: [ 'Type1' ],
		$minlen: 1
	},
	Type2: {
		$filter: (context, filter, next) => {
			const parentKey = context.context && context.context.key;
			const parentFilter = parentKey !== undefined && context.context.source[parentKey];
			// delete modifiers if parent context is a true Object (not a shell) or a true Array (not defining $any or $switch)
			if ((utils.isObject(parentFilter) && (!utils.overlap(Object.keys(parentFilter), utils.modifiers) || context.key == '$escape')) ||
		    	(utils.isArray(parentFilter) && !['$any', '$switch'].includes(parentKey))) {
				context.setScopeEntry('modifiers', {});
			}
			next();
		},
		$switch: [ 
			// string 
			{ 
				$filter: (context, filter, next) => next(null, utils.isType(filter, String)),
				$type: String, 
				$transform: (context, filter, next) => compiler2.compileString(context, next), 
			}, 
			// escape
			{
				$filter: (context, filter, next) => {
					if (utils.isObject(filter) && '$escape' in filter) {
						if (Object.keys(filter).length > 1) return next(new Error(`${context.fullpath()} mixes $escape with other attributes`));
						return next(null, true);
					}
					next(null, false);
				},
				$type: { $escape: { $: 'Type2' }}, 
				$transform: (context, filter, next) => next(null, filter.$escape),
			},
			// shell
			{ 
				$filter: (context, filter, next) => {
					if (utils.isObject(filter) && (utils.overlap(Object.keys(filter), utils.modifiers) && context.key != '$escape')) { 
						
						// create a working copy of modifiers, this allows inheritance but avoids sibling override
						context.scope.modifiers = Object.assign({}, context.scope.modifiers); 
						
						function collectModifiers(entry, key, next) {
							const keys = key.split(/[\|\+]/).map(key => key.trim());
							async.mapSeries(keys, (key, next) => {
								if (utils.isModifier(key)) {
									context.scope.modified = context.scope.modified || key;
									if ([ '$type', '$any', '$switch', '$filter', '$transform', '$final' ].includes(key)) return next(); 
									context.scope.modifiers[key] = entry;
								} else
									context.scope.nonModified = context.scope.nonModified || key;
								next();
							}, err => { if (err) return next(err);
								if (context.scope.modified && context.scope.nonModified) {
									return next(`mixes modifier (${context.scope.modified}) with non-modifier (${context.scope.nonModified})`); // TODO message needs work, %s/context.fullpath() is one tooo deep
								}
								next();
							});
						}

						(next => {
							async.forEachOfSeries(filter, collectModifiers, next);
						})(err => { if (err) return next(err);

							switch(('$type' in filter ? 1 : 0) + ('$any' in filter ? 2 : 0) + ('$switch' in filter ? 4 : 0)) {
							case 0: // pre-compile implicit $type
								context.source[context.key].$type = null;  // TODO this possibly overrides source, we must forward new source through $filter instead
								return next(null, true);
							case 1:
							case 2:
							case 4:
								return next(null, true);
							default: // catch multiple types
								return next('holds multiple of $type, $any, or $switch modifiers');
							}
						});
					}
					else {
						next(null, false);
					}
				},
				$type: 'Shell2', 
				$transform: (context, filter, next) => compiler2.compileShell(context, next), 
			}, 
			// function 
			{ 
				$filter: (context, filter, next) => next(null, utils.isFunction(filter)),
				$type: Function, 
				$transform: (context, filter, next) => utils.isFilter(filter) ?
					next('cannot be recompiled') : // TODO could we keep and call compiled filter as opposed to just not compile it
					compiler2.compileFunction(context, next)
			},
			// object 
			{ 
				$filter: (context, filter, next) => next(null, utils.isObject(filter)),
				$type: { $: 'Type2' }, 
				$transform: (context, filter, next) => compiler2.compileObject(context, next),
			}, 
			// array 
			{ 
				$filter: (context, filter, next) => { 
					if (! utils.isArray(filter)) return next(null, false);
					if (filter.length > 1) context.source[context.key] = [ utils.merge(...filter) ];
					next(null, true);
				},
				$type: [ 'Type2' ],
				$minlen: 1,
				$transform: (context, filter, next) => compiler2.compileArray(context, next),
			},
			// null 
			{ 
				//$filter: (context, filter, next) => next(null, true),
				//$type: null, 
				$transform: (context, filter, next) => { 
					(filter === null) ? 
					compiler2.compileFunction(context, next) :
					next(`holds type not supported (${filter})`)
				}
			} 
		]
	},
	Shell2: Shell('Type2'),
	Filter: { $any: [
		{ $type: Function, $transform: (context, filter, next) => next(utils.isFilter(filter) ? null : 'is not a filter')},
		{ $transform: (context, filter, next) => { 
			module.exports.compile(filter, { key: context.key }, next) 
		}}
	]},
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
	]},
	Number: {  $any: [ 
		Number, 
		{ 
			$type: String, 
			$transform: (context, string, next) => {
				string = Number(string);
				if (isNaN(string)) return next('is an invalid Number string');
				next(null, string);
			}
		}
	]},
	IntNumber: {  $any: [ 
		Number, 
		{ 
			$type: String, 
			$transform: (context, string, next) => {
				string = Number(string.replace('.', '\n').replace(',', '.').replace('\n', ','));
				if (isNaN(string)) return next('is an invalid Number string');
				next(null, string);
			}
		}
	]},
	Date: {  $any: [ 
		Date, 
		{ 
			$type: String, 
			$transform: (context, string, next) => {
				string = new Date(string);
				if (string == 'Invalid Date') return next('is an invalid Date string');
				next(null, string);
			}
		}
	]},
	RegExp: {  $any: [ 
		RegExp, 
		{ 
			$type: String, 
			$transform: (context, string, next) => {
				try { return next(null, RegExp(string)); } catch (err) { }
				next('is an invalid RegExp string');
			}
		}
	]},
};



//
// collect all modifiers from shell filter
//
Object.keys(utils.systemFilters.Shell2.$escape).map(modifier => {
	modifier.split(/[\|\+]/).map(modifier => modifier.trim()).map(modifier => {
		if (modifier != '$') utils.modifiers.push(modifier);
	});
});

function useFilters(filters) {
	Object.assign(utils.staticFilters, filters);
}

//
// wrap externally accessible compilers in whenInitiated, allowing compilers to first self-compile
//
var initiated = false;
function untilInitiated(next) {
	if (initiated) return next();
	setTimeout(() => untilInitiated(next), 100);
}
function whenInitiated(func) {
	return (...args) => initiated ? func(...args) : untilInitiated(() => func(...args));
}

//
// store intrinsic filters
//
function storeIntrinsics(intrinsic, state, version, compiler, compilee, next) { 
	let code = 
		`'use strict';\n` + 
		`// ${compilee}-filters compiled with ${compiler}-filters on ${new Date}\n` +
		`const format = require('util').format;\n`+
		`const async = require('async');\n` +
		`const utils = require('./utils');\n` +
		`const Context = require('./context');\n` +
		`const compiler${version} = require('./compiler${version}');\n` +
		`const filter = module.exports.filter = {};\n` +
		`module.exports.state = ${state};\n`;
	Object.keys(intrinsic.filter).map(key => code += 
		`\n` +
		`Object.assign(filter, { '${key}':\n\t${intrinsic.filter[key]}\n});\n` + 
		`filter['${key}'].functions = ${intrinsic.filter[key].functions.length == 0 ? '[]' : '[\n\t\t' + intrinsic.filter[key].functions + '\n]'};\n` +
		`filter['${key}'].timestamp = ${intrinsic.filter[key].timestamp};\n` + 
		`filter['${key}'].compiler  = '${intrinsic.filter[key].compiler}';\n`  
	); 
	code += 
		`\n` +
		`module.exports.timestamp = ${Date.now()};\n`;
		
	fs.writeFile(__dirname + '/intrinsic.js', code, 'UTF-8', err => { if (err) return next(err);
		if (verbose) console.log('jsxl: stored filters in state ' + state);
		next(null);
	})
}

//
// show intrinsic filters
//
function showIntrinsics() {
	if (verbose) {
		console.log('jsxl: no of filters:', Object.keys(utils.intrinsic.filter).length);
		Object.keys(utils.intrinsic.filter).sort().map(key => console.log('jsxl:', new Date(utils.intrinsic.filter[key].timestamp), utils.intrinsic.filter[key].compiler, utils.intrinsic.filter[key].name ))
	}
}

const filters1 = {
	type1: 'Type1',
	shell1: 'Shell1',
	object1: 'Object1',
	array1: 'Array1',
};
const filters2 = {
	type2: 'Type2',		
};

//
// initiate module, compile and/or resuse previously compiled intrinsic filters
//
async.waterfall([
	next => {
		// load previously tracked intrinsic filters, if any, and deduce traceState
		try {
			utils.intrinsic = require('./intrinsic.js');
			traceState = utils.intrinsic.state;
		} catch (err) {
			if (verbose) console.log(`jsxl: error loading filters: ${err.message}`);
		}
		if (verbose) console.log(`jsxl: loaded filters in trace state ${traceState}`);
		
		if (startState < traceState) {
			startState = 0;
			utils.intrinsic = { filter: {} };
		}
		else startState = traceState;
		
		if (verbose) console.log(`jsxl: compiling filters from start state ${startState}`);
		
		showIntrinsics();
		next(null);
	},
	
// TODO consider how to remove filters no longer in use once used for compiling better filters
// or ignore because this only happens when recompiling good filters stored to intrinsic.js	
	
	next => { // 0 - 1
		if (startState > 0 || stopState < 1) return next(null);
		if (verbose) console.log('jsxl: compile bootstrap-filters with null-filters, states 0 - 1');	
		compiler1.compileMultiple(filters1, (err, filters) => { if (err) return next(err);
			Object.assign(utils.intrinsic.filter, filters);
			utils.intrinsic.timestamp = Date.now();
			showIntrinsics();
			next(null);
		});
	},
	next => {
		if (startState > 0 || stopState < 1 || trackState != 1) return next(null);
		storeIntrinsics(utils.intrinsic, 1, 1, 'null', 'bootstrap', next);
	},
	next => {
		if (startState > 1 || stopState < 2) return next(null);
		if (verbose) console.log('jsxl: compile bootstrap-filters with bootstrap-filters, states 1 - 2 (run 1)');	
		compiler1.compileMultiple(filters1, (err, filters) => { if (err) return next(err);
			Object.assign(utils.intrinsic.filter, filters);
			utils.intrinsic.timestamp = Date.now();
			showIntrinsics();
			next(null);
		});
	},
	next => {
		if (startState > 1 || stopState < 2) return next(null);
		if (verbose) console.log('jsxl: compile bootstrap-filters with bootstrap-filters, states 1 - 2 (run 2)');	
		compiler1.compileMultiple(filters1, (err, filters) => { if (err) return next(err);
			Object.assign(utils.intrinsic.filter, filters);
			utils.intrinsic.timestamp = Date.now();
			showIntrinsics();
			next(null);
		});
	},
	next => {
		if (startState > 1 || stopState < 2 || trackState != 2) return next(null);
		storeIntrinsics(utils.intrinsic, 2, 1, 'bootstrap', 'bootstrap', next);
	},
	next => {
		if (startState > 2 || stopState < 3) return next(null);
		if (verbose) console.log('jsxl: compile jsxl-filters with bootstrap-filters, states 2 - 3');	
		compiler1.compileMultiple(filters2, (err, filters) => { if (err) return next(err);
			Object.assign(utils.intrinsic.filter, filters);
			utils.intrinsic.timestamp = Date.now();
			showIntrinsics();
			next(null);
		});
	},
	next => {
		if (startState > 2 || stopState < 3 || trackState != 3) return next(null);
		storeIntrinsics(utils.intrinsic, 3, 2, 'bootstrap', 'jsxl', next);
	},
	next => {
		if (startState > 3 || stopState < 4) return next(null);
		if (verbose) console.log('jsxl: compile jsxl-filters with jsxl-filters, states 3 - 4 (run 1)');	
		compiler2.compileMultiple(filters2, (err, filters) => { if (err) return next(err);
			Object.assign(utils.intrinsic.filter, filters);
			utils.intrinsic.timestamp = Date.now();
			showIntrinsics();
			next(null);
		});
	},
	next => {
		if (startState > 3 || stopState < 4) return next(null);
		if (verbose) console.log('jsxl: compile jsxl-filters with jsxl-filters, states 3 - 4 (run 2)');	
		compiler2.compileMultiple(filters2, (err, filters) => { if (err) return next(err);
			Object.assign(utils.intrinsic.filter, filters);
			utils.intrinsic.timestamp = Date.now();
			showIntrinsics();
			next(null);
		});
	},
	next => {
		if (startState > 3 || stopState < 4 || trackState != 4) return next(null);
		storeIntrinsics(utils.intrinsic, 4, 2, 'jsxl', 'jsxl', next);
	},
	// signal inititaion is complete
	next => next(null, initiated = true)
], err => {
	if (err) throw err; // new Error(`Compiling jsxl intrinsic filters: ${err.message}`);
	else if (verbose) console.log('jsxl: now initiated...');
	//process.exit();
});


//********************************************************************************************************

// TESTING

//***************************************************************************************************** TODO

const jsxl = module.exports;

const x = {
	a: {
		$type: Number,
		$rename: 'aa' 
	},
	b: {
		$type: { $type: Number },
		$rename: 'bb' 
	},
	c: {
		$type: { x: Number },
		$rename: 'cc' 
	},
	d: {
		$type: { $type: { x: Number }},
		$rename: 'dd' 
	},
	e: {
		$type: [ Number ],
		$rename: 'ee' 
	},
	f: {
		$type: { $type: [ Number ]},
		$rename: 'ff' 
	},
};
const v = {
	a: 1,
	b: 2,
	c: { x: 3 },
	d: { x: 4 },
	e: [ 5 ],
	f: [ 6 ]
}

if (false) whenInitiated(jsxl)(
	{
		input: v
	},
	x,
	{ inspect: true },
	(err, result) => {
		console.log(err, result);
		process.exit();
	}
);


const basic = (type) => { return {
	mask:  { $type: type } 
}};
if (false) whenInitiated(jsxl)({
	input: {
		a: {
			b: { mask: 6 },
			c: { mask: '7' }
		}, 
		d: {
			e: { mask: 8 },
			f: { mask: '9' }
		} 
	}},
	{ // filter
		$: {
			$: {
				$any: [ basic(Number), basic(String) ], 
//				$any: [ { mask:  { $type: Number } } ], 
				$rename: (context, x, next) => next(null, `X${context.key}`) 
			}
		}
	},
	{ inspect: true },
	(err, result) => {
		console.log(err, result);
		process.exit();
	}
);

if (false) whenInitiated(jsxl)({
	input: {
		a: 5 
	}},
	{ // filter
		a: {$type: Number, $transform: (context, a, next) => {
			next('has error');
		}}
	}, 
	(err, result) => {
		console.log(err, result);
		process.exit();
	}
);

if (false) whenInitiated(jsxl)({
	input: {
		array1: [ { a: 1, b: 'x' }, { a: 2, b: 'y' }, { a: 3, b: 'z' } ],
		array2: [ 4, 5, 6 ],
	}},
	{ // filter
		array1: [ { a: Number }, { b: String } ],
		array2: [ Number ],
	}, 
	(err, result) => {
		console.log(err, result);
		process.exit();
	}
);


if (false) whenInitiated(jsxl.compile)({ 
//	$any: [ String, Number ]
	$switch: [{
		$filter: (context, filter, next) => next(null, utils.isType(filter, String)),
		$type: String, 
		$transform: (context, filter, next) => next(), 
	}, {
		$filter: (context, filter, next) => next(null, utils.isType(filter, Number)),
		$type: Number, 
		$transform: (context, filter, next) => next(), 
	}],
//	$switch: [{
//		$filter: (context, filter, next) => next(null, utils.isType(filter, String)),
//		$type: String, 
//		$transform: (context, filter, next) => next(), 
//	}, {
//		$filter: (context, filter, next) => next(null, utils.isType(filter, Number)),
//		$type: Number, 
//		$transform: (context, filter, next) => next(), 
//	}]
}, { key: 'noname' , inspect: true }, (err, filter) => {
	jsxl.execute({
		source: {
			applications: 33
		},
		key: 'applications'
	}, filter, (err, result) => {
		console.log(7070, err, result);
		process.exit();
	});
});

if (false) whenInitiated(jsxl)({
	source: {
		applications: 1
	},
	key: 'applications'
}, { 
	$any: [ String, Number ]
}, { key: 'noname' , inspect: true }, (err, result) => {
	console.log(7070, err, result);
	process.exit();
});

if (false) whenInitiated(jsxl)({
	source: {
		applications: {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
		}
	},
	key: 'applications'
}, { 
	c: {
		$filter: (context, elem, next) => next(null, context.key == 'c'),
		$type: Number
	},
//	b: {
//		$filter: (context, elem, next) => next(null, context.key == 'b'),
//		$type: Number
//	},
	a		: {
		$filter: (context, elem, next) => next(null, context.key == 'a'),
		$type: Number
	},
	$: {
		$filter: (context, elem, next) => next(null, context.key == 'b'),
		$type: Number,
		$transform: (context, elem, next) => {
			console.log(6666, context.key);
			next();
		}
	}
}, { key: 'noname' , inspect: true }, (err, result) => {
	console.log(7070, err, result);
	process.exit();
});

if (false) whenInitiated(jsxl)({
	source: {
		applications: {
			x: 'ddd'
		}
	},
	key: 'applications'
}, { 
	x: {  $type: String, $remove: 0 },

	
}, { key: 'noname' , inspect: true }, (err, result) => {
	console.log(err, result);
	//process.exit();
});


const XXX = { $any: [
	Array, 	// same as [    null ] 
	Object, // same as { $: null }
	{ $type: Function, $transform: (context, type, next) => {
//TODO use "Filter" type instead	
		if (utils.isFilter(type)) return next('cannot be recompiled'); 
//TODO could we keep and call compiled filter as opposed to just not compile it
		next();
	}},	
	String,	// named precompiled filters
	{ $type: null, $transform: (context, type, next) => { //
		if (type === undefined || type == null) return next(null, null); 
		next(`holds type not supported (${type})`);
	}} 
]};

if (false) whenInitiated(jsxl)({
	source: {
		data: Number
	},
	key: 'data'
}, XXX, { key: 'noname' , inspect: true }, (err, result) => {
	console.log(err, result);
	//process.exit();
});



if (false) whenInitiated(jsxl)({
	source: {
		xyz: { 
			time: '12:00',
			date: '23-12-2020'
		}
	},
	key: 'xyz'
}, { // ,  $rename: 'timestamp'
	time: { $type: String, $rename: 'timestamp2' },
	date: { $type: 'Moment', $rename: 'timestamp', $optional: true, $args: { timezone: 'Europe/Athens', format: 'DD-MM-YYYY' } },
//	date: String
}, { key: 'noname' , inspect: true }, (err, result) => {
	console.log(err, result);
	//process.exit();
});


if (false) whenInitiated(jsxl)({
	source: {
		applications: {
			//roles: { x: true, y: true }
		}
	},
	key: 'applications'
}, { 
	//$type: {    
		roles: { $optional: true, $type: { $: Boolean }},
	//},
}, { key: 'noname' , inspect: true }, (err, result) => {
	console.log(err, result);
	//process.exit();
});

if (false) whenInitiated(jsxl)({ 
	source: {
		applications: ['a', 'b', 'c']
	},
	key: 'applications'
}, { 
    $optional: true, 
    $type: [{ 
    	$type: String,
    	$transform: (context, s, next) => next(null, { name: s, s })
    }], 
	$toObject: 'name', 
	$transform: (context, applications, next) => {
		console.log('done', context);
		return next(null);
	}
}, { key: 'test7', inspect: true}, (err, result) => {
	console.log(err, result);
	process.exit();
})

const input0 = { 
	registry: { 
		x: 'REGISTRY' 
	}
};

const filter0 = { 
	$type: { 
		registry: {
			$rename: 'registry2',
			$type: {
				x: {
					$rename: 'x2',
					$type: String,
					$transform: (context, x, next) => {
						next(null, x);
					}
				} 
			},
		}, 
	},
	$rename: 'y2'
};

const input = [ 
	{ city: 'New York City', initials: 'nyc' },
    { city: 'Atlanta', initials: 'atl' },
    { city: 'Chicago', initials: 'chi' } 
];
const filter = {
    $type: [
        { 
            city: String,
            initials: String
        }
    ],
    $toObject: 'initials'
};

//jsxl.compile // compiler2.compile 
if (false) whenInitiated(jsxl.compile)(filter, { key: 'test1' }, (err, compiled) => {
	if (err) {
		console.log(2222, err);
		process.exit();
	}
	else {
		jsxl.execute({ input }, compiled, (err, output) => {
			if (false) process.exit();

			else
				compiler2.compile(filter, { key: 'test2' }, (err, compiled) => {
					if (err) {
						console.log(5555, err);
						process.exit();
					}
					else {
						jsxl.execute({ input }, compiled, (err, output) => {
							console.log(7777, err, output);
							
							if (false) process.exit();
							
						});
					}
				});
		});
	}
});


const storm = {
	a: 1,
	b: 2,
	c: 3,
	d: 4
};
const input1 = {
		source: { Storm: storm },
//		target: { Storm: storm },
	key: 'Storm'
};

if (false) whenInitiated(jsxl)(input1, {
	a: { 
		$type: Number, 
//		$rename: 'a2', 
		$insert: 11,
		$transform: (context, a, next) => {
console.log(1, context);
			next(null, a + 10);
		}
	},
	b: { 
		$type: Number, 
		$rename: 'b2', 
		$insert: 12,
		$transform: (context, b, next) => {
console.log(2, context.context, context);
			next(null, b + 10);
		}
	},
	c: { 
		$type: Number, 
//		$rename: 'c2', 
		$insert: 13,
		$transform: (context, c, next) => {
console.log(3, context);
			next(null, c + 10);
		}
	},
	d: { 
		$type: Number, 
//		$rename: 'd2', 
		$insert: 14,
		$transform: (context, d, next) => {
console.log(4, context);
			//return next(null, d + 10);
			next(null, d + 10, (context, d, next) => {
console.log(41, context);
				next(null, d + 10);
			});
		}
	},
	
}, {
	inspect: 'c:/junk/x.js',
	key: 'start'
}, (err, res) => { 
	console.log('-------');
	console.log(8888);
	if (err) console.log(err.message);
	else console.log(JSON.stringify(res, null, 4));
	console.log(JSON.stringify(input1, null, 4));
	
	process.exit();
});

const t1 = { 
	$type: Number, 
	$gt: 1, 
	$lt: 7, 
	$filter: (a,b,next) => next(), 
	$transform: (a,b,next) => next(), 
};
const RedisClient = function RedisClient() {};


//const options = {
//	"a": { 
//		"protocol": "mongodb",
//		"base": "coins8101"
//	}
//}
//
//const mongoType = { 
//	protocol: { $type: String, $default: 'mongodb' },
//	base: String,
//};
//
//const input1 = {
//	source: { Storm: options },
//	key: 'Storm'
//};
//const input2 = {
//	Storm: options	
//}

if (false) whenInitiated(jsxl)(input1, {
	a: {
		$type: { 
    		protocol: { $type: String, $insert: 'y' }, 
    		register: { $type: Boolean, $default: true },
    		base: String,
    	},
		$rename: 'b',
	}
}, {
	inspect: 'c:/junk/x.js',
	key: 'start'
}, (msg, res) => { if (msg) throw new Error(msg);
	console.log('-------');
	console.log(8888);
	console.log(JSON.stringify(res, null, 4));
	console.log(JSON.stringify(input1, null, 4));
	
	//process.exit();
});






if (false) whenInitiated(jsxl.compile)({ 
	
	registry: {
//		$rename: 'renamed',
		$type: {
			redis: RedisClient  
		},
		$transform: (context, registry, next) => {
			console.log(4, context);
			next();
		}
	}, 
//	next: {
//		a: Number,								
//		b: { $type: Number, $rename: 'b2' },
//		c: { $type: { d: Number } , $rename: 'c2' },
//		e: { $type: { f: { $type: Number, $rename: 'f2' } } , $rename: 'e2' },
//	}
	
}, {
	key: 'test'
}, (err, filter) => {
	if (err) {
		console.log(7777, err);
		process.exit();
	}
	else {
		console.log(109);
		//process.exit();
		jsxl.execute({
			input: { registry: { redis: new RedisClient() }}
		
//			input: { c: { b : { a: 7 } } },
//			input: { rose: 12, alex: 7, olli: 12 }
//			input: { axel: 5, rose: 6, end: [ 4,5,6,7]}
//			input: { 
//				b: [ 0, 1, 2 ],
//				c: { x: 1, y: 0, z: 1}
//			}
		},
		filter,
		(err, output) => {
			console.log(9999, err, output);
			process.exit();
		});
	}
});



//jsxl(
//	    {
//	        input: {
//	        	a: Number
//	        }
//	    },
//	    'Type', // filter
//	    (err, output) => {
//	        console.log(output);
//	        // yields: [ { number: 7 }, { number: 8 }, { number: 9 } ]
//	    }
//	);

//jsxl.useFilters({
//	TEST: { $any: [ 
////		{ $type: Function, $name: 'RegExp' },
//		{ $type: Function, $name: 'String' },
////		{ $type: Function, $name: 'Boolean' },
////		{ $type: Function, $name: 'Number' },
//		{ $type: Function, $name: 'Date' },
////		[ null ], 
////		{ $: null }, 
//		null,
//		{ $type: null, $transform: (context, type, next) => {
//			console.log(1002, type);
//			return next();
//			//return next();
//			next('has bug !!!');
//		}} 
//	]}
//});
//
//
//jsxl.compile('TEST',(err, filter) => {
//	console.log(err, filter);
//});

//jsxl.compile(4, (err, filter) => {
//	console.log(err, filter);
//});

//jsxl.execute({
//	//input: { a: 7, b: 's' }
//}, undefined,(err, output) => {
//	console.log(err, output);
//});
