'use strict';
const format = require('util').format;
const async = require('async');
const fs = require('fs');
const Context = require('./context');

//compiledFilters
//
//defer
//typeName
//isType...
//
//buildObject
//buildArray
//
//filterSpec
//filterRest
//seekExcessive
//
//nullifyTrue
//

function shallowEqual(object1, object2) {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
  	if (keys1.length !== keys2.length) return false;
  	for (let key of keys1) if (object1[key] !== object2[key]) return false;
  	return true;
}

function assertSourceAndTarget(context, source, target) {
	if (! shallowEqual(context.source, source)) {
		console.log(context.source)
		console.log(source)
		throw new Error('bad source assertion');
	}
	if (! shallowEqual(context.target, target)) {
		console.log(context.target)
		console.log(target)
		throw new Error('bad target assertion');
	}
}



//TODO remove, for testing only
function similar(source, target) {
	if (target === undefined) return false;
	if (source === null) return source === target;
	if (! (isObject(source) && isObject(target))) return false; // compare objects only
	
	const s = Object.keys(source);
	const t = Object.keys(target);
	const x = new Set([...s, ...t]);
	return (s.length == x.size && t.length == x.size);	
}
//TODO for testing, remove
const show = module.exports.show = (next, comment) => {
	return (...args) => {
		console.log(comment || '', ...args);
		next(...args);
	}
}
const trace = module.exports.trace = (next, comment) => {
	return (...args) => {
		console.trace(comment || '', ...args);
		next(...args);
	}
}

// *********************************************************************************************


const modifiers = module.exports.modifiers = [];

module.exports.isModifier = (key) => {
	return modifiers.includes(key);
}

const staticFilters = module.exports.staticFilters = {}; 
const compiledFilters = module.exports.compiledFilters = {}; 
const intrinsicFilters = module.exports.intrinsicFilters = {}; 
const intrinsic = module.exports.intrinsic = { filter: {} };

const systemFilters = module.exports.systemFilters = {};


const nullFilter = module.exports.Filter = (context, functions, renamed, next) => {
	// null-filter
	context.target[context.rename] = context.source[context.key];
	next();
}
nullFilter.functions = [];


//
//execute filter
//
const execute = module.exports.execute = (context, filter, next) =>  {
	if (filter === undefined) throw new Error('undefined filter was executed'); 
	async.waterfall([
		next => {
			if (context.constructor === Context) return next(null, context);
			return next(null, new Context(context));
		},
		(context, next) => {
			// filter is null use null filter
			if (filter === null) return next(null, context, nullFilter); 
			// if filter was compiled (as expected)
			if (isFilter(filter)) return next(null, context, filter);
			console.log('***\n   Warning: executed jsxl filters should be pre-compiled, will be compiled without options   \n***');
			console.log(filter);
// TODO this compiler is not reachable			
			compile(filter, (err, filter) => next(err, context, filter));
		},
		(context, filter, next) => {
			filter(context, filter.functions, [], err => {
				if (err && err !== true) {
					if (err.constructor !== Error) 
						throw new Error(`Not a proper error: ${err.constructor.name} = ${err}`)
//					console.log('--- ERROR EXECUTING FILTER ---');
					err.message = `(execute ${filter.compiler}) ${err.message}`;
//					console.log(err)
					return next(err); 
				}
//				if (context.target[context.rename] === undefined) {
//					console.log(context);
//					return require('./delete')(context, filter.functions, [], err => {
//						console.log(err, context.target[context.rename]);
//						throw new Error('7777 here')
//					});
//					console.log(filter.toString());
//					console.log(intrinsic.filter);
//					console.log(3030, 'HANGING in execute');
//					throw new Error('--- internal jsxl error, undefined result in execute ---');
//				}
//				else
				next(null, context.target[context.rename]); // promote result thru next
			});
		}
	], next);
}

//
//log to console or write to file
//
const peep = module.exports.peep = (string, inspect) => {
	if (inspect === undefined) return string;
	if (inspect === true)
		console.log(string);
	else if (inspect !== false) {
		try {
			const fd = fs.openSync(inspect, 'w');
			fs.writeSync(fd, string);
			fs.closeSync(fd);
		} catch(err) {
			console.log(format('Cannot write file %s', inspect));
			return peep(string, true); // console if file cannot open
		}
	}
	return string;
}

