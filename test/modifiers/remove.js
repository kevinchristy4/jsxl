const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Remove modifier tests',()=>{
    
    it('Pass true and false',()=>{

        jsxlFunction.verifyResult('remove object values',jsxlFunction.jsxlDirect(input.removeInput,filter.removeFilter),'pass',output.remove_test);

    })

    it('Pass other data types',()=>{

        jsxlFunction.verifyResult('pass a string',jsxlFunction.jsxlDirect(input.removeInput,filter.remove_stringDatatype),'fail',null,output.stringerror);
        jsxlFunction.verifyResult('pass null',jsxlFunction.jsxlDirect(input.removeInput,filter.remove_null_undefined),'fail',null,output.nullError);

    })

    it('Use $remove at the top level',()=>{

        //Using $remove at top level returns undefined - not an empty object - have to clarify
        //Fixed
        jsxlFunction.verifyResult('$remove at object top level',jsxlFunction.jsxlDirect(input.removeInput,filter.remove_topLevel),'pass','undefined');

    })

})