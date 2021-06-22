const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');
const { optionalTrue } = require('../test_data/filters');

describe('Optional modifiers Test',()=>{

    it('Set optional to true and false',()=>{

        jsxlFunction.verifyResult('No input values - $optional:true ',jsxlFunction.jsxlDirect(input.optionalNoInputValues,filter.optionalTrue),'pass',output.optionalTrue);
        jsxlFunction.verifyResult('$optional at top level',jsxlFunction.jsxlDirect({},filter.optionalAtTopandFalse),'fail',null,output.optionalAtTopError);

    })

    it('$optional along with other modifiers',()=>{

        jsxlFunction.verifyResult('$optional:false with other modifiers',jsxlFunction.jsxlDirect({},filter.optionalAlongWithInsertDefault),'fail',null,output.optionalAlongWithOtherModifiers);

    })

    it('Pass other data types to $optional',()=>{

        jsxlFunction.verifyResult('Pass different dataTypes at different levels',jsxlFunction.jsxlDirect(input.defaultWithValues,filter.optionalWithOtherDatatype),'fail',null,output.optionalWithOtherDatatype);

    })
})