//var cnt = 0;
//const count = module.exports.count = () => {
//	return ++cnt;
//}


//
//wrap all next-parameters used in async.keySeries-functions in setImmediate to avoid async-stack-overflow
//
const defer = module.exports.defer = (next) => {
//	console.log(6299, 'fix jsxl defer')
//	return next; // for debugging only
	if (next.name == 'defer') return next; 
	return function(...args) {
		return setImmediate(() => { next(...args); });
	}
}

module.exports.hashString = (s) => {
	const base = '0123456789ABCDEF', a = [];
	for (let i = 0; i < s.length; i++) a[i % base.length] = ((a[i % base.length] || 0) + s.charCodeAt(i)) % base.length;
	for (let i = 0; i < a.length; i++) a[i] = base.substring(a[i], a[i] + 1);
	return a.join('');
}

module.exports.nullifyTrue = (next) => {
	return (err, ...args) => {
		if (err === true) err = null;
		next(err, ...args);
	};
}
module.exports.flipTrueNull = (next) => {
	return (err, ...args) => {
		if (err === true) err = null;
		else if (err === null) err = true;
		next(err, ...args);
	};
}
module.exports.filterOutTrue = (context, next) => {
	return err => next(!err, err === true ? new Error(`${context.fullpath()} was filtered out`) : err);
}

module.exports.overlap = (a, b) => {
	return new Set([...a, ...b]).size < a.length + b.length;
}

module.exports.identical = (a, b) => {
	return new Set([...a, ...b]).size == a.length && a.length == b.length;
}

const likeArray = module.exports.likeArray = (element) => {
	if (element === null || element === undefined) return false;
	return typeof element === 'object' && typeof element[Symbol.iterator] === 'function';
}
const likeObject = module.exports.likeObject = (element) => {
	if (element === null || element === undefined) return false;
	return typeof element === 'object' && typeof element[Symbol.iterator] !== 'function';
}

const isArray = module.exports.isArray = (element) => {
	if (element === null || element === undefined) return false;
	return element.constructor.name === 'Array';
}
const isObject = module.exports.isObject = (element) => {
	if (element === null || element === undefined) return false;
	return typeof element === 'object' && element.constructor.name !== 'Array';
}
const isFilter = module.exports.isFilter = (element) => {
	if (element === null || element === undefined) return false;
	return element.constructor === Function && element.compiler; 
}

const isType = module.exports.isType = (element, type) => {
	if (element === null || element === undefined) return false;
	return element.constructor.name === type; 
//	return element.constructor === type; 
}
const typeName = module.exports.typeName = (element) => {
	if (element === null) return 'null';
	if (element === undefined) return 'undefined';
	return element.constructor.name;
}
module.exports.isFunction = (element) => {
	if (element === null || element === undefined) return false;
	return element.constructor === Function; //&& ![Boolean, Number, String, RegExp, Date].includes(element);
}
module.exports.isNative = (element) => {
	if (element === null || element === undefined) return false;
	return [Boolean, Number, String, RegExp, Date, Function, Array, Object].includes(element);
}
module.exports.isScalar = (element) => {
	if (element === null || element === undefined) return false;
	return element.constructor in [Boolean, Number, String, RegExp, Date];
}

module.exports.length = (a) => {
	if (a === null || a === undefined) return undefined;
	return a.length;
}

module.exports.name = (a) => {
	if (a === null || a === undefined) return undefined;
	return a.name;
}

module.exports.constructor = (a) => {
	if (a === null || a === undefined) return undefined;
	return a.constructor.name;
}

const match = module.exports.match = (a, b) => {
	return isType(a, 'String') && (isType(b, 'RegExp') || isType(b, 'String')) ? a.match(b) : a == b;
}

module.exports.includes = (a, b) => {
	return isArray(a) ? a.find(item => match(b, item)) !== undefined : isObject(a) ? b in a : false;
}

