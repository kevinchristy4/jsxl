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
// rename a scaler should not be possible, but we use it in filters. So OK. 
// But then when filter is used directly in array, we are in fact renaming array entry, which is bad and does not work
// how to resolve ?

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
	v2 = false;		// v2 governs use of jxsl-based compilers (v2) over use of bootstrap compilers (v1) to outsiders.
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
		$id:							{ $optional: true, $type: String },						// used to transport id of filter, had no futher side effect
// TODO consider making more modifier types Functional like map or rename, allowing them to provide values dynamically
// TODO how do we type check Functional return values ?		
		$type:							{ $optional: true, $type: type }, 						// require listed type
		'$any+$switch':					{ $optional: true, $type: [ type ] }, 					// require any of listed types
		
		$remove:						{ $optional: true, $type: Boolean }, 					// remove item from target
		$insert:						{ $optional: true, $type: null },						// (Function) insert item to target, if function, then to be executed at runtime time with parameters
		$default:						{ $optional: true, $type: null },						// (Function) if source is undefined, then insert item into target, if function, then to be executed at runtime time with parameters
		$map:							{ $optional: true, $any: [ Function, Array, Object ] }, // translate from key to entry,  if source is undefined, if function, then to be executed at runtime time with parameters
		$optional:						{ $optional: true, $type: Boolean }, 					// accept if source is undefined

		$parallel:						{ $optional: true, $type: Boolean }, 					// run array or object filtering in parallel as opposed to in series

		$message:						{ $optional: true, $type: String }, 					// custom message for any failed assertion
		'$lt+$lte+$eq+$ne+$gte+$gt':	{ $optional: true, $type: null }, 						// (Function) assertions, item is compared, if function, then to be executed at runtime time with parameters
		'$in+$nin':						{ $optional: true, $any: [ Function, Array, Object ] }, // assertions, all items are related in a lean way, possibly mattching if RegExp is provided, if function, then to be executed at runtime time with parameters
		'$inc+$ninc':					{ $optional: true, $any: [ Function, Boolean, Number, String, RegExp, Date ] }, // assertions, all items are related in a lean way, possibly mattching if RegExp is provided, if function, then to be executed at runtime time with parameters
		$match:							{ $optional: true, $any: [ Function, String, RegExp ] }, // assertion, item is mattched, if function, then to be executed at runtime time with parameters
		'$name+$constructor':			{ $optional: true, $any: [ Function, String ] }, 		// assertion, item name constructor name is compared, if function, then to be executed at runtime time with parameters
		'$length+$minlen+$maxlen':		{ $optional: true, $any: [ Function, Number ] }, 		// assertions, item length is compared, if function, then to be executed at runtime time with parameters

		$rename: 						{ $optional: true, $any: [ Function, String ] }, 		// rename target item
										
		'$toArray+$toObject':			{ $optional: true, $type: String }, 					// switch between array and object, use modifier value as key
		'$filter+$transform+$final':	{ $optional: true, $type: Function }, 					// filter next(err, keep), transform next(err, value), and final next(err) 
		
		$scope:							{ $optional: true, $type: null }, 						// (Function) allow values to be carried down
		
		$: 								{ $optional: true, $type: null } 						// added to allow filtering any object to seek modifiers
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
				$filter: (context, filter, next) => next(null, utils.isType(filter, 'String')),
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
							if (context.scope.modifiers.$rename && context.scope.inside == 'array') return next(new Error(`.$rename cannot rename when inside array`))

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
				$transform: (context, filter, next) => compiler2.compileFunction(context, next)
			},
			// object 
			{ 
				$filter: (context, filter, next) => next(null, utils.isObject(filter)),
				$scope: { inside: 'object' },
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
				$scope: { inside: 'array' },
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
					next(`holds unsupported value, must be one of Boolean, Number, String, RegExp, Date, Array, [], Object, {}, or Function`)
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
		`Object.assign(filter, { ${JSON.stringify(key)}:\n\t${intrinsic.filter[key]}\n});\n` + 
		`filter[${JSON.stringify(key)}].functions = ${intrinsic.filter[key].functions.length == 0 ? '[]' : '[\n\t\t' + intrinsic.filter[key].functions + '\n]'};\n` +
		`filter[${JSON.stringify(key)}].timestamp = ${intrinsic.filter[key].timestamp};\n` + 
		`filter[${JSON.stringify(key)}].compiler  = ${JSON.stringify(intrinsic.filter[key].compiler)};\n` 
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

console.log(3939, 'a' in  [ 'a' ] );

var input = {
	a: 5	
}

var filter = {
	a: {
		$in: (context, a, next) => next(null, 5), 
		//$message: 'is bad'
	}
}

if (false) whenInitiated(jsxl)(
	{input},
	filter,
	{ inspect: true },
	(err, result) => {
		console.log(err, result);
		process.exit();
	}
);
if (false) whenInitiated(jsxl.compile)(
		filter,
		{ inspect: true },
		(err, filter) => { if (err) return next(err);
			jsxl.execute({input}, filter, (err, result) => {
				console.log(err, result);
				process.exit();
			});
		}
	);
