const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Transform filter tests',()=>{

    it('$transform - Transform some values in an object and verify',()=>{

        jsxlFunction.verifyResult('change object values',jsxlFunction.jsxlDirect(input.transform1,filter.transformObject),'pass',output.transform1);
        jsxlFunction.verifyResult('remove object values',jsxlFunction.jsxlDirect(input.transform_removeValue,filter.removeAnKeyValue),'pass',output.removeValue);

    })

    it('$transform - Pass other data types',()=>{

        jsxlFunction.verifyResult('pass null and undefined in next()',jsxlFunction.jsxlDirect(input.transform_null_undefined,filter.pass_null_Undefined),'pass',output.nullUndefined);
        jsxlFunction.verifyResult('pass values directly',jsxlFunction.jsxlDirect(input.transform_otherDataTypes,filter.passOtherDataTypes),'fail',null,output.typeError);

    })

    it('$transform - Values transformed at the top level are not transformed again at low levels',()=>{

        // Doubt? - In the $filter for lvl0 - if false is passed, then lvl0 is appended to the end of object 
        jsxlFunction.verifyResult('Verify if modified values are accesible in sub sections',jsxlFunction.jsxlDirect(input.transform_validateModifiedValues,filter.passdownModifiedValues),'pass',output.verifyMofifiedValue);

    })
})