//
// format value javascript style, tab used for function identation
//
const jsformat = module.exports.jsformat = (value, tab) => { tab = tab || 0;
	if (value === undefined) return 'undefined';
	if (value === null) return 'null'; 
	switch (value.constructor) {
	case String  : return JSON.stringify(value);
	case RegExp  : // same as Number // return format("/%s/", value.source);
	case Boolean : // same as Number
	case Number  : return value.toString();
	case Date    : return format("new Date(%d)", value); break;
	case Function: {
		if ([ String, RegExp, Boolean, Number, Date, Function, Array, Object ].indexOf(value) > -1) return value.name;
		const t = ((value.toString().match(/\n\s*}$/) || [''])[0].match(/( {0,3}\t| {4})/g) || []).length; // count tabs in front of trailing function bracket
		return value.toString().replace(new RegExp(format('\r?\n( {0,3}\t| {4}){%d}', t), 'g'), format('\n%s', Array(tab + 1).join('\t')));
	}
	case Array   : return format("[ %s ]", value.reduce((acc, value) => acc + (acc.length > 0 ? ", " : "") + format("%s", jsformat(value, tab)), ''));
	case Object  : // same as default
	default      : return format("{\n%s%s\n%s}",
						Array(tab + 2).join('\t'),
						Object.entries(value).reduce((acc, [key, value]) => acc + (acc.length > 0 ? (",\n" + Array(tab + 2).join('\t')) : "") + format("%s: %s", key.match(/^[_a-z][_a-z0-9]*$/i) ? key : JSON.stringify(key), jsformat(value, tab + 1)), ''),
						Array(tab + 1).join('\t')
				   )
	}
}

//
//wrap called functions next-parameters to avoid multiple callbacks
//
function onlyOnce(context, next) {
    const f = function (...args) {
        if (next === null) throw new Error(`next() was already called in context: ${context}`);
        const next2 = next;
        next = null;
        next2.apply(this, args);
    };
    f.toString = () => next.toString(); // provide transparenct to caller
    return f;
}
// 
//
//
const callFunction = module.exports.callFunction = (context, func, text, next) => {
	func(context, context.source[context.key], onlyOnce(`${text} ${context.fullpath()}`, (err, ...args) => {
		if (err) {
			switch(err.constructor) {
			case String: break;
			case Error:  err = `${err.message} while ${text}`; break;
			default:	 err = `${err} while ${text}`; break;
			}
			err = new Error(`${context.fullpath()}${err[0] == '.' ? '' : ' '}${err}`);
		}
		next(err, ...args);
	}));
}
const callFilter = module.exports.callFilter = (context, func, next) => {
	callFunction(context, func, 'filtering', next);
}
const callTransform = module.exports.callTransform = (context, func, next) => {
	callFunction(context, func, 'transforming', next);
}
const callFinalize = module.exports.callFinalize = (context, func, next) => {
	callFunction(context, func, 'finalizing', next);
}
const callScope = module.exports.callScope = (context, func, next) => {
	callFunction(context, func, 'scoping', next);
}
const callInsert = module.exports.callInsert = (context, func, next) => {
	callFunction(context, func, 'inserting', next);
}
const callDefault = module.exports.callDefault = (context, func, next) => {
	callFunction(context, func, 'defaulting', next);
}
const callMap = module.exports.callMap = (context, func, next) => {
	callFunction(context, func, 'mapping', next);
}
const callRename = module.exports.callRename = (context, func, next) => {
	callFunction(context, func, 'renaming', next);
}
const callModify = module.exports.callModify = (context, func, next) => {
	callFunction(context, func, 'modifying', next);
}

//
//return array length (index of next) and push element into array
//
const pushReturnLength = module.exports.pushReturnLength = (array, entry) => {
	array.push(entry);
	return array.length - 1;
}

const postTransform = module.exports.postTransform = (err, context, key, rename, value, process, next) => { 
	if (err) return next(err);
	context.target[rename] = value in { undefined: 1, null: 1 } ? context.source[key] : value;
	if (process) return process(context.shift(), context.source[context.key], (err, value, process) => postTransform(err, context, key, rename, value, process, next));
	next();
}


