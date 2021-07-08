const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Default modifier tests',()=>{

    it('Set default values and verify output',()=>{

        jsxlFunction.verifyResult('verify default doesnot work if value already present',jsxlFunction.jsxlDirect(input.defaultWithValues,filter.defaultFilter),'pass',output.defaultValuePresemt);
        jsxlFunction.verifyResult('Set default values if undefined',jsxlFunction.jsxlDirect(input.defaultInput,filter.defaultFilter),'pass',output.defaultOutput);

        //This test will not pass because using "\n" as value for default throws error -  Uncaught SyntaxError: Invalid or unexpected token
        //Fixed
        jsxlFunction.verifyResult('Set default to undefined values',jsxlFunction.jsxlDirect(input.defaultInput,filter.defaultUndefinedFilter),'pass',output.defaultUndefinedOutput);

        jsxlFunction.verifyResult('Set default at top level',jsxlFunction.jsxlDirect(undefined,filter.defaultAtTop),'pass',{one:1});


    })

    it('Set default values if they are not present in input and Verify $transform, $filter overwrites final output',()=>{

        jsxlFunction.verifyResult('$transform overwrites $default',jsxlFunction.jsxlDirect(input.insertPartialInput,filter.defaultMissingvalues),'pass',output.insertValues);
        jsxlFunction.verifyResult('Default along with $type and $filter',jsxlFunction.jsxlDirect(input.defaultInput,filter.defaultWithFilter_Type),'fail',null,output.defaultErrorWithType);

    })

    it('Use default along with $remove and $insert',()=>{

        jsxlFunction.verifyResult('Default with $remove $insert',jsxlFunction.jsxlDirect(input.defaultInput,filter.defaultwithInsert_remove),'fail',null,output.useInsertWithRemoveDefault);

    })
})