const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Map modifiers test',()=>{

    xit('Map String to values along with other modifers',()=>{

        jsxlFunction.verifyResult('Map string to any values',jsxlFunction.jsxlDirect(input.mapStringInput,filter.mapSimpleFilter),'pass',output.mapWithString);

        //This test will throw an error 'Uncaught ReferenceError: sourceMustBeOfType is not defined'
        //Fixed
        jsxlFunction.verifyResult('Map datatypes other than string to any values',jsxlFunction.jsxlDirect(input.mapOtherDatatype,filter.mapOtherDatatypes),'fail',null,output.mapOtherDattypeInput);

        //This test will throw an error 'Uncaught ReferenceError: sourceMustBeOfType is not defined'
        //Fixed
        jsxlFunction.verifyResult('Input doesnot contain mapped keys',jsxlFunction.jsxlDirect(input.mapToValuesNotPresent,filter.mapSimpleFilter),'fail',null,output.mapInputNotPresentInFilter);

        jsxlFunction.verifyResult('Pass undefined directly to $map',jsxlFunction.jsxlDirect(input.mapStringInput,filter.mapPassUndefinedDirectly),'fail',null,output.mapUndefinedError);
        jsxlFunction.verifyResult('Pass other datatypes directly to $map',jsxlFunction.jsxlDirect(input.mapStringInput,filter.mapPassOtherDiretcly),'fail',null,output.mapOtherdirectly);

    })

    xit('Map Number To array',()=>{

        jsxlFunction.verifyResult('Map Number to Objects',jsxlFunction.jsxlDirect(input.mapNumberToArray,filter.mapNumberToArray),'pass',output.mapNumberToArray);

        //This test will throw an error 'Uncaught ReferenceError: sourceMustBeInRange is not defined'
        //Fixed
        jsxlFunction.verifyResult('Map Number greater than array length',jsxlFunction.jsxlDirect(input.mapNumberOutOfRange,filter.mapNumberToArray),'fail',null,output.mapOutOfArrayRange);

        //This test will throw an error 'Uncaught ReferenceError: sourceMustBeOfType is not defined'
        //Fixed
        jsxlFunction.verifyResult('pass datatype other than numerics',jsxlFunction.jsxlDirect(input.mapOtherToArray,filter.mapNumberToArray),'fail',null,output.mapInputOtherThanNumber);

    })
})