//
//
//
const extendContext = module.exports.extendContext = (context, key) => {
	const context2 = {}; 
	for (const k in context) context2[k] = context[k];
	context2.context = context;
	context2.key = key;
	return context2;
}

const mustBeProvided = module.exports.mustBeProvided = (context, next) => {
	next(new Error(`${context.fullpath()} must be provided`));
}
const mustBeType = module.exports.mustBeType = (context, source, key, type, next) => {
	next(new Error(`${context.fullpath()} must be type ${type} (not ${typeName(source[key])})`));
}
const errorMessage = module.exports.errorMessage = (context, message, value, next) => { // value is optional
	if (next)
		next(new Error(`${context.fullpath()} ${message} ${jsformat(value)}`));
	else
		value(new Error(`${context.fullpath()} ${message}`));
}

//
//
//
const mapValue = module.exports.mapValue = (context, value, map, next) => {
	if (likeObject(map)) {
		if (!isType(value, 'String')) return next(new Error(`${context.fullpath()} must map with type String (not ${typeName(value)})`));
		if ((value = map[value]) === undefined) return next(new Error(`${context.fullpath()} must be included in ${jsformat(Object.keys(map))}`));
	} else if (likeArray(map)) {
		if (!isType(value, 'Number')) return next(new Error(`${context.fullpath()} must map with type Number (not ${typeName(value)})`));
		if ((value = map[value]) === undefined) return next(new Error(`${context.fullpath()} must be in range of ${jsformat([0, map.length - 1])}`));
	} else {
		if (!isObject(map)) return next(new Error(`${context.fullpath()} cannot map into type ${typeName(map)}, is not Object or Array`));
	}
	next(null, value);
} 

//
//
//
module.exports.toObject = (context, target, key, next) => {
	if (!isArray(target)) return next(new Error(`${context.fullpath()} cannot convert to Object, is not an Array`));
	let i = -1; async.reduce(target, {}, (object, item, next) => { next = defer(next); ++i;
		if (!isObject(item))                 return next(new Error(`${context.fullpath()}[${i}] must be an object for ${context.fullpath()} to convert to array`));
		if (item[key] === undefined)         return next(new Error(`${context.fullpath()}[${i}] has no object key: ${key}`));
		if (!isType(item[key], 'String'))    return next(new Error(`${context.fullpath()}[${i}] has non-String object key: ${key}`));
		if (object[item[key]] !== undefined) return next(new Error(`${context.fullpath()}[${i}] has duplicate object key: ${key} (${item[key]})`));
		object[item[key]] = item;
		delete item[key];
		next(null, object);
	}, next);
}

//
//
//
module.exports.toArray = (context, target, key, next) => {
	if (!isObject(target)) return next(new Error(`${context.fullpath()} cannot convert to Array, is not an Object`));
	async.mapSeries(Object.entries(target), (item, next) => { next = defer(next); 
		if (!isObject(item[1]))         return next(new Error(`${context.fullpath()}.${item[0]} must be an object for ${context.fullpath()} to convert to array`));
		if (item[1][key] !== undefined) return next(new Error(`${context.fullpath()}.${item[0]} already has object key: ${key} (${item[1][key]})`));
		item[1][key] = item[0];
		next(null, item[1]);
	}, next);
}

//
//
//
const buildObject = module.exports.buildObject = (context, handler, next) => {
	const source = context.source[context.key];
	let target = context.target[context.rename];
	 
	// test source type
	if (!likeObject(source)) return next(new Error(`${context.fullpath()} (source) must be like type Object (not ${typeName(source)})`));

	// copy source and target
	const prevSource = context.source[context.key];
	context.source[context.key] = Object.assign({}, source);
	let targetCopy;

	// provide target or test provided target type
	if (target === undefined) target = context.target[context.rename] = {}; 
	else if (!likeObject(target)) return next(new Error(`${context.fullpath()} (target) must be like type Object (not ${typeName(target)})`));
	else targetCopy = Object.assign({}, target);

	handler({}, {}, err => {
		context.source[context.key] = prevSource; // reset source
		if (err) { 
			// reset target
			if (targetCopy) { for (const key in target) delete target[key]; Object.assign(target, targetCopy); }
			else context.target[context.rename] = undefined;
		}
		next(err);  
	});
}

