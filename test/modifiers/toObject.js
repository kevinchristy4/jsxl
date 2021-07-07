const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('ToObject Modifers test',()=>{

    it('Use toObject at different levels',()=>{

        jsxlFunction.verifyResult('Pass expected input and filter',jsxlFunction.jsxlDirect(input.toObjectPass,filter.toObjPass),'pass',output.toObjectPass);

    })

    it('Pass different datatypes as value in filter',()=>{

        jsxlFunction.verifyResult('Pass Number as parameter',jsxlFunction.jsxlDirect(input.toObjectPass,filter.toObjFailNumber),'fail',null,output.toObjFailNumber);
        jsxlFunction.verifyResult('Pass Function as parameter',jsxlFunction.jsxlDirect(input.toObjectPass,filter.toObjFailFunction),'fail',null,output.toObjFailFunc);

    })

    it('Pass different datatypes in input',()=>{

        jsxlFunction.verifyResult('Pass String as Input value',jsxlFunction.jsxlDirect(input.toObjectString,filter.toObjPass),'fail',null,output.toObjStrInput);
        jsxlFunction.verifyResult('Pass String at lvl1 as Input value',jsxlFunction.jsxlDirect(input.toObjectStringlvl1,filter.toObjPass),'fail',null,output.toObjStrInputlvl1);

        //Passing an empty array has no effect - should throw error no key found
        // jsxlFunction.verifyResult('Pass empty array as input',jsxlFunction.jsxlDirect(input.toObjectEmpArr,filter.toObjPass),'fail',null,output.toObjNoKey);

        jsxlFunction.verifyResult('Pass array with no key as specified in filter',jsxlFunction.jsxlDirect(input.toObjectArrNoKey,filter.toObjPass),'fail',null,output.toObjNoKey);

        jsxlFunction.verifyResult('Pass a number as value for the key specified in filter',jsxlFunction.jsxlDirect(input.toObjectNumberValue,filter.toObjPass),'fail',null,output.toObjStrKey);
        jsxlFunction.verifyResult('Pass undefined as value for the key specified in filter',jsxlFunction.jsxlDirect(input.toObjectundefinedValue,filter.toObjPass),'fail',null,output.toObjUndefinedKey);

    })

    it('Use With Other modofoers',()=>{

        jsxlFunction.verifyResult('Use with other modifiers',jsxlFunction.jsxlDirect(input.toObjectWithotherModifier,filter.toObjOthModifier),'pass',output.toObjectWithOtherModifier);

    })
})