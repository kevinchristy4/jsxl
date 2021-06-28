const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Match modifier tests',()=>{

    it('Verify with regex,function and string',()=>{

        jsxlFunction.verifyResult('Pass regex,string,func',jsxlFunction.jsxlDirect(input.matchPass,filter.matchPass),'pass',input.matchPass);
        jsxlFunction.verifyResult('Fail at regex as func',jsxlFunction.jsxlDirect(input.matchFailFunc,filter.matchFail),'fail',null,output.matchRegexFunc);
        jsxlFunction.verifyResult('Fail at regex direct',jsxlFunction.jsxlDirect(input.matchFailDir,filter.matchFail),'fail',null,output.matchRegexDir);
        jsxlFunction.verifyResult('Fail passed as string',jsxlFunction.jsxlDirect(input.matchFailStr,filter.matchFail),'fail',null,output.matchString);

    })

    it('Verify undefined and other datatypes',()=>{

        //Passing undefined or other irrelevant datatypes inside next() produces generic match modifier error message - (execute v2) input.lvl0 must match ()=>{}
        //Passing undefined directly as value has no effect on the output
        jsxlFunction.verifyResult('Pass undefined inside func',jsxlFunction.jsxlDirect(input.matchFailStr,filter.matchFailUndefined),'fail',null,output.matchUndefined);
        jsxlFunction.verifyResult('Pass other data types directly',jsxlFunction.jsxlDirect(input.matchFailStr,filter.matchFailOtherdatatype),'fail',null,output.matchOtherDatatype);

    })

    it('Use $match with other modifiers',()=>{
        
        jsxlFunction.verifyResult('Use $match with other modifiers',jsxlFunction.jsxlDirect(input.matchFailFunc,filter.matchWithOtherModifiers),'pass',output.matchWithOthermodifier);

    })
})