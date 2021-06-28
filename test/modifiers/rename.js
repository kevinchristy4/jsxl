const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Rename modifier tests',()=>{

    it('Rename entry key',()=>{

        jsxlFunction.verifyResult('Rename an object entry key',jsxlFunction.jsxlDirect(input.renameKeys,filter.rename),'pass',output.renameKeys);

        //Using $rename inside an array returns the last object of the array if passing an integer as string - otherwise no value is returned
        jsxlFunction.verifyResult('Use rename inside array',jsxlFunction.jsxlDirect(input.renameKeys,filter.renameInsideArray),'pass',output.renameInsideArray);

    })

    it('Pass other datatypes',()=>{

        jsxlFunction.verifyResult('Pass number directly',jsxlFunction.jsxlDirect(input.renameKeys,filter.renamePassNumber),'fail',null,output.renameOtherDatatype);
        jsxlFunction.verifyResult('Pass null directly',jsxlFunction.jsxlDirect(input.renameKeys,filter.renamePassNull),'fail',null,output.renamePassNull);

        //Passing undefined has no effect on output
        jsxlFunction.verifyResult('Pass undefined directly',jsxlFunction.jsxlDirect(input.renameKeys,filter.renamePassUndefined),'pass',output.renameUndefined);

        //Passing different data types via next() converts the input to string regardless of the datatype
        jsxlFunction.verifyResult('Pass otherdatatypes inside function',jsxlFunction.jsxlDirect(input.renameKeys,filter.renameDatatypesViaFunc),'pass',output.renameOtherDatatypesFunc);

        //Passing a constructor directly breaks the application
        // jsxlFunction.verifyResult('Pass Function keyword directly',jsxlFunction.jsxlDirect(input.renameKeys,filter.renamePassConstruc),'fail',null,"TBD");

        //Passing new line operator breaks application
        // jsxlFunction.verifyResult('Pass new line operator directly',jsxlFunction.jsxlDirect(input.renameKeys,filter.renamePassNewLine),'fail',null,"TBD");

    })

    it('Use alongside other modifier',()=>{

        jsxlFunction.verifyResult('Use $rename with other modifiers',jsxlFunction.jsxlDirect(input.renameWithModifiers,filter.renameWithOtherModifiers),'pass',output.renameOtherModifiers);

    })
})