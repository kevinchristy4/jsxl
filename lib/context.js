'use strict';
const utils = require('./utils');

const Context = module.exports = function Context(context, key, rename) {
// TODO remove	
if (context.key === key && key == 'Object{}') throw new Error('suspect context construction: ' + key)

	
	if (context.constructor === Context) {
		if (key === undefined) {
			// clone context
			Object.assign(this, context);
		} else { 
			// sub context
			this.context = context;
			this.path = context.fullpath();
			this.source = context.source[context.key];
			this.target = context.target[context.rename]; // TODO trying out rename
			if (this.target === undefined && this.source !== undefined) 
				if (utils.likeObject(this.source)) this.target = {};
				else if (utils.likeArray(this.source)) this.target = [];
				else throw new Error('illegal context');
			this.key = key;
			this.rename = rename || key; // TODO trying out rename
			this.parameters = context.parameters;
			this.scope = Object.assign({}, context.scope); // copy scope
		}
	} else { // create context
		if (key !== undefined) throw new Error('cannot specify key in base context creation');
		const keys = Object.keys(context); 
		if (keys.length == 1 && !['context', 'path', 'source', 'target', 'key', 'parameters', 'scope'].includes(keys[0])) {
			// using short hand
// TODO test that key is not a modifier
			this.path = '';
			this.key = this.rename = keys[0];
			this.source = { [this.key]: context[this.key] };
			this.target = {};
			this.parameters = {};
			this.scope = {};
		} else { 
			// using long hand
			this.path = context.path || '';
			this.source = context.source || {};
			this.target = context.target;
			if (this.target === undefined) 
				if (utils.likeObject(this.source)) this.target = {};
				else if (utils.likeArray(this.source)) this.target = [];
				else throw new Error('illegal context');
			this.key = context.key;
			this.rename = context.rename || context.key; 
			this.parameters = context.parameters || {};
			this.scope = context.scope || {}; 
		}
	}
	if (this.source[this.key]) {
		if (this.source[this.key].toObject) this.source[this.key] = this.source[this.key].toObject();
		else if (this.source[this.key].toArray) this.source[this.key] = this.source[this.key].toArray();
	}
	if (this.source === this.target) 
		throw new Error(`Context target equals source at ${context.fullpath()}`);
}

Context.prototype.extend = function(source) {
	return new Context({ context: this, source, key: Object.keys(source)[0], parameters: this.parameters })
}

Context.prototype.copySource = function() {
	if (utils.likeObject(this.source)) this.source = Object.assign({}, this.source);
	else if (utils.likeArray(this.source)) this.source = [].concat(this.source);
	else throw new Error('illegal context');
	return this;
}

Context.prototype.setDefaultTarget = function(target) {
	if (this.target === undefined) this.target = target;
	return this;
}

Context.prototype.setScopeEntry = function(key, value) {
	this.scope[key] = value;
	return this;
}

Context.prototype.fullpath = function() {
if (this.key === undefined) console.log(3434, this);	
	switch(this.key.constructor) {
	case Array:  return this.path + `[${JSON.stringify(this.key.join("|"))}]`; 
	case String: return this.path + (this.key.match(/^[\$a-zA-Z_][\.\:\$a-zA-Z_0-9]*$/) ? (this.path ? '.' : '') + `${this.key}` : `[${JSON.stringify(this.key)}]`);
	case Number: return this.path +`[${this.key}]`; 
	default:     return this.path + `(${this.key})`;
	}
}

//
// purpose of shifting is to place target values into source values, allowing processing on newly calculated values
//
Context.prototype.shift = function() {
	if (utils.likeArray(this.source)) { 
		this.source[this.key] = this.target[this.key];
		// if we ever have target === source then we have a problem
		if (this.target === this.source) throw new Error(`target === source at ${this.fullpath()}`);		
        this.target.pop(); // remove last array entry 
		// array entries are not renamed
	} else if (utils.likeObject(this.source)) {
		delete this.source[this.key];
		       this.source[this.rename] = this.target[this.rename];
	    delete                            this.target[this.rename];
		this.key = this.rename;
	}
	else throw new Error('illegal context');
	return this;
}
