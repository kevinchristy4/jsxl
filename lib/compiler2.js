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
const compile = module.exports.compile = (filter, options, next) => compiler3.compile(filter, options, compileType, 'v2', next);
module.exports.compileMultiple = (filters, options, next) => compiler3.compileMultiple(filters, options, compile, next);
module.exports.inline = (context, filter, options, next) => compiler3.inline(context, filter, options, compile, next);
module.exports.compileString = (context, next) => compiler3.compileString(context, context.source[context.key], compile, next);
const compileFunction = module.exports.compileFunction = (context, next) => compiler3.compileFunction(context, context.source[context.key], next);
const compileSource = compiler3.compileSource;
const compileMap = compiler3.compileMap;
const compileModifier = compiler3.compileModifier;
const compileAssert = compiler3.compileAssert;
const compileConvert = compiler3.compileConvert;
const compileObject = module.exports.compileObject = (context, next) => compiler3.compileObject(context, (context, key, next) => next(null, context.source[context.key][key]),
																								 	     (context,      next) => next(null, context.source[context.key].$   ), next);
const compileArray =  module.exports.compileArray  = (context, next) => compiler3.compileArray (context, (context,      next) => next(null, context.source[context.key][0]  ), next);

//
//
//
const compileType = module.exports.compileType = (context, next) => { // next(err, script)
	async.waterfall([ 
		next => {
			if (context.source[context.key].constructor === Script) return next(null, context.source[context.key]); // avoid recompiling
			utils.execute(context, utils.intrinsic.filter.type2, next); // type2
		},
		(script, next) => {
			// TODO, for testing, but remove
			return next(null, script);
		}
	], next);
}

//
// compile any (any type in list)
//
const compileAny = module.exports.compileAny = (context, next) => { // next(err, script)
	const filter = context.source[context.key];
	if (filter.length == 0) return next(null, utils.nullFilter); 
	if (filter.length == 1) return next(null, filter[0]); 
	
	
	
	
	
	async.waterfall([
		next => {
// TODO test optional/mandatory outside of any block to avoid multiple identical MustBeProvided errors - is this compileSource() ?
// TODO does this also apply to compileSwitch() ?
			
			
			let i = -1; async.mapSeries(filter, (scriptType, next) => { next = utils.defer(next); // must be in series to ensure order of filters in array
			
				next(null, new Script(
					...coder.anyType(scriptType)
				));
				
			}, next);
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
	const filter = context.source[context.key];
	if (filter.length == 0) return next(null, utils.nullFilter); 
	
		
	
	async.waterfall([
		next => {
			
			
			let i = -1; async.mapSeries(filter, (scriptType, next) => { next = utils.defer(next); // must be in series to ensure order of filters in array
			
				next(null, new Script(
					...coder.switchType(scriptType)
				));
			}, next);
			
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
const compileShell = module.exports.compileShell = (context, next) => { // next(err, script)
	const filter = context.source[context.key];
	async.waterfall([
		next => {
			if (filter.$any)   	 return compileAny   (new Context(context, '$any'),    next);
			if (filter.$switch)  return compileSwitch(new Context(context, '$switch'), next);
			if (filter.$type)    return next(null, filter.$type);
			filter.$type = null; return compileFunction(new Context(context, '$type'), next); 
		},
		// compile surrounding functions
		(script, next) => {
			if (!filter.$filter && !filter.$transform && !filter.$final) return next(null, script);
			next(null, new Script(
				...coder.shell(filter.$filter, script, filter.$transform, filter.$final, context.scope.functions) // , filter.$type !== undefined
			));
		},
	], next);
}