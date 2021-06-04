'use strict';
// jsxl-filters compiled with jsxl-filters on Fri Jun 04 2021 21:22:00 GMT+0530 (India Standard Time)
const format = require('util').format;
const async = require('async');
const utils = require('./utils');
const Context = require('./context');
const compiler2 = require('./compiler2');
const filter = module.exports.filter = {};
module.exports.state = 4;

Object.assign(filter, { 'Type1{}':
	function(context, functions, renamed, next) { // v1, key: Type1{}, timestamp: 1622821919965
		const source = context.source, target = context.target, key = context.key;
		async.series([ // any all
			next => (next => { // any option 
				async.waterfall([
					next => {
						if (source[key] === undefined) return utils.mustBeProvided(context, next);
						if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
						target[context.rename] = source[key];
						next(null);
					}
				], utils.nullifyTrue(next));
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.waterfall([
					next => {
						if (source[key] === undefined) return utils.mustBeProvided(context, next);
						if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
						target[context.rename] = source[key];
						next(null);
					}
				], utils.nullifyTrue(next));
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.waterfall([
					next => {
						if (source[key] === undefined) return utils.mustBeProvided(context, next);
						if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
						target[context.rename] = source[key];
						next(null);
					}
				], utils.nullifyTrue(next));
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.series([ // functions
					next => { // entry
						async.waterfall([
							next => {
								if (source[key] === undefined) return utils.mustBeProvided(context, next);
								if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
								target[context.rename] = source[key];
								next(null);
							}
						], utils.nullifyTrue(next));
					},
					next => { // transform
						if (target[context.rename] === undefined) return next();
						utils.callTransform(context.shift(), functions[0], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
					},
				], next);
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.series([ // functions
					next => { // entry
						async.waterfall([
							next => {
								if (source[key] === undefined) return utils.mustBeProvided(context, next);
								target[context.rename] = source[key];
								next(null);
							}
						], utils.nullifyTrue(next));
					},
					next => { // transform
						if (target[context.rename] === undefined) return next();
						utils.callTransform(context.shift(), functions[1], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
					},
				], next);
			})(utils.filterOutTrue(context, next)),
		], (found, errors) => next(found ? null : utils.listStringArray(errors)));
	}
});
filter['Type1{}'].functions = [
		(context, type, next) => {
// TODO use "Filter" type instead			
			if (utils.isFilter(type)) return next('cannot be recompiled'); 
// TODO could we keep and call compiled filter as opposed to just not compile it
			next();
		},(context, type, next) => { //
			if (type === undefined || type == null) return next(null, null); 
			next(`holds type not supported (${type})`);
		}
];
filter['Type1{}'].timestamp = 1622821919965;
filter['Type1{}'].compiler  = 'v1';

Object.assign(filter, { 'Shell1{}':
	function(context, functions, renamed, next) { // v1, key: Shell1{}, timestamp: 1622821919954
		const source = context.source, target = context.target, key = context.key;
		async.waterfall([
			next => {
				if (source[key] === undefined) return utils.mustBeProvided(context, next);
				utils.buildObject(context, (keys, renamed, next) => {
					async.series([ // entries
						next => utils.filterKeys(context, [ '$id' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$type' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							utils.intrinsic.filter['Type1{$optional:true}'](context, utils.intrinsic.filter['Type1{$optional:true}'].functions, renamed, next);
						}, next),
						next => utils.filterKeys(context, [ '$any', '$switch' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									utils.buildArray(context, (next) => {
										async.timesSeries(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries
											utils.filterIndex(context, key, (context, source, target, key, next) => {
												utils.intrinsic.filter['Type1{}'](context, utils.intrinsic.filter['Type1{}'].functions, renamed, next);
											}, next)
										}, next);
									}, next);
								}, next => {
									target[context.rename] = target[context.rename].filter(() => true);
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$remove' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$insert' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$default' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$map' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$optional' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$parallel' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$message' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$lt', '$lte', '$eq', '$ne', '$gte', '$gt' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$in', '$nin' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$inc', '$ninc' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Number)) return utils.mustBeType(context, source, key, Number, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], RegExp)) return utils.mustBeType(context, source, key, RegExp, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Date)) return utils.mustBeType(context, source, key, Date, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$match' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], RegExp)) return utils.mustBeType(context, source, key, RegExp, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$name', '$constructor' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$length', '$minlen', '$maxlen' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Number)) return utils.mustBeType(context, source, key, Number, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$rename' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$toArray', '$toObject' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$filter', '$transform', '$final' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$args' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next)
					], err => utils.filterRest(err, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next));
				}, next);
			}, next => {
				next(null);
			}
		], utils.nullifyTrue(next));
	}
});
filter['Shell1{}'].functions = [];
filter['Shell1{}'].timestamp = 1622821919954;
filter['Shell1{}'].compiler  = 'v1';

