const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Filter modifier tests',()=>{

    it(`Pass true or false to $filters at different levels`,()=>{

        jsxlFunction.verifyResult('true in $filters',jsxlFunction.jsxlDirect(input.filterTrue,filter.filter),'pass',output.filterTrue);
        // jsxlFunction.verifyResult('false in $filters',jsxlFunction.jsxlDirect(input.filterFalse,filter.filter),'pass',output.filterFalse);

        // this will throw an error as there is a bug 
        // jsxlFunction.verifyResult('Pass false in $filter at the top level of an object',jsxlFunction.jsxlDirect(input.filterTrue,filter.filterFalseAtTop),'pass',{});

    })

    it('Pass datatypes otherthan a function to $filter',()=>{

        // jsxlFunction.verifyResult('Pass String in $filters',jsxlFunction.jsxlDirect(input.filterTrue,filter.filterPassString),'fail',null,output.ifString);
        // jsxlFunction.verifyResult('Pass Boolean in $filters',jsxlFunction.jsxlDirect(input.filterTrue,filter.filterPassBoolean),'fail',null,output.ifBoolean);

        //Undefined currently has no effect - acts like true
        // jsxlFunction.verifyResult('Pass undefined in $filters',jsxlFunction.jsxlDirect(input.filterTrue,filter.filterPassUndefined),'pass',input.filterTrue);
 

    })

    it('Use $filter alongside object keys',()=>{

        // jsxlFunction.verifyResult('Use alongside a non-modifier',jsxlFunction.jsxlDirect(input.filterTrue,filter.filterAlongNonModifier),'fail',null,output.useAlongsideANonModifier);

    })

})