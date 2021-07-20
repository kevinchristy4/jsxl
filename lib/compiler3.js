'use strict';

const Context = require('./context');
const async = require('async');
const Script = require('./script');
const utils = require('./utils');
const coder = require('./coder');
const globals = require('./globals');

//
//
//
const cache = {}; // cache for previously compiled scripts
module.exports.inline = (context, filter, options, compile, next) => {
	if (next === undefined) {
		next = options;
		options = {}; // handle optional options
	}
// TODO test and describe use of namespace	
	const namespace = options.namespace || ''; // for separating competing closures
	const hash = (namespace.constructor === Array ? namespace.join('/') : namespace.toString()) + '/' + utils.hashString(utils.jsformat(filter));
	let found = cache[hash];
	(next => {
		if (found) return next(null, found);
		compile(filter, options, next)
	})((err, filter) => { if (err) return next(err);
		utils.execute(context, cache[hash] = filter, next);
	});
}

//
// compile multiple filters
// 
module.exports.compileMultiple = (filters, options, compile, next) => {
	if (next === undefined) {
		next = options;
		options = {}; // handle optional options
	}
	const newFilters = {};
	const modifiers = Object.assign({}, options.modifiers); 	// copy modifiers
	return async.forEachOfSeries(filters, (filter, key, next) => { next = utils.defer(next); // in series to ensure backward reference
		compile(filter, Object.assign({}, options, { key }), (err, filter) => { if (err) return next(err);
			options.modifiers = Object.assign({}, modifiers);  	// restore modifiers
			newFilters[key] = filter;
			next();
		});
	}, err => next(err, newFilters));
};

//
// compile filters 
//
module.exports.compile = (filter, options, compileType, vX, next) => {
	if (next === undefined) {
		next = options;
		options = {}; // handle optional options
	}
	// options include: 
	// modifiers - to compile modified
	// key - 
	// inspect - to show compiled code
	// namespace - only handled in inline to differentiate multiple compilations of same code

	const key = options.key === undefined ? 'filter' : String(options.key);
	const context = new Context({
		source: { [key]: filter },
		key,
		scope: { 
			functions: [],
			modifiers: Object.assign({}, options.modifiers),
		}
	});
	const timestamp = Date.now();
	(next => {
		compileType(context, (err, script) => { if (err) return next(err); 
			next(null, eval(utils.peep((new Script(
				...coder.compile(key, vX, timestamp, script)
	    	)).toString(), options.inspect))[key]); 
		});
	})((err, filter) => { 
		if (err) {
			err.message = `(compile) ${err.message}`;
//			console.log(`--- ERROR COMPILING ${vX} FILTER ---`);
//			console.log(err)
			return next(err);
		}
		filter.functions = context.scope.functions;
		filter.timestamp = timestamp;
		filter.compiler = vX;
		next (null, filter);
	});
};

//
//
//
module.exports.compileString = (context, filter, compile, next) => { // next(err, script)
	const modifiers = context.scope.modifiers;

	// create key, mangling filter name with compiler options, to differentiate strings compiled under different options
	let key = filter + '{'; for (const mod of Object.keys(modifiers || {}).sort((a, b) => { return a.localeCompare(b); })) { if (mod[0] == '$') key += mod + ':' + modifiers[mod].toString(); } key += '}';

// HOW TO avoid outer string modifiers to hit inner strings possibly also modified, e.g. Type2{$optional:true} inadverdently leads to Shell2{$optional:true}
// we want to remove optional from modifiers when transitionong from Type2 to Shell2, right after Type2, before any possibly modification of Shell2

	async.waterfall([
		next => {
			if (utils.intrinsic.filter[key] === true || (utils.intrinsic.filter[key] !== undefined && utils.intrinsic.filter[key].timestamp > utils.intrinsic.timestamp)) return next(null);
	        
	        let spec;
            if (utils.staticFilters[filter] !== undefined)
                spec = utils.staticFilters[filter];
            else if (utils.systemFilters[filter] !== undefined)
                spec = utils.systemFilters[filter];
            else 
                return next(new Error(`${context.fullpath()} references unknown filter (${filter})`));
            
            // stop any recursive compilation
            if (utils.intrinsic.filter[key] === undefined) utils.intrinsic.filter[key] = true;
            else utils.intrinsic.filter[key].timestamp = Date.now(); 
            
            // inspect: [].includes(filter) for debugging purpose
			compile(spec, Object.assign({}, { modifiers, inspect: [].includes(filter), key}), (err, compiled) => {
				utils.intrinsic.filter[key] = compiled;
//				if (verbose) console.log(`jsxl: compiled v2 string-filter: ${key}`);	
				next(err && new Error(`${context.fullpath()} compiled filter (${filter}) with error: ${err.message}`));
            });
	    },
	    next => next(null, new Script(
	    	...coder.string(key)
	    ))
	], next);
};