Object.assign(filter, { 'Type1{$optional:true}':
	function(context, functions, renamed, next) { // v1, key: Type1{$optional:true}, timestamp: 1622821919959
		const source = context.source, target = context.target, key = context.key;
		async.series([ // any all
			next => (next => { // any option 
				async.waterfall([
					next => {
						if (source[key] === undefined) return next(true);
						if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
						target[context.rename] = source[key];
						next(null);
					}
				], utils.nullifyTrue(next));
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.waterfall([
					next => {
						if (source[key] === undefined) return next(true);
						if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
						target[context.rename] = source[key];
						next(null);
					}
				], utils.nullifyTrue(next));
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.waterfall([
					next => {
						if (source[key] === undefined) return next(true);
						if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
						target[context.rename] = source[key];
						next(null);
					}
				], utils.nullifyTrue(next));
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.series([ // functions
					next => { // entry
						async.waterfall([
							next => {
								if (source[key] === undefined) return next(true);
								if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
								target[context.rename] = source[key];
								next(null);
							}
						], utils.nullifyTrue(next));
					},
					next => { // transform
						if (target[context.rename] === undefined) return next();
						utils.callTransform(context.shift(), functions[0], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
					},
				], next);
			})(utils.filterOutTrue(context, next)),
			next => (next => { // any option 
				async.series([ // functions
					next => { // entry
						async.waterfall([
							next => {
								if (source[key] === undefined) return next(true);
								target[context.rename] = source[key];
								next(null);
							}
						], utils.nullifyTrue(next));
					},
					next => { // transform
						if (target[context.rename] === undefined) return next();
						utils.callTransform(context.shift(), functions[1], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
					},
				], next);
			})(utils.filterOutTrue(context, next)),
		], (found, errors) => next(found ? null : utils.listStringArray(errors)));
	}
});
filter['Type1{$optional:true}'].functions = [
		(context, type, next) => {
// TODO use "Filter" type instead			
			if (utils.isFilter(type)) return next('cannot be recompiled'); 
// TODO could we keep and call compiled filter as opposed to just not compile it
			next();
		},(context, type, next) => { //
			if (type === undefined || type == null) return next(null, null); 
			next(`holds type not supported (${type})`);
		}
];
filter['Type1{$optional:true}'].timestamp = 1622821919959;
filter['Type1{$optional:true}'].compiler  = 'v1';

Object.assign(filter, { 'Object1{}':
	function(context, functions, renamed, next) { // v1, key: Object1{}, timestamp: 1622821920008
		const source = context.source, target = context.target, key = context.key;
		async.waterfall([
			next => {
				if (source[key] === undefined) return utils.mustBeProvided(context, next);
				utils.buildObject(context, (keys, renamed, next) => {
					utils.filterRest(null, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							utils.intrinsic.filter['Type1{}'](context, utils.intrinsic.filter['Type1{}'].functions, renamed, next);
						}, next);
				}, next);
			}, next => {
				next(null);
			}
		], utils.nullifyTrue(next));
	}
});
filter['Object1{}'].functions = [];
filter['Object1{}'].timestamp = 1622821920008;
filter['Object1{}'].compiler  = 'v1';

Object.assign(filter, { 'Array1{}':
	function(context, functions, renamed, next) { // v1, key: Array1{}, timestamp: 1622821920009
		const source = context.source, target = context.target, key = context.key;
		async.series([ // functions
			next => { // filter
				utils.callFilter(context, functions[0], (err, keep) => { if (err) return next(err);
					next(keep !== undefined && !keep ? true : null);
				});
			},
			next => { // entry
				async.waterfall([
					next => {
						if (source[key] === undefined) return utils.mustBeProvided(context, next);
						utils.buildArray(context, (next) => {
							async.timesSeries(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries
								utils.filterIndex(context, key, (context, source, target, key, next) => {
									utils.intrinsic.filter['Type1{}'](context, utils.intrinsic.filter['Type1{}'].functions, renamed, next);
								}, next)
							}, next);
						}, next);
					}, next => {
						target[context.rename] = target[context.rename].filter(() => true);
						next(null, 1);
					}, (modifier, next) => {
						if (!( utils.length(source[key]) >= modifier)) return utils.errorMessage(context, 'must have minimum length', modifier, next)
						next(null);
					}
				], utils.nullifyTrue(next));
			},
		], next);
	}
});
filter['Array1{}'].functions = [
		(context, filter, next) => {
			if (filter.length > 1) context.source[context.key] = [ utils.merge(...filter) ];
			next(null, true);
		}
];
filter['Array1{}'].timestamp = 1622821920009;
filter['Array1{}'].compiler  = 'v1';

