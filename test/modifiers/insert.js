const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Insert Modifier Tests',()=>{

    it('Insert values and verify output',()=>{

        jsxlFunction.verifyResult('Insert value at top level',jsxlFunction.jsxlDirect(input.insertInput,filter.insertFilterAtTop),'fail',null,output.topLvlInsert);

        //This test will not pass because using "\n" as value for insert throws error -  Uncaught SyntaxError: Invalid or unexpected token
        //Fixed
        jsxlFunction.verifyResult('Insert value at all level',jsxlFunction.jsxlDirect(input.insertInput,filter.insertAtAllLvl),'pass',output.insertAlllvl);

        jsxlFunction.verifyResult('Insert null and undefined at all level',jsxlFunction.jsxlDirect(input.insertInput,filter.insertNullUndefined),'pass',output.insertNullUndefined);
    })

    it('Use $insert along different modifiers',()=>{

        jsxlFunction.verifyResult('Insert different datatype from $type value',jsxlFunction.jsxlDirect(input.insertInput,filter.insertUseAlongType),'fail',null,output.insertDifferentTypeError);
        jsxlFunction.verifyResult('Insert with $remove and $default',jsxlFunction.jsxlDirect(input.insertInput,filter.useInsertWithRemoveDefault),"fail",null,output.useInsertWithRemoveDefault)
    })

    it('Insert values that are not present in Input',()=>{

        jsxlFunction.verifyResult('Insert missing values and verify transform overrides $insert',jsxlFunction.jsxlDirect(input.insertPartialInput,filter.insertValuesNotPresent),'pass',output.insertValues);

    })
})