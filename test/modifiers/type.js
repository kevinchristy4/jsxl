const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')
const input = require('../test_data/inputs')
const filter = require('../test_data/filters')
const output = require('../test_data/outputs');

describe('Type Modifier Tests',()=>{

    //ToDo - Find a way to iterate over the different combinations of data types
    //     - Also iterate over the null scenarios

    it('Verify String',()=>{

        //Test $type:String against String
        jsxlFunction.verifyResult('String against string',jsxlFunction.jsxlDirect(input.stringString,filter.stringString),'pass',input.stringString);

        //$type:String against other data types
        jsxlFunction.verifyResult('String againt Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.stringString),'fail',null,output.outputForType('0','string','number'));
        jsxlFunction.verifyResult('String againt Boolean',jsxlFunction.jsxlDirect(input.boolean,filter.stringString),'fail',null,output.outputForType('0','string','boolean'));
        jsxlFunction.verifyResult('String againt Date',jsxlFunction.jsxlDirect(input.date,filter.stringString),'fail',null,output.outputForType('0','string','date'));
        jsxlFunction.verifyResult('String againt Function',jsxlFunction.jsxlDirect(input.function,filter.stringString),'fail',null,output.outputForType('0','string','function'));
        jsxlFunction.verifyResult('String againt Array',jsxlFunction.jsxlDirect(input.array,filter.stringString),'fail',null,output.outputForType('0','string','array'));
        jsxlFunction.verifyResult('String againt Object',jsxlFunction.jsxlDirect(input.object,filter.stringString),'fail',null,output.outputForType('0','string','object'));


    })

    it('Verify Number',()=>{

        //Test $type:Number against number
        jsxlFunction.verifyResult('Number against Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.numberNumber),'pass',input.numberNumber);

        //$type:Number against other data types
        jsxlFunction.verifyResult('Number againt String',jsxlFunction.jsxlDirect(input.stringString,filter.numberNumber),'fail',null,output.outputForType('0','number','string'));
        jsxlFunction.verifyResult('Number againt Boolean',jsxlFunction.jsxlDirect(input.boolean,filter.numberNumber),'fail',null,output.outputForType('0','number','boolean'));
        jsxlFunction.verifyResult('Number againt Date',jsxlFunction.jsxlDirect(input.date,filter.numberNumber),'fail',null,output.outputForType('0','number','date'));
        jsxlFunction.verifyResult('Number againt Function',jsxlFunction.jsxlDirect(input.function,filter.numberNumber),'fail',null,output.outputForType('0','number','function'));
        jsxlFunction.verifyResult('Number againt Array',jsxlFunction.jsxlDirect(input.array,filter.numberNumber),'fail',null,output.outputForType('0','number','array'));
        jsxlFunction.verifyResult('Number againt Object',jsxlFunction.jsxlDirect(input.object,filter.numberNumber),'fail',null,output.outputForType('0','number','object'));


    })

    it('Verify Boolean',()=>{

        //Test $type:Boolean against boolean
        jsxlFunction.verifyResult('Boolean against boolean',jsxlFunction.jsxlDirect(input.boolean,filter.boolean),'pass',input.boolean);

        //$type:Boolean against other data types
        jsxlFunction.verifyResult('Boolean againt String',jsxlFunction.jsxlDirect(input.stringString,filter.boolean),'fail',null,output.outputForType('0','boolean','string'));
        jsxlFunction.verifyResult('Boolean againt Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.boolean),'fail',null,output.outputForType('0','boolean','number'));
        jsxlFunction.verifyResult('Boolean againt Date',jsxlFunction.jsxlDirect(input.date,filter.boolean),'fail',null,output.outputForType('0','boolean','date'));
        jsxlFunction.verifyResult('Boolean againt Function',jsxlFunction.jsxlDirect(input.function,filter.boolean),'fail',null,output.outputForType('0','boolean','function'));
        jsxlFunction.verifyResult('Boolean againt Array',jsxlFunction.jsxlDirect(input.array,filter.boolean),'fail',null,output.outputForType('0','boolean','array'));
        jsxlFunction.verifyResult('Boolean againt Object',jsxlFunction.jsxlDirect(input.object,filter.boolean),'fail',null,output.outputForType('0','boolean','object'));


    })

    it('Verify Date',()=>{

        //Test $type:Date against date
        jsxlFunction.verifyResult('Date against date',jsxlFunction.jsxlDirect(input.date,filter.date),'pass',input.date);

        //$type:Date against other data types
        jsxlFunction.verifyResult('Date againt String',jsxlFunction.jsxlDirect(input.stringString,filter.date),'fail',null,output.outputForType('0','date','string'));
        jsxlFunction.verifyResult('Date againt Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.date),'fail',null,output.outputForType('0','date','number'));
        jsxlFunction.verifyResult('Date againt Date',jsxlFunction.jsxlDirect(input.boolean,filter.date),'fail',null,output.outputForType('0','date','boolean'));
        jsxlFunction.verifyResult('Date againt Function',jsxlFunction.jsxlDirect(input.function,filter.date),'fail',null,output.outputForType('0','date','function'));
        jsxlFunction.verifyResult('Date againt Array',jsxlFunction.jsxlDirect(input.array,filter.date),'fail',null,output.outputForType('0','date','array'));
        jsxlFunction.verifyResult('Date againt Object',jsxlFunction.jsxlDirect(input.object,filter.date),'fail',null,output.outputForType('0','date','object'));


    })

    it('Verify Function',()=>{

        //Test $type:Function against function
        jsxlFunction.verifyResult('Function against function',jsxlFunction.jsxlDirect(input.function,filter.function),'pass',input.function);

        //$type:Function against other data types
        jsxlFunction.verifyResult('Function againt String',jsxlFunction.jsxlDirect(input.stringString,filter.function),'fail',null,output.outputForType('0','function','string'));
        jsxlFunction.verifyResult('Function againt Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.function),'fail',null,output.outputForType('0','function','number'));
        jsxlFunction.verifyResult('Function againt Boolean',jsxlFunction.jsxlDirect(input.boolean,filter.function),'fail',null,output.outputForType('0','function','boolean'));
        jsxlFunction.verifyResult('Function againt Date',jsxlFunction.jsxlDirect(input.date,filter.function),'fail',null,output.outputForType('0','function','date'));
        jsxlFunction.verifyResult('Function againt Array',jsxlFunction.jsxlDirect(input.array,filter.function),'fail',null,output.outputForType('0','function','array'));
        jsxlFunction.verifyResult('Function againt Object',jsxlFunction.jsxlDirect(input.object,filter.function),'fail',null,output.outputForType('0','function','object'));


    })

    it('Verify Array',()=>{  

        //Test $type:Array against Array
        jsxlFunction.verifyResult('Array against Array',jsxlFunction.jsxlDirect(input.array,filter.array),'pass',input.array);

        //$type:Array against other data types
        jsxlFunction.verifyResult('Array againt String',jsxlFunction.jsxlDirect(input.stringString,filter.array),'fail',null,output.outputForType('0','array','string'));
        jsxlFunction.verifyResult('Array againt Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.array),'fail',null,output.outputForType('0','array','number'));
        jsxlFunction.verifyResult('Array againt Boolean',jsxlFunction.jsxlDirect(input.boolean,filter.array),'fail',null,output.outputForType('0','array','boolean'));
        jsxlFunction.verifyResult('Array againt Date',jsxlFunction.jsxlDirect(input.date,filter.array),'fail',null,output.outputForType('0','array','date'));
        jsxlFunction.verifyResult('Array againt Function',jsxlFunction.jsxlDirect(input.function,filter.array),'fail',null,output.outputForType('0','array','function'));
        jsxlFunction.verifyResult('Array againt Object',jsxlFunction.jsxlDirect(input.object,filter.array),'fail',null,output.outputForType('0','array','object'));

    })

    it('Verify Object',()=>{

        //Test $type:Object against Object
        jsxlFunction.verifyResult('Object against Object',jsxlFunction.jsxlDirect(input.object,filter.object),'pass',input.object);

        //$type:Object against other data types
        jsxlFunction.verifyResult('Object againt String',jsxlFunction.jsxlDirect(input.stringString,filter.object),'fail',null,output.outputForType('0','Object','string'));
        jsxlFunction.verifyResult('Object againt Number',jsxlFunction.jsxlDirect(input.numberNumber,filter.object),'fail',null,output.outputForType('0','Object','number'));
        jsxlFunction.verifyResult('Object againt Boolean',jsxlFunction.jsxlDirect(input.boolean,filter.object),'fail',null,output.outputForType('0','Object','boolean'));
        jsxlFunction.verifyResult('Object againt Date',jsxlFunction.jsxlDirect(input.date,filter.object),'fail',null,output.outputForType('0','Object','date'));
        jsxlFunction.verifyResult('Object againt Function',jsxlFunction.jsxlDirect(input.function,filter.object),'fail',null,output.outputForType('0','Object','function'));
        jsxlFunction.verifyResult('Object againt Array',jsxlFunction.jsxlDirect(input.array,filter.object),'fail',null,output.outputForType('0','Object','array'));


    })

    it('Verify against null at level 0 and 2 for all data types',()=>{

        //$type:String against null at different levels
        jsxlFunction.verifyResult('String againt null',jsxlFunction.jsxlDirect(input.stringNull,filter.stringString),'fail',null,output.outputForType('0','string','null'));
        jsxlFunction.verifyResult('String againt null - lvl2',jsxlFunction.jsxlDirect(input.stringNulllvl2,filter.stringString),'fail',null,output.outputForType('2','string','null'));

        //$type:Number against null at different levels
        jsxlFunction.verifyResult('Number againt null',jsxlFunction.jsxlDirect(input.numberNull,filter.numberNumber),'fail',null,output.outputForType('0','number','null'));
        jsxlFunction.verifyResult('Number againt null - lvl2',jsxlFunction.jsxlDirect(input.numberNulllvl2,filter.numberNumber),'fail',null,output.outputForType('2','number','null'));

        // $type:Boolean against null at different levels
        jsxlFunction.verifyResult('Boolean against null',jsxlFunction.jsxlDirect(input.booleanNull,filter.boolean),'fail',null,output.outputForType('0','boolean','null'));
        jsxlFunction.verifyResult('Boolean against null - lvl2',jsxlFunction.jsxlDirect(input.booleanNulllvl2,filter.boolean),'fail',null,output.outputForType('2','boolean','null'));

        //$type:Date against null at different levels
        jsxlFunction.verifyResult('Date against null',jsxlFunction.jsxlDirect(input.dateNull,filter.date),'fail',null,output.outputForType('0','date','null'));
        jsxlFunction.verifyResult('Date against null - lvl2',jsxlFunction.jsxlDirect(input.dateNulllvl2,filter.date),'fail',null,output.outputForType('2','date','null'));

        //$type:Function against null at different levels
        jsxlFunction.verifyResult('Function against null',jsxlFunction.jsxlDirect(input.functionNull,filter.function),'fail',null,output.outputForType('0','function','null'));
        jsxlFunction.verifyResult('Function against null - lvl2',jsxlFunction.jsxlDirect(input.functionNulllvl2,filter.function),'fail',null,output.outputForType('2','function','null'));

        //$type:Array against null at different levels
        jsxlFunction.verifyResult('Array against null',jsxlFunction.jsxlDirect(input.arrayNull,filter.array),'fail',null,output.outputForType('0','array','null'));
        jsxlFunction.verifyResult('Array against null - lvl2',jsxlFunction.jsxlDirect(input.arrayNulllvl2,filter.array),'fail',null,output.outputForType('2','array','null'));

        //$type:Object against null at different levels
        jsxlFunction.verifyResult('Object against null',jsxlFunction.jsxlDirect(input.objectNull,filter.object),'fail',null,output.outputForType('0','object','null'));
        jsxlFunction.verifyResult('Object against null - lvl2',jsxlFunction.jsxlDirect(input.objectNulllvl2,filter.object),'fail',null,output.outputForType('2','object','null'));
    })

    it('Verify against undefined values',()=>{

        jsxlFunction.verifyResult('String againt undefined',jsxlFunction.jsxlDirect(input.stringUndefined,filter.stringString),'fail',null,output.stringUndefined);
        jsxlFunction.verifyResult('String againt undefined - lvl2',jsxlFunction.jsxlDirect(input.stringUndefinedlvl2,filter.stringString),'fail',null,output.stringUndefinedlvl2);

    })
})