Object.assign(filter, { 'type1':
	function(context, functions, renamed, next) { // v1, key: type1, timestamp: 1622821919946
		const source = context.source, target = context.target, key = context.key;
		utils.intrinsic.filter['Type1{}'](context, utils.intrinsic.filter['Type1{}'].functions, renamed, next);
	}
});
filter['type1'].functions = [];
filter['type1'].timestamp = 1622821919946;
filter['type1'].compiler  = 'v1';

Object.assign(filter, { 'shell1':
	function(context, functions, renamed, next) { // v1, key: shell1, timestamp: 1622821919954
		const source = context.source, target = context.target, key = context.key;
		utils.intrinsic.filter['Shell1{}'](context, utils.intrinsic.filter['Shell1{}'].functions, renamed, next);
	}
});
filter['shell1'].functions = [];
filter['shell1'].timestamp = 1622821919954;
filter['shell1'].compiler  = 'v1';

Object.assign(filter, { 'object1':
	function(context, functions, renamed, next) { // v1, key: object1, timestamp: 1622821920007
		const source = context.source, target = context.target, key = context.key;
		utils.intrinsic.filter['Object1{}'](context, utils.intrinsic.filter['Object1{}'].functions, renamed, next);
	}
});
filter['object1'].functions = [];
filter['object1'].timestamp = 1622821920007;
filter['object1'].compiler  = 'v1';

Object.assign(filter, { 'array1':
	function(context, functions, renamed, next) { // v1, key: array1, timestamp: 1622821920009
		const source = context.source, target = context.target, key = context.key;
		utils.intrinsic.filter['Array1{}'](context, utils.intrinsic.filter['Array1{}'].functions, renamed, next);
	}
});
filter['array1'].functions = [];
filter['array1'].timestamp = 1622821920009;
filter['array1'].compiler  = 'v1';

