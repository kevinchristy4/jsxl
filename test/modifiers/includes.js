const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');


describe('In and Includes Modifier tests',()=>{

    // ToDo -- Write separate scenarios for $nin and $ninc if needed

    it('$in and $nin modifier tests',()=>{

        jsxlFunction.verifyResult('$in_$nin - pass',jsxlFunction.jsxlDirect(input.inPass,filter.in_nin),'pass',input.inPass);
        jsxlFunction.verifyResult('$in - fail',jsxlFunction.jsxlDirect(input.inFail,filter.in_nin),'fail',null,output.inFail);
        jsxlFunction.verifyResult('$nin - fail',jsxlFunction.jsxlDirect(input.ninFail,filter.in_nin),'fail',null,output.ninFail);

    })

    it('Pass invalid data types',()=>{

        //Pass invalid data types directly

        //passing \n inside array or object breaks application
        //Fixed
        jsxlFunction.verifyResult('Pass \n in array',jsxlFunction.jsxlDirect(input.inPass,filter.inNewLineArr),'pass',output.inNewLineInArray);

        //Fixed
        jsxlFunction.verifyResult('Pass \n in object',jsxlFunction.jsxlDirect(input.inPass,filter.inNewLineObj),'pass',input.inPass);

        //Not fixed
        // jsxlFunction.verifyResult('Pass Function directly',jsxlFunction.jsxlDirect(input.inPass,filter.inFuncDir),'fail',null,"TBD");

        //Passing string,undefined directly
        jsxlFunction.verifyResult('Pass String directly',jsxlFunction.jsxlDirect(input.inPass,filter.inStringDir),'fail',null,output.inStringError);
        jsxlFunction.verifyResult('Pass Undefined directly',jsxlFunction.jsxlDirect(input.inPass,filter.inUndefinedDir),'pass',input.inPass);

        //Passing Number via next() - breaks application
        //Fixed
        jsxlFunction.verifyResult('Pass number via next()',jsxlFunction.jsxlDirect(input.inPass,filter.inNumViaFunc),'fail',null,output.inPassNumViaFunc);

    })

    it('Use $in and $nin with oher modifiers',()=>{

        jsxlFunction.verifyResult('$in with other modifiers',jsxlFunction.jsxlDirect(input.inWithOtherModifier,filter.inOtherModifier),'pass',output.inOtherModifier);

    })

    ///// $inc and $ninc

    it('$inc and $ninc with valid data',()=>{

        jsxlFunction.verifyResult('$inc_$ninc pass',jsxlFunction.jsxlDirect(input.incPass,filter.incPass),'pass',input.incPass);
        jsxlFunction.verifyResult('$inc Error',jsxlFunction.jsxlDirect(input.incFail,filter.incPass),'fail',null,output.incError);
        jsxlFunction.verifyResult('$inc error at top',jsxlFunction.jsxlDirect(input.incFailAtTop,filter.incPass),'fail',null,output.incFailAtTop);
        jsxlFunction.verifyResult('$ninc fail',jsxlFunction.jsxlDirect(input.nincFail,filter.incPass),'fail',null,output.nincFail);

    })

    it('Pass invalid data types to $inc',()=>{

        // passing \n or Function keyword directly breaks the application
        jsxlFunction.verifyResult('$inc pass new line operator',jsxlFunction.jsxlDirect(input.incPass,filter.incNewLine),'pass',output.incPassNewLineDir);

        //Not fixed
        // jsxlFunction.verifyResult('$inc pass Function keyword',jsxlFunction.jsxlDirect(input.incPass,filter.incFuncDir),'fail',null,"TBD");

        jsxlFunction.verifyResult('$inc pass array directly',jsxlFunction.jsxlDirect(input.incPass,filter.incPassArrDir),'fail',null,output.incTypeError);
        jsxlFunction.verifyResult('$inc pass object directly',jsxlFunction.jsxlDirect(input.incPass,filter.incPassObjDir),'fail',null,output.incTypeError1);
        jsxlFunction.verifyResult('$inc pass other datatypes via func',jsxlFunction.jsxlDirect(input.incPass,filter.incOtherDataTypesViafunc),'fail',null,output.incTypError2);

        //Passing values other than object or arrays breaks the application
        jsxlFunction.verifyResult('$inc pass number as input',jsxlFunction.jsxlDirect(input.incNumbe,filter.incPass),'fail',null,output.incPassNumberInput);
        jsxlFunction.verifyResult('$inc pass String as input',jsxlFunction.jsxlDirect(input.incString,filter.incPass),'fail',null,output.incPassStringInput);

    })

    it('Use $inc with other modifiers',()=>{

        //the $inc is executes before $rename so can't verify the rename key
        //Not fixed
        jsxlFunction.verifyResult('$inc with other modifiers',jsxlFunction.jsxlDirect(input.incWithOtherModifiers,filter.incWithOtherModifiers),'pass',output.incWithOtherModifier);

    })
})