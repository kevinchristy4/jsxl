'use strict';

const Context = require('./context');
const async = require('async');
const Script = require('./script');
const utils = require('./utils');
const compiler3 = require('./compiler3');
const coder = require('./coder');

//
//
//
const compile = module.exports.compile = (filter, options, next) => compiler3.compile(filter, options, compileType, 'v1', next);
module.exports.compileMultiple = (filters, options, next) => compiler3.compileMultiple(filters, options, compile, next);
module.exports.inline = (context, filter, options, next) => compiler3.inline(context, filter, options, compile, next);
const compileString = (context, filter, next) => compiler3.compileString(context, filter, compile, next);
const compileFunction = module.exports.compileFunction = compiler3.compileFunction;
const compileSource = compiler3.compileSource;
const compileMap = compiler3.compileMap;
const compileModifier = compiler3.compileModifier;
const compileAssert = compiler3.compileAssert;
const compileConvert = compiler3.compileConvert;
const compileObject = module.exports.compileObject = (context, next) => compiler3.compileObject(context, (context, key, next) => compileType(new Context(context, key).setScopeEntry('modifiers', {}), next),
		                                                                                                 (context,      next) => compileType(new Context(context, '$').setScopeEntry('modifiers', {}), next), next);
const compileArray  = module.exports.compileArray  = (context, next) => compiler3.compileArray (context, (context,      next) => compileType(new Context(context, 0  ).setScopeEntry('modifiers', {}), next), next);

//
//
//
const compileType = module.exports.compileType = (context, next) => { // next(err, script)
	async.waterfall([ 
		next => {
			if (context.key === '$type' && context.source.$type === undefined) return next(null, null); // 
			if (context.source[context.key] === context.target[context.rename]) return next(null, context.target[context.rename]); // avoid recompiling
			utils.execute(context, utils.intrinsic.filter.type1 || null, next);
		},
		(filter, next) => {
			context.target = {}; // clear previous execution to avoid shifting when source === target
			if (filter === null)      
						   return compileFunction(context, filter, next);				
			switch (filter.constructor) {
			case String:   return compileString  (context, filter, next);	
			case Function: return compileFunction(context, filter, next);
			case Array:    
				return utils.execute(context, utils.intrinsic.filter.array1 || null, (err, filter) => { if (err) return next(err);
					context.target = {}; // clear previous execution to avoid shifting when source === target
					compileArray(context, next);
				});
			case Object:   
				// if object holds escape modifier then parse and compile escaped sub filter as object 
				if ('$escape' in filter) {
					context = new Context(context, '$escape');
					if (Object.keys(filter).length > 1) return next(new Error(`${context.fullpath()} cannot mix with other attributes`));
					return utils.execute(context, utils.intrinsic.filter.object1 || null, (err, filter) => { if (err) return next(err);
						context.target = {}; // clear previous execution to avoid shifting when source === target
						compileObject(context, next);
					});
				}
				
				// if object is unmodified then parse and compile as object
				if (((keys) => (new Set([...keys, ...utils.modifiers])).size == keys.length + utils.modifiers.length)(Object.keys(filter))) 
					return utils.execute(context, utils.intrinsic.filter.object1 || null, (err, filter) => { if (err) return next(err);
						context.target = {}; // clear previous execution to avoid shifting when source === target
						compileObject(context, next);
					});
				
				return utils.execute(context, utils.intrinsic.filter.shell1 || null, (err, filter) => { if (err) return next(err);
					context.target = {}; // clear previous execution to avoid shifting when source === target
					compileShell(context, filter, next)
				});
			default:
				return next(new Error(`illegal type: ${filter}`));
				console.log(filter);
			}
		}
	], next);
}