Object.assign(filter, { 'Type2{}':
	function(context, functions, renamed, next) { // v2, key: Type2{}, timestamp: 1622821920181
		const source = context.source, target = context.target, key = context.key;
		async.series([ // functions
			next => { // filter
				utils.callFilter(context, functions[13], (err, keep) => { if (err) return next(err);
					next(keep !== undefined && !keep ? true : null);
				});
			},
			next => { // entry
				async.series([
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[0], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
										target[context.rename] = source[key];
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[1], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[2], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										utils.buildObject(context, (keys, renamed, next) => {
											utils.filterRest(null, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
													utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
												}, next);
										}, next);
									}, next => {
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[3], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[4], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								utils.intrinsic.filter['Shell2{}'](context, utils.intrinsic.filter['Shell2{}'].functions, renamed, next);
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[5], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[6], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
										target[context.rename] = source[key];
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[7], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[8], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										utils.buildObject(context, (keys, renamed, next) => {
											utils.filterRest(null, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
													utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
												}, next);
										}, next);
									}, next => {
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[9], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[10], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										utils.buildArray(context, (next) => {
											async.timesSeries(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries
												utils.filterIndex(context, key, (context, source, target, key, next) => {
													utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
												}, next)
											}, next);
										}, next);
									}, next => {
										target[context.rename] = target[context.rename].filter(() => true);
										next(null, 1);
									}, (modifier, next) => {
										if (!( utils.length(source[key]) >= modifier)) return utils.errorMessage(context, 'must have minimum length', modifier, next)
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[11], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										target[context.rename] = source[key];
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[12], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
				], utils.nullifyTrue(next));
			},
		], next);
	}
});
filter['Type2{}'].functions = [
		(context, filter, next) => next(null, utils.isType(filter, String)),(context, filter, next) => compiler2.compileString(context, next),(context, filter, next) => {
					if (utils.isObject(filter) && '$escape' in filter) {
						if (Object.keys(filter).length > 1) return next(new Error(`${context.fullpath()} mixes $escape with other attributes`));
						return next(null, true);
					}
					next(null, false);
				},(context, filter, next) => next(null, filter.$escape),(context, filter, next) => {
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
				},(context, filter, next) => compiler2.compileShell(context, next),(context, filter, next) => next(null, utils.isFunction(filter)),(context, filter, next) => utils.isFilter(filter) ?
					next('cannot be recompiled') : // TODO could we keep and call compiled filter as opposed to just not compile it
					compiler2.compileFunction(context, next),(context, filter, next) => next(null, utils.isObject(filter)),(context, filter, next) => compiler2.compileObject(context, next),(context, filter, next) => { 
					if (! utils.isArray(filter)) return next(null, false);
					if (filter.length > 1) context.source[context.key] = [ utils.merge(...filter) ];
					next(null, true);
				},(context, filter, next) => compiler2.compileArray(context, next),(context, filter, next) => { 
					(filter === null) ? 
					compiler2.compileFunction(context, next) :
					next(`holds type not supported (${filter})`)
				},(context, filter, next) => {
			const parentKey = context.context && context.context.key;
			const parentFilter = parentKey !== undefined && context.context.source[parentKey];
			// delete modifiers if parent context is a true Object (not a shell) or a true Array (not defining $any or $switch)
			if ((utils.isObject(parentFilter) && (!utils.overlap(Object.keys(parentFilter), utils.modifiers) || context.key == '$escape')) ||
		    	(utils.isArray(parentFilter) && !['$any', '$switch'].includes(parentKey))) {
				context.setScopeEntry('modifiers', {});
			}
			next();
		}
];
filter['Type2{}'].timestamp = 1622821920181;
filter['Type2{}'].compiler  = 'v2';

Object.assign(filter, { 'Shell2{}':
	function(context, functions, renamed, next) { // v2, key: Shell2{}, timestamp: 1622821920186
		const source = context.source, target = context.target, key = context.key;
		async.waterfall([
			next => {
				if (source[key] === undefined) return utils.mustBeProvided(context, next);
				utils.buildObject(context, (keys, renamed, next) => {
					async.series([ // entries
						next => utils.filterKeys(context, [ '$id' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$type' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							utils.intrinsic.filter['Type2{$optional:true}'](context, utils.intrinsic.filter['Type2{$optional:true}'].functions, renamed, next);
						}, next),
						next => utils.filterKeys(context, [ '$any', '$switch' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									utils.buildArray(context, (next) => {
										async.timesSeries(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries
											utils.filterIndex(context, key, (context, source, target, key, next) => {
												utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
											}, next)
										}, next);
									}, next);
								}, next => {
									target[context.rename] = target[context.rename].filter(() => true);
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$remove' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$insert' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$default' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$map' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$optional' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$parallel' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$message' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$lt', '$lte', '$eq', '$ne', '$gte', '$gt' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$in', '$nin' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$inc', '$ninc' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Number)) return utils.mustBeType(context, source, key, Number, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], RegExp)) return utils.mustBeType(context, source, key, RegExp, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Date)) return utils.mustBeType(context, source, key, Date, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$match' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], RegExp)) return utils.mustBeType(context, source, key, RegExp, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$name', '$constructor' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$length', '$minlen', '$maxlen' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Number)) return utils.mustBeType(context, source, key, Number, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$rename' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$toArray', '$toObject' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$filter', '$transform', '$final' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$args' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next)
					], err => utils.filterRest(err, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next));
				}, next);
			}, next => {
				next(null);
			}
		], utils.nullifyTrue(next));
	}
});
filter['Shell2{}'].functions = [];
filter['Shell2{}'].timestamp = 1622821920186;
filter['Shell2{}'].compiler  = 'v2';

