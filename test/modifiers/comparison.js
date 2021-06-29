const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Comparision modifier tests',()=>{

    it('Verify comparison - pass and fail',()=>{

        jsxlFunction.verifyResult('verify expected output with no errors',jsxlFunction.jsxlDirect(input.comparisonPositive,filter.comparisionFilter),'pass',input.comparisonPositive);
        jsxlFunction.verifyResult('verify error if comparison fails at level 0',jsxlFunction.jsxlDirect(input.compareErrorInput,filter.comparisionFilter),'fail',null,output.compareError);
        jsxlFunction.verifyResult('verify error if comparison fails at level 1',jsxlFunction.jsxlDirect(input.compareError1Input,filter.comparisionFilter),'fail',null,output.compareError1);

    })

    it('Pass null or Undefined as input',()=>{

        //passing undefined and new line operator
        //Passing undefined and "\n" as direct values has no effect on the output - but they are converted to string while passed within function

        jsxlFunction.verifyResult('Pass undefined as value in a function',jsxlFunction.jsxlDirect(input.compareUndefine,filter.comparisonUndefined),'fail',null,output.compareUndefinedFunc);
        // jsxlFunction.verifyResult('Pass undefined as value directly',jsxlFunction.jsxlDirect(input.compareUndefine,filter.comparisonUndefinedDirect),'fail',null,output.compareundefinedDir);
        jsxlFunction.verifyResult('Pass newline opeartor as value in a function',jsxlFunction.jsxlDirect(input.compareNewLine,filter.comparisonNewLine),'fail',null,output.compareNewLineFunc);
        // jsxlFunction.verifyResult('Pass undefined as value in a function',jsxlFunction.jsxlDirect(input.compareNewLine,filter.comparisonNewLineDirect),'fail',null,output.compareNewLineDir);


    })

    it('Use with other modifiers',()=>{

        jsxlFunction.verifyResult('Use comparison with other modifiers',jsxlFunction.jsxlDirect(input.compareOtherModifiers,filter.comparisonOtherModifiers),'pass',output.compareOtherModifiers);

    })
})