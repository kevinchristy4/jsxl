'use strict';

// scripts hold
// String (code)
// Array(String) (code)
// Number (indentation)
// Script (code and indentation)

const Script = module.exports = function Script(...args) {
	this._enabled = true;
	this._lines = [];
	Script.prototype.push.apply(this, args);
	return this;
};

Script.prototype.enable = function() {
	this._enabled = true;
	if (this._enableHandler) this._enableHandler(this._enableObject); 
	return this;
};

Script.prototype.disable = function(handler, object) {
	this._enableHandler = handler; 
	this._enableObject = object; 
	this._enabled = false; 
	return this;
};

Script.prototype.isEmpty = function() {
	return this._lines.length == 0;
};

Script.prototype.name = function(name) {
	this._name = name; 
	return this;
};

Script.prototype.find = function(name) {
	if (this._name == name) return this;
	
	for (let i = 0; i < this._lines.length; i++) {
		if (this._lines[i] !== undefined && this._lines[i].constructor === Script) {
			const found = this._lines[i].find(name);
			if (found) return found;
		}
	}
	return false;
};

Script.prototype.separator = function(separator) {
	this._separator = separator; 
	return this;
};

Script.prototype.push = function(...args) {
	args.map(arg => { if (arg && arg.constructor !== String && arg.constructor !== Script) throw new Error('illegal script element ' + arg) })
	this._lines = this._lines.concat(...args); 
	return this;
};

Script.prototype.substitute = function(script) {
	this._lines = script._lines; 
	return this;
};

//function replaceArray(array, values) {
//	for (let i = 0; i < array.length; i++) {
//		if (array[i] !== undefined) switch(array[i].constructor) {
//		case Array:
//			replaceArray(array[i], values);
//			break;
//		case Script:
//			replaceArray(array[i]._lines, values);
//			break;
//		case String:
//			for (const v in values)
//				array[i] = array[i].replace(new RegExp('{' + v + '}', 'g'), values[v]);
//			break;
//		}
//	}
//}
//
//Script.prototype.replaceNEW = function() {
//    for (const values of arguments) // allow multiple arguments
//    	replaceArray(this._lines, values);
//	return this;
//};

Script.prototype.replace = function(...args) {
    for (const values of args) // allow multiple arguments
		for (let i = 0; i < this._lines.length; i++)
			if (this._lines[i] !== undefined) switch(this._lines[i].constructor) {
			case String:
				for (const v in values)
					this._lines[i] = this._lines[i].replace(new RegExp('{' + v + '}', 'g'), values[v]);
				break;
			case Script:
				this._lines[i].replace(values);
				break;
			} 
	return this;
};

const counters = {
	'(':  1,			// x1
	')': -1,
	'{':  65536,		// x10000
	'}': -65536,
	'[':  4294967296,	// x100000000
	']': -4294967296
};

function opening(code) {
	const pars = code.match(/[\(\)\{\}\[\]]/g) || [];
	let count = 0;
	for (let i = pars.length - 1; i > -1; i--) {
		count += counters[pars[i]];
		if (count > 0) return 1;
	}
	return 0;
}

function closing(code) {
	const pars = code.match(/[\(\)\{\}\[\]]/g) || [];
	let count = 0;
	for (let i = 0; i < pars.length; i++) {
		count += counters[pars[i]];
		if (count < 0) return 1;
	}
	return 0;
}

Script.prototype._generate = function (tab, pipe) {
	function handleLine(line) {
		if (line) {
			tab -= Math.max(0, closing(line));
			pipe.output(tab, line);
			tab += opening(line);
		}
	}
	if (this._enabled) {
		for (let i = 0; i < this._lines.length; i++) {
			if (this._lines[i] !== undefined) switch(this._lines[i].constructor) {
			case Number:
				if (this._lines[i] == 0) pipe.concat(); 
		        else tab = Math.max(0, tab + this._lines[i]);
				break;
			case String:
				this._lines[i].split('\n').map((line) => { handleLine(line); });
				break;
			case Script:
				this._lines[i]._generate(tab, pipe);
				break;
			}
			
			if (this._separator && i < this._lines.length - 1) pipe.append(this._separator);
		}
	}
};

Script.prototype.generate = function(output) {
	const pipe = new Pipe(output);
	this._generate(0, pipe);
	pipe.flush();
	return this;
};

Script.prototype.log = function() {
	console.log('-------');
	this.generate(console.log);
	return this;
};

Script.prototype.toString = function() {
	let string = '';
	this.generate((line, separator) => {
		string += (line + (separator || '') + '\n');
	});
	return string;
};


//
// Pipe delays output by one to allow for appending
//

const Pipe = function Pipe(output) {
	this._output = output;
};

Pipe.prototype.output = function(tab, line) { 
	if (this._concat) {
        this._line = (this._line || '') + line;
        this._concat = false;
    }
	else {
		if (this._line !== undefined) this._output(this._line);
		this._line = Array(tab + 1).join('\t') + line;
	}
};

Pipe.prototype.concat = function() {
    this._concat = true;
};
 
Pipe.prototype.isConcat = function() {
    return this._concat;
};

Pipe.prototype.append = function(line) {
	this._line = (this._line || '') + line;  
};

Pipe.prototype.flush = function() {
	if (this._line) this._output(this._line);
};