Object.assign(filter, { 'Type2{$optional:true}':
	function(context, functions, renamed, next) { // v2, key: Type2{$optional:true}, timestamp: 1622821920187
		const source = context.source, target = context.target, key = context.key;
		async.series([ // functions
			next => { // filter
				utils.callFilter(context, functions[13], (err, keep) => { if (err) return next(err);
					next(keep !== undefined && !keep ? true : null);
				});
			},
			next => { // entry
				async.series([
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[0], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return next(true);
										if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
										target[context.rename] = source[key];
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[1], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[2], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return utils.mustBeProvided(context, next);
										utils.buildObject(context, (keys, renamed, next) => {
											utils.filterRest(null, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
													utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
												}, next);
										}, next);
									}, next => {
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[3], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[4], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								utils.intrinsic.filter['Shell2{$optional:true}'](context, utils.intrinsic.filter['Shell2{$optional:true}'].functions, renamed, next);
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[5], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[6], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return next(true);
										if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
										target[context.rename] = source[key];
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[7], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[8], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return next(true);
										utils.buildObject(context, (keys, renamed, next) => {
											utils.filterRest(null, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
													utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
												}, next);
										}, next);
									}, next => {
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[9], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // filter
								utils.callFilter(context, functions[10], (err, keep) => { if (err) return next(err);
									next(keep !== undefined && !keep ? true : null);
								});
							},
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return next(true);
										utils.buildArray(context, (next) => {
											async.timesSeries(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries
												utils.filterIndex(context, key, (context, source, target, key, next) => {
													utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
												}, next)
											}, next);
										}, next);
									}, next => {
										target[context.rename] = target[context.rename].filter(() => true);
										next(null, 1);
									}, (modifier, next) => {
										if (!( utils.length(source[key]) >= modifier)) return utils.errorMessage(context, 'must have minimum length', modifier, next)
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[11], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
					next => (next => {
						async.series([ // functions
							next => { // entry
								async.waterfall([
									next => {
										if (source[key] === undefined) return next(true);
										target[context.rename] = source[key];
										next(null);
									}
								], utils.nullifyTrue(next));
							},
							next => { // transform
								if (target[context.rename] === undefined) return next();
								utils.callTransform(context.shift(), functions[12], (err, value, process) => utils.postTransform(err, context, key, context.rename, value, process, next), next);
							},
						], next);
					})(utils.flipTrueNull(next)),
				], utils.nullifyTrue(next));
			},
		], next);
	}
});
filter['Type2{$optional:true}'].functions = [
		(context, filter, next) => next(null, utils.isType(filter, String)),(context, filter, next) => compiler2.compileString(context, next),(context, filter, next) => {
					if (utils.isObject(filter) && '$escape' in filter) {
						if (Object.keys(filter).length > 1) return next(new Error(`${context.fullpath()} mixes $escape with other attributes`));
						return next(null, true);
					}
					next(null, false);
				},(context, filter, next) => next(null, filter.$escape),(context, filter, next) => {
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
				},(context, filter, next) => compiler2.compileShell(context, next),(context, filter, next) => next(null, utils.isFunction(filter)),(context, filter, next) => utils.isFilter(filter) ?
					next('cannot be recompiled') : // TODO could we keep and call compiled filter as opposed to just not compile it
					compiler2.compileFunction(context, next),(context, filter, next) => next(null, utils.isObject(filter)),(context, filter, next) => compiler2.compileObject(context, next),(context, filter, next) => { 
					if (! utils.isArray(filter)) return next(null, false);
					if (filter.length > 1) context.source[context.key] = [ utils.merge(...filter) ];
					next(null, true);
				},(context, filter, next) => compiler2.compileArray(context, next),(context, filter, next) => { 
					(filter === null) ? 
					compiler2.compileFunction(context, next) :
					next(`holds type not supported (${filter})`)
				},(context, filter, next) => {
			const parentKey = context.context && context.context.key;
			const parentFilter = parentKey !== undefined && context.context.source[parentKey];
			// delete modifiers if parent context is a true Object (not a shell) or a true Array (not defining $any or $switch)
			if ((utils.isObject(parentFilter) && (!utils.overlap(Object.keys(parentFilter), utils.modifiers) || context.key == '$escape')) ||
		    	(utils.isArray(parentFilter) && !['$any', '$switch'].includes(parentKey))) {
				context.setScopeEntry('modifiers', {});
			}
			next();
		}
];
filter['Type2{$optional:true}'].timestamp = 1622821920187;
filter['Type2{$optional:true}'].compiler  = 'v2';

