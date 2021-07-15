const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Array Length Modifiers tests',()=>{

    it('Verify length of arrays',()=>{

        jsxlFunction.verifyResult('Pass valid values',jsxlFunction.jsxlDirect(input.length,filter.lengthPass),'pass',input.length);
        jsxlFunction.verifyResult('Fail on max length',jsxlFunction.jsxlDirect(input.lengthFailMax,filter.lengthPass),'fail',null,output.lengthMax);
        jsxlFunction.verifyResult('Fail on min length',jsxlFunction.jsxlDirect(input.lengthFailMin,filter.lengthPass),'fail',null,output.lengthMin);
        jsxlFunction.verifyResult('Fail on length',jsxlFunction.jsxlDirect(input.lengthFail,filter.lengthPass),'fail',null,output.lengthLen);

    })

    it('Pass Other data types',()=>{

        jsxlFunction.verifyResult('Pass String directly',jsxlFunction.jsxlDirect(input.length,filter.lengthString),'fail',null,output.lengthTypeError);
        jsxlFunction.verifyResult('Pass null directly',jsxlFunction.jsxlDirect(input.length,filter.lengthNull),'fail',null,output.lengthTypeError1);

        //passing Function keyword breaks the application
        //Not Fixed
        jsxlFunction.verifyResult('Pass Function keyword directly',jsxlFunction.jsxlDirect(input.length,filter.lengthFuncDir),'fail',null,output.PassFuncKeyword);

        //Pass other data types via next()
        jsxlFunction.verifyResult('Pass Function keyword via next directly',jsxlFunction.jsxlDirect(input.length,filter.lengthOtherDataFunc),'fail',null,output.lengthErrorFunc);
        jsxlFunction.verifyResult('Pass object via next directly',jsxlFunction.jsxlDirect(input.length,filter.lengthOtherDataObj),'fail',null,output.lengthErrorObj);

        //pass undefined
        jsxlFunction.verifyResult('Pass undefined as value',jsxlFunction.jsxlDirect(input.length,filter.lengthOtherUndefined),'fail',null,output.lengthUndefined);

    })

    it('Use $length With other modifiers',()=>{

        jsxlFunction.verifyResult('Use length modifers with other modifiers',jsxlFunction.jsxlDirect(input.lengthWithOther,filter.lengthWithOtherModifiers),'pass',output.lengthWithOtherModifier);

    })
})