//
//
//
const buildArray = module.exports.buildArray = (context, handler, next) => { 
	const source = context.source[context.key];
	let target = context.target[context.rename];	
	
	// test source type
	if (!likeArray(source)) return next(new Error(`${context.fullpath()} (source) must be like type Array (not ${typeName(source)})`));
	
	const prevSource = context.source[context.key];
	context.source[context.key] = [].concat(source);
	let targetCopy; 
	
	// provide target or test type of provided target
	if (target === undefined) target = context.target[context.rename] = []; 
	else if (!likeArray(target)) return next(new Error(`${context.fullpath()} (target) must be like type Array (not ${typeName(target)})`));
	else targetCopy = [].concat(target);
	
	handler(err => {
		context.source[context.key] = prevSource; // reset source
		if (err) {
			// reset target
			if (targetCopy) target.splice(0, target.length, ...targetCopy);
			else context.target[context.rename] = undefined;
		}
		next(err);
	});
}

//
//
//
// TODO how to handle rename when splitting keys	
const filterKeys = module.exports.filterKeys = (context, keys, usedKeys, handler, next) => {
	context.target[context.rename] = context.target[context.rename] || {};
	async.mapSeries(keys, (key, next) => { next = defer(next);
		if (key in usedKeys) return next(new Error(`holds duplicate key (${key})`)); // TODO fix, possibly aready handled before called...
		usedKeys[key] = true; 
		const ctx = new Context(context, key); // rename
		handler(ctx, ctx.source, ctx.target, ctx.key, next);
	}, next);
}

//
//
//
const filterIndex = module.exports.filterIndex = (context, index, handler, next) => {
	context.target[context.rename] = context.target[context.rename] || [];
	const ctx = new Context(context, index);
	handler(ctx, ctx.source, ctx.target, ctx.key, next);
}

//
//
//
const filterRest = module.exports.filterRest = (err, context, usedKeys, handler, next) => { if (err) return next(err);
// TODO test if "source.toObject ? source.toObject() : source" below ever uses toObject() or if already objected in buildObject
	context.target[context.rename] = context.target[context.rename] || {};
	async.forEachOfSeries(context.source[context.key].toObject ? context.source[context.key].toObject() : context.source[context.key], (entry, key, next) => { next = defer(next); // context.key = key;
		if (key in usedKeys) return next(null); // continue (skip rest) if key already handled
		const ctx = new Context(context, key); 
		handler(ctx, ctx.source, ctx.target, ctx.key, err => { if (err) return next(err);
			// split key with | delimeter (not +)
			const keys = key.split('|').map(key => key.trim());
			if (keys.length > 1) {
				keys.map(k => Object.assign(context.target[context.rename], { [k]: ctx.target[key] } ));
				delete ctx.target[key];
			}
			next(null); 
		}); 
	}, next);
}

//
//seek excessive attributes, handle incoming errors for ease of use in calling context
//
const seekExcessive = module.exports.seekExcessive = (err, context, usedKeys, ignore, next) => { if (err) return next(err);
	// seek excessive values in source
	async.forEachOfSeries(context.source[context.key].toObject ? context.source[context.key].toObject() : context.source[context.key], (entry, key, next) => { next = defer(next); // context.key = key;
		if (key in usedKeys || key in ignore) return next(); // continue if already handled or to be ignored
		const ctx = new Context(context, key); // no need to copy source because no handler 
		next(new Error(`${ctx.fullpath()} is excessive, expected any of [${Object.keys(usedKeys)}]`)); // must return string error, as used in compiled code
	}, next);
}

//listing all errors on type $any
const listStringArray = module.exports.listStringArray = (array) => {
	array = array.filter(i => i !== true); // remove true-errors
	switch(array.length) {
	case 0:  return null;
	case 1:  return array[0];
	default: 
		return array.reduce((acc, cur, i) => {
			if (i < array.length - 1) return `${acc}\n${cur.message || cur}${array.length > 2 ? ',' : ''}`;
			return new Error(`${acc} or\n${cur.message || cur}`);
		}, 'one of'); 
	}
}