Object.assign(filter, { 'Shell2{$optional:true}':
	function(context, functions, renamed, next) { // v2, key: Shell2{$optional:true}, timestamp: 1622821920189
		const source = context.source, target = context.target, key = context.key;
		async.waterfall([
			next => {
				if (source[key] === undefined) return utils.mustBeProvided(context, next);
				utils.buildObject(context, (keys, renamed, next) => {
					async.series([ // entries
						next => utils.filterKeys(context, [ '$id' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$type' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							utils.intrinsic.filter['Type2{$optional:true}'](context, utils.intrinsic.filter['Type2{$optional:true}'].functions, renamed, next);
						}, next),
						next => utils.filterKeys(context, [ '$any', '$switch' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									utils.buildArray(context, (next) => {
										async.timesSeries(source[key].length, (key, next) => { next = utils.defer(utils.nullifyTrue(next)); // array entries
											utils.filterIndex(context, key, (context, source, target, key, next) => {
												utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
											}, next)
										}, next);
									}, next);
								}, next => {
									target[context.rename] = target[context.rename].filter(() => true);
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$remove' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$insert' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$default' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$map' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$optional' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$parallel' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$message' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$lt', '$lte', '$eq', '$ne', '$gte', '$gt' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$in', '$nin' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Array)) return utils.mustBeType(context, source, key, Array, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Object)) return utils.mustBeType(context, source, key, Object, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$inc', '$ninc' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Boolean)) return utils.mustBeType(context, source, key, Boolean, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Number)) return utils.mustBeType(context, source, key, Number, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], RegExp)) return utils.mustBeType(context, source, key, RegExp, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Date)) return utils.mustBeType(context, source, key, Date, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$match' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], RegExp)) return utils.mustBeType(context, source, key, RegExp, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$name', '$constructor' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$length', '$minlen', '$maxlen' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Number)) return utils.mustBeType(context, source, key, Number, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$rename' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.series([ // any all
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
								next => (next => { // any option 
									async.waterfall([
										next => {
											if (source[key] === undefined) return next(true);
											if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
											target[context.rename] = source[key];
											next(null);
										}
									], utils.nullifyTrue(next));
								})(utils.filterOutTrue(context, next)),
							], (found, errors) => next(found ? null : utils.listStringArray(errors)));
						}, next),
						next => utils.filterKeys(context, [ '$toArray', '$toObject' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], String)) return utils.mustBeType(context, source, key, String, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$filter', '$transform', '$final' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									if (!utils.isType(source[key], Function)) return utils.mustBeType(context, source, key, Function, next);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next),
						next => utils.filterKeys(context, [ '$args' ], keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next)
					], err => utils.filterRest(err, context, keys, (context, source, target, key, next) => { next = utils.defer(utils.nullifyTrue(next)); // object entries
							async.waterfall([
								next => {
									if (source[key] === undefined) return next(true);
									target[context.rename] = source[key];
									next(null);
								}
							], utils.nullifyTrue(next));
						}, next));
				}, next);
			}, next => {
				next(null);
			}
		], utils.nullifyTrue(next));
	}
});
filter['Shell2{$optional:true}'].functions = [];
filter['Shell2{$optional:true}'].timestamp = 1622821920189;
filter['Shell2{$optional:true}'].compiler  = 'v2';

Object.assign(filter, { 'type2':
	function(context, functions, renamed, next) { // v2, key: type2, timestamp: 1622821920180
		const source = context.source, target = context.target, key = context.key;
		utils.intrinsic.filter['Type2{}'](context, utils.intrinsic.filter['Type2{}'].functions, renamed, next);
	}
});
filter['type2'].functions = [];
filter['type2'].timestamp = 1622821920180;
filter['type2'].compiler  = 'v2';

module.exports.timestamp = 1622821920235;
