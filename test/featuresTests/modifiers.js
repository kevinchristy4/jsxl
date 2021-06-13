const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')
const inputs = require('../test_data/inputs')
const filters = require('../test_data/filters')
const outputs = require('../test_data/outputs');
const exp = require('constants');

describe('Test Group - feature/modifiers',()=>{

    // it('TypeModifier',async()=>{

    //     var input = {
    //         a:"one"
    //     }
    //     var filter = {

    //         a:{
    //             $type:String,
    //             $in:(context,data,next)=>{
    //                 // console.log(data)
    //                 next(null,8)
    //             }
    //         }
    //     }
    //     jsxlFunction.jsxlDirect(input,filter)

    //     // jsxlFunction.verifyResult('TypeModifier_pass',jsxlFunction.jsxlDirect(inputs.typeInput_pass,filters.typeFilter),"fail",outputs.typeOutput_pass,"")
    //     // jsxlFunction.verifyResult('TypeModifier_fail',jsxlFunction.jsxlDirect(inputs.typeInput_pass,filters.typeFilter2),"fail",null,outputs.typeError)
    //     // jsxlFunction.verifyResult('TypeModifier_fail',jsxlFunction.jsxlDirect(inputs.typeInput_fail,filters.typeFilter),"fail",null,outputs.typeError2)

    // })

    it('FilterModifier',async()=>{

        expect(typeof "aa").to.be.equal('number');
        // jsxlFunction.verifyResult('FilterModifier_pass',jsxlFunction.jsxlDirect(inputs.filterInput_pass,filters.filterFilter),"pass",outputs.filterOutput)

    })

    it('Transform_Modifier',async()=>{

        expect(typeof "aa").to.be.equal('string');

        // jsxlFunction.verifyResult('Transform_Modifier',jsxlFunction.jsxlDirect(inputs.transformInputPass,filters.transformFilter),"pass",outputs.transFormOutput)

    })

    it('test',()=>{
        expect(56).to.equal(57)
    })

})

