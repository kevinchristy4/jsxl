'use strict';

const utils = require('./utils');
const Script = require('./script');

module.exports.compile = (key, vX, timestamp, script) => 
[
	`({`,
		`'${key}': function(context, functions, renamed, next) { // ${vX}, key: ${key}, timestamp: ${timestamp}`,
			`const source = context.source, target = context.target, key = context.key;`,
			script,
		`}`,
	`})`
];

module.exports.string = (key) => 
[
	`utils.intrinsic.filter['${key}'](context, utils.intrinsic.filter['${key}'].functions, renamed, next);`   
//	`utils.intrinsic.filter['${key}'](context, utils.intrinsic.filter['${key}'].functions, renamed, utils.show(next, '${key}'));`   
];

module.exports.sourceRemove = () => 
[
	`next();`
];

module.exports.sourceKeep = (scriptMore) => 
[
	`async.waterfall([`,
		`next => {`,
			scriptMore,
			`next(null);`,
		`}`, 
	`], utils.nullifyTrue(next));`
];

module.exports.sourceArgs = (args, functions) => 
[
	...(utils.isFunction(args) ? [
			`utils.callAuxillarate(context, functions[${utils.pushReturnLength(functions, args)}], (err, $args) => { if (err) return next(err);`,
				`context.args = $args;`,
				`next(null);`,
			`});`,
		`}, next => {`,
	] : [
			`context.args = ${utils.jsformat(args)};`, 
	])
];

module.exports.sourceInsert = (insert, functions) => 
[
	...(utils.isFunction(insert) ? [
			`utils.callInsert(context, functions[${utils.pushReturnLength(functions, insert)}], (err, $insert) => { if (err) return next(err);`, 
				`source[key] = $insert;`,
				`next(null);`,
			`});`,
		`}, next => {`,
	] : [
			`source[key] = ${utils.jsformat(insert)};`
	])
];

module.exports.sourceDefault = (_default, functions) => 
[
	...(utils.isFunction(_default) ? [
			`if (source[key] === undefined) return utils.callDefault(context, functions[${utils.pushReturnLength(functions, _default)}], (err, $default) => { if (err) return next(err);`, 
				`source[key] = $default;`,
				`next(null);`,
			`});`,
			`next(null);`,
		`}, next => {`,
	] : [
			`if (source[key] === undefined) source[key] = ${utils.jsformat(_default)};`
	])
];

module.exports.sourceOptional = (optional) => 
[
	(optional) ? 
		`if (source[key] === undefined) return utils.mustBeProvided(context, next);` : 
		`if (source[key] === undefined) return next(true);` // true forces waterfall stop
];

module.exports.map = (map, functions) => 
[
	utils.isFunction(map) ?    
		`utils.callMap(context, functions[${utils.pushReturnLength(functions, map)}], next);` :
		`next(null, ${utils.jsformat(map)});`,
	`}, (map, next) => {`,
		`utils.mapValue(context, source[key], map, next);`,
	`}, (value, next) => {`,
		`source[key] = value;`
];

module.exports.assert = (modifier, functions, assertion, error, message) => 
[
	utils.isFunction(modifier) ?
		`utils.callModify(context, functions[${utils.pushReturnLength(functions, modifier)}], next);` :
		`next(null, ${utils.jsformat(modifier)});`,
	`}, (modifier, next) => {`,
	message ?
		`if (!(${assertion})) return utils.errorMessage(context, '${message}', next)` :
		`if (!(${assertion})) return utils.errorMessage(context, '${error}', modifier, next)`
];

module.exports.convertToObject = (toObject) => 
[
		`utils.toObject(context, target[context.rename], '${toObject}', next)`, 
	`}, (object, next) => {`,
		`target[context.rename] = object;` 
];

module.exports.convertToArray = (toArray) => 
[
		`utils.toArray(context, target[context.rename], '${toArray}', next)`, 
	`}, (array, next) => {`,
		`target[context.rename] = array;` 
];

module.exports.anyType = (scriptType) => 
[
	`next => (next => { // any option `, // do not utils.defer next, these are only few options
		scriptType,
	`})(utils.filterOutTrue(context, next)),` // signal when no compiler error, collect while parsing errors
];

module.exports.anyWrapper = (scriptTypes) => 
[
	`async.series([ // any all`,	
		...scriptTypes,
	`], (found, errors) => next(found ? null : utils.listStringArray(errors)));`
];

module.exports.switchType = (scriptType) => 
[
	`next => (next => {`, // do not utils.defer next, these are only few options
		scriptType,
	`})(utils.flipTrueNull(next)),` 
];