//
// compile function (and null)
//
module.exports.compileFunction = (context, filter, next) => { // next(err, script)
	const script = new Script();
	async.waterfall([
		next => compileSource(context, script, (err, scriptMore) => { if (err || scriptMore === undefined) return next(err || true);
			next(null, scriptMore);
		}),
		(scriptMore, next) => compileMap(context, scriptMore, err => next(err, scriptMore)),
		// compile function type, null means any type, thus no type check
		(scriptMore, next) => {
			if (filter !== null) scriptMore.push(
				...coder.functionType(filter)
			);
			next(null, scriptMore);
		},
		(scriptMore, next) => compileAssert(context, scriptMore, next),
		// compile assignment 
		(scriptMore, next) => {
			scriptMore.push(
				...coder.functionAssign(context.scope.modifiers.$rename, context.scope.functions)
			);
			next(null, scriptMore);
		},
		(scriptMore, next) => compileConvert(context, scriptMore, next),
	], err => { if (err && err !== true) return next(err);
		next(null, script);
	});
}
//
// compile, possibly create, existence of source, looking at $remove, $insert, $default, $map, and $optional
//
const compileSource = module.exports.compileSource = (context, script, next) => { // next(err, scriptMore)
	const modifiers = context.scope.modifiers; 
	
	// $remove, $insert, and $default modifiers are mutually exclusive and collectively they are mutually exclusive with $optional === false
	if (modifiers) {
		const rid = ('$remove' in modifiers ? 1 : 0) + ('$insert' in modifiers ? 1 : 0) + ('$default' in modifiers ? 1 : 0 );
		if (rid > 1) return next(new Error(`${context.fullpath()} holds multiple of $remove, $insert, or $default modifiers`));
		if (rid == 1 && modifiers.$optional === false) return next(new Error(`${context.fullpath()} holds any of $remove, $insert, or $default modifiers but is explicitly mandatory (non-optional)`));
	}

	// if remove
	if (modifiers && modifiers.$remove) {
		// TODO test if any other modifier is set on $remove and fail
		script.push(
			...coder.sourceRemove()
		);
		return next();
	}

// TODO consider supporting sources as functions rather than values whether these are inserted, defaulted or provided
// `if (utils.isFunction(source[key]) && source[key].name == '') target[rename] = source[key].apply(null, context.parameters);`,
// test for source.key !== null

	const scriptMore = new Script();
	script.push(
		...coder.sourceKeep(scriptMore)
	);
	// if scope is set, assign to context, do not return 
	if (modifiers && '$scope' in modifiers)
		scriptMore.push(
			...coder.sourceScope(modifiers.$scope, context.scope.functions)
		);
	// if insert, do return
	if (modifiers && '$insert' in modifiers)
		return next(null, scriptMore.push(
			...coder.sourceInsert(modifiers.$insert, context.scope.functions)
		));
	// if default, do return
	if (modifiers && '$default' in modifiers)
		return next(null, scriptMore.push(
			...coder.sourceDefault(modifiers.$default, context.scope.functions)
		));
	// if mandatory or optional
	next(null, scriptMore.push(
		...coder.sourceOptional(!modifiers || modifiers.$optional === undefined || modifiers.$optional == false)
	));
}

//
//
//
const compileMap = module.exports.compileMap = (context, script, next) => { // next(err)
	const modifiers = context.scope.modifiers; 
	if (modifiers && '$map' in modifiers) {
		script.push(
			...coder.map(modifiers.$map, context.scope.functions)
		);
		return next();
	}
	next();
}