//
// compile any (any type in list)
//
const compileAny = module.exports.compileAny = (context, next) => { // next(err, script)
	if (context.source.$any.length == 0) {
		context.copySource(); // copy source before altering it
		context.source.$any = null; // subtitute empty array with null (anything)
		compileType(context, next); 
	}
	else if (context.source.$any.length == 1) {
		compileType(new Context(context, 0), next); 
	}
	else async.waterfall([
		next => {
// TODO test optional/mandatory outside of any block to avoid multiple identical MustBeProvided errors - is this compileSource() ?
// TODO does this also apply to compileSwitch() ?
			// create a working copy of modifiers, this allows inheritance but avoids sibling override
			const modifiers = Object.assign({}, context.scope.modifiers);
			let i = -1; async.mapSeries(context.source.$any, (component, next) => { // must be in series to ensure order of components in array
				compileType(new Context(context, ++i), (err, scriptType) => { if (err) return next(err);
					context.scope.modifiers = Object.assign({}, modifiers); // reset modifiers
					next(null, new Script(
						...coder.anyType(scriptType)
					));
				});
			}, (err, scriptTypes) => next(err, scriptTypes));
		},
		// compile function type
		(scriptTypes, next) => {
			next(null, new Script( 
				...coder.anyWrapper(scriptTypes)
			));
		},
	], next); 
}

//
// compile switch (first positively filtered type in list)
//
const compileSwitch = module.exports.compileSwitch = (context, next) => { // next(err, script)
	if (context.source.$switch.length == 0) {
		context.copySource(); // copy source before altering it
		context.source.$switch = null; // subtitute empty array with null (anything)
		compileType(context, next); 
	}
	else async.waterfall([
		next => {
			const modifiers = Object.assign({}, context.scope.modifiers);
			let i = -1; async.mapSeries(context.source.$switch, (component, next) => { // must be in series to ensure order of components in array
				compileType(new Context(context, ++i), (err, scriptType) => { if (err) return next(err);
					context.scope.modifiers = Object.assign({}, modifiers); // reset modifiers
					next(null, new Script(
						...coder.switchType(scriptType)
					));
				});
			}, (err, scriptTypes) => next(err, scriptTypes));
		},
		(scriptTypes, next) => {
			next(null, new Script(
				...coder.switchWrapper(scriptTypes)
			));
		},
	], next); 
}

//
// compile shell
//
const compileShell = module.exports.compileShell = (context, filter, next) => { // next(err, script)
//	const filter = context.target[context.rename];

	// if no modifiers in scope or if parent is non-shell, then set new modifiers
	if (context.scope.modifiers === undefined) context.scope.modifiers = {};

	const modifiers = context.scope.modifiers;
	
	// else compile modifiers 
	async.waterfall([
		next => {
			// disallow mix of type modifiers
			if (('$type' in filter ? 1 : 0) + ('$any' in filter ? 1 : 0) > 1) return next(new Error(`${context.fullpath()} holds multiple of $type, $any, or $switch modifiers`));  

			// collect & subload modifiers, modifiers are passed down thru options 
			async.forEachOfSeries(filter, (entry, key, next) => { next = utils.defer(next);
				// disallow mix of modifiers and other keys
				if (! (utils.modifiers.includes(key))) {
					return next(new Error(`${new Context(context, key).fullpath()} mixes with $-modifiers`)); 
				}
				// do not collect particular modifiers
				if ([ '$type', '$any', '$switch', '$filter', '$transform', '$final' ].includes(key)) return next(); 

				// higher level modifiers take precedence / overload
				if (modifiers[key] === undefined) {
					modifiers[key] = entry; // is captured in context.scope.modifiers
				}
				next();
			}, next);
		},
		// compile filter, any, switch, or sub type
		next => {
			if (filter.$any    !== undefined) return compileAny   (new Context(context, '$any'),    next);
			if (filter.$switch !== undefined) return compileSwitch(new Context(context, '$switch'), next);
													 compileType  (new Context(context, '$type'),   next);
		},
		// compile surrounding functions
		(script, next) => {
			if (!filter.$filter && !filter.$transform && !filter.$final) return next(null, script);
			next(null, new Script(
				...coder.shell(filter.$filter, script, filter.$transform, filter.$final, context.scope.functions)
			));
		},
		(script, next) => {
			next(null, script);
		},
	], next);
}