module.exports.switchWrapper = (scriptTypes) => 
[
	`async.series([`,	
		...scriptTypes,
	`], utils.nullifyTrue(next));`
];

module.exports.shell = (filter, script, transform, final, functions) => 
[
	`async.series([ // functions`,
		...(filter ? [ 
			`next => { // filter`,
				`utils.callFilter(context, functions[${utils.pushReturnLength(functions, filter)}], (err, keep) => { if (err) return next(err);`, 
					`next(keep !== undefined && !keep ? true : null);`, // skip if keep == false
				`});`,
			`},`,
		] : [ 
		]),
			`next => { // entry`, 
				script,
			`},`,
		...(transform ? [
			`next => { // transform`,
				`if (target[context.rename] === undefined) return next();`, 
				`utils.callTransform(context.shift(), functions[${utils.pushReturnLength(functions, transform)}], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);`,
			`},`,
		] : [
		]),
		...(final ? [ 
			`next => { // final`,
				`utils.callFinalize(context, functions[${utils.pushReturnLength(functions, final)}], (err) => { if (err) return next(err);`,
					`next();`,
				`});`,
			`},`,
		] : [ 
		]),
	`], next);` 
];

module.exports.objectKeys = (keys, scriptEntry) => 
[
	`next => utils.filterKeys(context, ${utils.jsformat(keys)}, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries`,
		scriptEntry,
	`}, next)`
];

//function renamed(rename) {
//	return rename ? `renamed[context.rename = '${rename}'] = true;` : undefined
//			
//	
//	utils.isFunction(rename) ?    
//			`utils.callRename(context, functions[${utils.pushReturnLength(functions, rename)}], next);` :
//			`next(null, '${rename}');`,
//		`}, (rename, next) => {`,
//			`renamed[context.rename = rename] = true;`
//};

//const renamed = (rename, functions) => rename ? 
//[
//	utils.isFunction(rename) ?    
//		`utils.callRename(context, functions[${utils.pushReturnLength(functions, rename)}], next);` :
//		`next(null, '${rename}');`,
//	`}, (rename, next) => {`,
//		`renamed[context.rename = rename] = true;`
//] : [];

const renamed = (rename, functions) => { 
	if (rename && rename == 'y') console.trace(9999, rename);
	return rename ? 
	[
		utils.isFunction(rename) ?    
			`utils.callRename(context, functions[${utils.pushReturnLength(functions, rename)}], next);` :
			`next(null, '${rename}');`,
		`}, (rename, next) => {`,
			`renamed[context.rename = rename] = true;`
	] : [];
}

module.exports.objectWrapper = (rename, functions, parallel, scriptKeys, scriptExcessive) => 
[
		...renamed(rename, functions),
		`utils.buildObject(context, (keys, renamed, next) => {`,
			scriptKeys.isEmpty() ? 
			new Script(scriptExcessive, 0, `;`) : 
			new Script(
				`async.${parallel ? 'parallel' : 'series'}([ // entries`,
					scriptKeys, 
				`], err => `, 0, scriptExcessive, 0, `);` // 0's concat line
			),
		`}, next);`,
	`}, next => {`
];

module.exports.objectRest = (scriptKeys, scriptRest) => 
[
	`utils.filterRest(`, 0, scriptKeys.isEmpty() ? `null` : `err`, 0, `, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries`,
		scriptRest,
	`}, next)`

];

module.exports.objectExcessive = (scriptKeys) => 
[
	`utils.seekExcessive(`, 0, scriptKeys.isEmpty() ? `null` : `err`, 0, `, context, keys, renamed, next)`  
];

module.exports.array = (rename, functions, parallel, scriptEntry) => 
[
		...renamed(rename, functions),
		`utils.buildArray(context, (next) => {`, 
			// do NOT reuse n from async.timesSeries, as we may filter out select entries
			`async.${parallel ? 'times' : 'timesSeries'}(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries`,
				`utils.filterIndex(context, key, (context, source, target, key, next) => {`, 
					scriptEntry,
				`}, next)`,
			`}, next);`,
		`}, next);`,
	`}, next => {`,
		`target[context.rename] = target[context.rename].filter(() => true);`
];

module.exports.functionType = (filter) => 
[
	`if (!utils.isType(source[key], ${filter.name})) return utils.mustBeType(context, source, key, ${filter.name}, next);`
];

module.exports.functionAssign = (rename, functions) => 
[
	...renamed(rename, functions),
	`target[context.rename] = source[key];`
];