//
//
//
const compileAssert = module.exports.compileAssert = (context, script, next) => { // next(err, scriptNext)
	const compileModifier = (script, modifiers, $modifier, types, assertion, error, message, next) => {
		if (modifiers[$modifier] !== undefined)
			script.push(
				...coder.assert(modifiers, $modifier, types, context.scope.functions, assertion, error, message)
			);
		next(null);
	}
	const modifiers = context.scope.modifiers;
	if (!modifiers) return next(null, script);
	async.series([
		next => compileModifier(script, modifiers, '$length'		, globals.lengthType,  		`utils.length(source[key]) == modifier`, 		'must have exact length',		   	modifiers.$message, next),
		next => compileModifier(script, modifiers, '$minlen'		, globals.lengthType,  		`utils.length(source[key]) >= modifier`, 		'must have minimum length', 		modifiers.$message, next),
		next => compileModifier(script, modifiers, '$maxlen'		, globals.lengthType,  		`utils.length(source[key]) <= modifier`, 		'must have maximum length',		 	modifiers.$message, next),
		
		next => compileModifier(script, modifiers, '$name'			, globals.nameType, 		`utils.name(source[key]) == modifier`,		'must have name',            		modifiers.$message, next),
		next => compileModifier(script, modifiers, '$constructor'	, globals.nameType, 		`utils.constructor(source[key]) == modifier`, 'must have constructor name', 		modifiers.$message, next),

		next => compileModifier(script, modifiers, '$lt'			, undefined,  				`source[key] < modifier`, 					'must be less than',	 			modifiers.$message, next),
		next => compileModifier(script, modifiers, '$lte'			, undefined,  				`source[key] <= modifier`, 					'must be less than or equal to',	modifiers.$message, next),
		next => compileModifier(script, modifiers, '$eq'			, undefined,  				`source[key] == modifier`, 					'must be equal to',		 			modifiers.$message, next),
		next => compileModifier(script, modifiers, '$ne'			, undefined,  				`source[key] != modifier`, 					'must be different from', 			modifiers.$message, next),
		next => compileModifier(script, modifiers, '$gte'			, undefined,  				`source[key] >= modifier`, 					'must be greater than or equal to',	modifiers.$message, next),
		next => compileModifier(script, modifiers, '$gt'			, undefined,  				`source[key] > modifier`,						'must be greater than', 			modifiers.$message, next), 
		
		next => compileModifier(script, modifiers, '$match'			, undefined,	 			`utils.match(source[key], modifier)`,			'must match', 						modifiers.$message, next),

		next => compileModifier(script, modifiers, '$in' 			, globals.collectionTypes,	 `utils.includes(modifier, source[key])`, 		'must be included in',				modifiers.$message, next),
		next => compileModifier(script, modifiers, '$nin'			, globals.collectionTypes, 	`!utils.includes(modifier, source[key])`, 		'must be excluded from',	 		modifiers.$message, next),
		next => compileModifier(script, modifiers, '$inc'			, undefined,  				 `utils.includes(source[key], modifier)`, 		'must include',						modifiers.$message, next),
		next => compileModifier(script, modifiers, '$ninc'			, undefined, 				`!utils.includes(source[key], modifier)`, 		'must exclude',						modifiers.$message, next),
		
//		next => compileModifier(script, modifiers, '$validate'		, undefined, `validate(source[key], modifier)`, undefined, modifiers.$message, next),

		//		next => {
//			async.mapSeries(X, (mod, next) => {
//				compileModifier(script, modifiers, mod.name			, undefined, `source[key] >   modifier`, `utils.sourceMustBeGT`, modifiers.$message, next)
//			}, next);
//		}
		
	], err => next(err, script));
}

//
//
//
const compileConvert = module.exports.compileConvert = (context, script, next) => {
	const modifiers = context.scope.modifiers; 
	if (!modifiers) return next(null, script);
	if (('$toObject' in modifiers ? 1 : 0) + ('$toArray' in modifiers ? 1 : 0) > 1) return next(new Error(`${context.fullpath()} holds multiple of $toArray or $toObject`));
	if ('$toObject' in modifiers) script.push(
		...coder.convertToObject(modifiers.$toObject)
	);
	if ('$toArray' in modifiers) script.push(
		...coder.convertToArray(modifiers.$toArray)
	);
	next(null, script);
}