//
//
//
const merge = module.exports.merge = (target, ...sources) => {
	if (sources.length == 0) return target;
	let source = (sources.length == 1) ? sources[0] : merge(...sources);
	
	if (target === undefined) return source;
	if (source === undefined) return target;

	function isModified(object) {
		if (object === null) return 7; // simple
		if (object.constructor === Array) return 1 // array
		let mod = 7; // simple
		if (object.constructor === Object) {
			mod = 2; // object
			for (const key in object) {
				if (modifiers.includes(key))
					switch (key) {
					case '$switch':	mod = Math.max(mod, 6);
					case '$any':   	mod = Math.max(mod, 5);
					default:       	mod = Math.max(mod, 3);
					}
			}
		}
		return mod;
	}
	//
	//	identify characteristics
	// 	1 arrays
	//	2 objects
	//	3 complex $type
	//  4 <reserved>
	// 	5 complex $any
	// 	6 complex $switch
	// 	7 simple
	//

//	complex-complex	mergeObjects(complex, complex)			356-356		*
//	complex-simple	mergeObjects(complex, complex(simple))	356-7			*
//	complex-object	mergeObjects(complex, complex(object))	356-2			*
//	complex-array	mergeObjects(complex, complex(array))	356-1			*
//
//	simple-complex	mergeObject(complex(simple), complex)	7-356			*
//	simple-simple	simple									7-7				*
//	simple-object	object									7-2				*
//	simple-array	array									7-1				*
//
//	object-complex	mergeObjects(complex(object), complex)	2-356			*
//	object-simple	simple									2-7				*
//	object-object	mergeObjects(object, object)			2-2				---
//	object-array	array									2-1				*
//
//	array-complex	mergeObjects(complex(array), complex)	1-356			*
//	array-simple	simple									1-7				*
//	array-object	object									1-2				*
//	array-array		mergeArrays(array, array)				1-1				---

	// prepare before merging objects (on break) or 
	switch (isModified(target) * 10 + isModified(source)) {
	// 356-356
	case 33:																// type-type
	case 55: 																// any-any
	case 66: break;															// switch-switch
	case 35: 																// type-any
	case 36: 																// type-switch
	case 53: 																// any-type
	case 63: 																// switch-type
//	case 56: throw new Error('not yet supported');	// any-switch
//	case 65: throw new Error('not yet supported');	// switch-any 

	// 356-721
	case 37: 																// type-simple
	case 32: 										 						// type-object
	case 31: source = { $type:     source   }; break; 						// type-array
	case 57:																// any-simple
	case 52:																// any-object
	case 51: source = { $any:    [ source ] }; break;						// any-array
	case 67:																// switch-simple
	case 62:																// switch-object
	case 61: source = { $switch: [ source ] }; break;						// switch-array

	// 721-356
	case 73: 																// simple-type
	case 23: 																// object-type
	case 13: target = { $type:     target   }; break; 						// array-type
	case 75: 																// simple-any
	case 25: 																// object-any
	case 15: target = { $any:    [ target ] }; break;						// array-any
	case 76: 																// simple-switch
	case 26: 																// object-switch
	case 16: target = { $switch: [ target ] }; break;						// array-switch

	case 77:
	case 72:
	case 71: 
	case 27: 
	case 21: 
	case 17:
	case 12: return source; 
	
	case 22: break; 
	
	case 11: return mergeArrays(target, source);

	}
	return mergeObjects(target, source);
} 
function mergeArrays(target, source) {
	return target.concat(source);
	
	let x = [ merge(target[0], source[0]) ];
	console.log(1000);
	console.log('-------------------------');
	console.log(target);
	console.log(source);
	console.log(x);
	console.log('-------------------------');
	return x;
}
function mergeObjects(target, source) {
	let result = {};
	for (let key of [...new Set([...Object.keys(target), ...Object.keys(source)])]) result[key] = merge(target[key], source[key]); // Set ensures one occurance only of each key
	return result;
}


