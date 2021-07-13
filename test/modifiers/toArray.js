const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('ToArray Modifier test',()=>{

    it('Verify output with proper input and filter at different levels',()=>{

        jsxlFunction.verifyResult('Pass expected input and filter',jsxlFunction.jsxlDirect(input.toArrInput,filter.toArrayPass),'pass',output.toArrayPass);
        jsxlFunction.verifyResult('Use with other modifiers',jsxlFunction.jsxlDirect(input.toArrayWithOtherMod,filter.toArrayWithOtherMod),'pass',output.toArrayOtherMod);

        //Calling $toArray at top level and also converting deeper level object to Array - Object key and value is directly appended to the output.
        jsxlFunction.verifyResult('Use $toArray at top level',jsxlFunction.jsxlDirect(input.toArrInputTop,filter.toArrayAtTop),'fail',null,output.toArrayTopLevel);

    })

    it('Pass other data types and verify error',()=>{

        jsxlFunction.verifyResult('Pass null in filter',jsxlFunction.jsxlDirect(input.toArrInput,filter.toArrayPassNull),'fail',null,output.toArrayNull);

    })

    it('Object with value of key not of object',()=>{

        //If object doesnot contain another object within then error is thrown
        jsxlFunction.verifyResult('Use with incompatible objects pattern',jsxlFunction.jsxlDirect(input.toArrInputIncompatible,filter.toArrayPass),'fail',null,output.toArrayIncompatible);

    })
})