////

function isArrayEntry(context) {
	if (!context.context) return false;
	if (context.context.source.constructor === Array) {
//		console.log(6666, context.context);
		if (context.context.context.key in ['$any', '$switch']) return isArrayEntry(context.context.context);
		else 
			return true;
	}
	else return false;
}

//
// compile object
//
module.exports.compileObject = (context, funcEntry, funcRest, next) => { // next(err, script)
	const filter = context.source[context.key];
	const modifiers = context.scope.modifiers; 
	const script = new Script();
	const managedKeys = {};

	async.waterfall([
		// compile source
		next => compileSource(context, script, (err, scriptMore) => { if (err || scriptMore === undefined) return next(err || true);
			next(null, scriptMore);
		}),
		// compile map
		(scriptMore, next) => compileMap(context, scriptMore, err => next(err, scriptMore)),
		// compile object type
		(scriptMore, next) => {
			const scriptKeys = new Script().separator(',');
			async.forEachOfSeries(context.source[context.key], (entry, key, next) => { // next = utils.defer(next);	
				// identify and mark multiple keys, clean out any $
				const keys = key.split(/[\|\+]/).map(key => key.trim());
				const $ = keys.indexOf('$');
				if ($ > -1) {
					managedKeys['$'] = entry;
					keys.splice($, 1);
					key = keys.join('|');
				}
				// mark keys managed, error if duplicate keys
				for (let k = 0; k < keys.length; k++) {
					if (keys[k] in managedKeys) return next(new Error(`${context.fullpath()}.${keys[k]} is duplicated`)); 
					managedKeys[keys[k]] = entry;
				}
// TODO investigate above key management, is it necessary?
				if (key == '') return next();
// TODO what if any key is non-identifer, could we merge with 2 options below?
				funcEntry(context, key, (err, scriptEntry) => { if (err) return next(err);
					scriptKeys.push(new Script(
						...coder.objectKeys(keys, scriptEntry)
					));
					next();
				});
			}, err => next(err, scriptMore, scriptKeys));
		},
		// fetch rest script
		(scriptMore, scriptKeys, next) => '$' in managedKeys ? funcRest(context, (err, scriptRest) => next(err, scriptMore, scriptKeys, scriptRest)) : next(null, scriptMore, scriptKeys, null),
		// compile object type
		(scriptMore, scriptKeys, scriptRest, next) => {
			const scriptExcessive = new Script();
			scriptMore.push(
				...coder.objectWrapper(modifiers.$rename, context.scope.functions, modifiers.$parallel, scriptKeys, scriptExcessive)
			);
			scriptExcessive.push( 
				... (scriptRest ? coder.objectRest(scriptKeys, scriptRest) : coder.objectExcessive(scriptKeys))
			);
			next(null, scriptMore);
		},
		(scriptMore, next) => compileAssert(context, scriptMore, next),
		(scriptMore, next) => compileConvert(context, scriptMore, next),
	], err => { if (err && err !== true) return next(err);
		next(null, script);
	});
};
//
// compile array
//
module.exports.compileArray = (context, funcEntry, next) => { // next(err, script)
	const modifiers = context.scope.modifiers; 
	const script = new Script();
	async.waterfall([
		next => compileSource(context, script, (err, scriptMore) => { if (err || scriptMore === undefined) return next(err || true);
			next(null, scriptMore);
		}),
		(scriptMore, next) => compileMap(context, scriptMore, err => next(err, scriptMore)),
		// fetch entry script
		(scriptMore, next) => funcEntry(context, (err, scriptEntry) => next(err, scriptMore, scriptEntry)),
		// compile array type
		(scriptMore, scriptEntry, next) => {
			scriptMore.push(
				...coder.array(modifiers.$rename, context.scope.functions, modifiers.$parallel, scriptEntry)
			);
			next(null, scriptMore);
		},
		(scriptMore, next) => compileAssert(context, scriptMore, next),
		(scriptMore, next) => compileConvert(context, scriptMore, next),
	], err => { if (err && err !== true) return next(err);
		next(null, script);
	});
}