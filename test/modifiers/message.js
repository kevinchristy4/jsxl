const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Message modifier tests',()=>{

    it('Verify message if error',()=>{

        jsxlFunction.verifyResult('Verify message present in error',jsxlFunction.jsxlDirect(input.message,filter.message),'fail',null,output.message);
        jsxlFunction.verifyResult('Verify no message present',jsxlFunction.jsxlDirect(input.messageNoError,filter.message),'pass',input.messageNoError);


    })

    it('Pass other data types',()=>{

        jsxlFunction.verifyResult('Pass Number',jsxlFunction.jsxlDirect(input.message,filter.messageNumber),'fail',null,output.messageTypeError);
        jsxlFunction.verifyResult('Pass Null',jsxlFunction.jsxlDirect(input.message,filter.messageNull),'fail',null,output.messageTypeError1);
        jsxlFunction.verifyResult('Pass Function',jsxlFunction.jsxlDirect(input.message,filter.messageFunc),'fail',null,output.messageTypeError2);

        //Passing "\n" as a message causes the application to break
        //Fixed
        jsxlFunction.verifyResult('Verify message present in error',jsxlFunction.jsxlDirect(input.message,filter.messageNewLine),'fail',null,output.msgNewLineMsg);


    })
})