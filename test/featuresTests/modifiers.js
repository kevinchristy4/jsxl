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

    // it('FilterModifier',async()=>{

        // expect(typeof "aa").to.be.equal('number');
        // jsxlFunction.verifyResult('FilterModifier_pass',jsxlFunction.jsxlDirect(inputs.filterInput_pass,filters.filterFilter),"pass",outputs.filterOutput)

    // })

   

    it('test',()=>{
        // var tt = {a:undefined,b:'test'}
        // console.log(typeof tt.a)
        // expect({a:5}).to.deep.eq(tt)
        var inp = {
            lvl0:"test",
        lvl1:{
            arrStr:[-NaN,-Infinity,-50,-5^-5,-0.25,-0,0,0.25,5^5,50,Infinity,NaN],
            lvl2:{
                str:5
            }
        }
        }

        var filter = {
            lvl0:null,
            lvl1:{
                $type:{
                    arrStr:[Number],
                    lvl2:{
                        $type:{
                            str:Number
                        }
                    }
                }
            }
        }
        console.log(new Date())
        // jsxlFunction.verifyResult('',jsxlFunction.jsxlDirect(inp,filter),"pass",inp)
        console.log(outputs.outputForType("0","string","number"))
        console.log(outputs.outputForType("2","string","null"))
        console.log(outputs.outputForType("2","date","function"))



    })
    // it('Transform_Modifier',async()=>{

    //     // console.log('asasasasas')
    //     expect(typeof "aa").to.be.equal('string');

    //     // jsxlFunction.verifyResult('Transform_Modifier',jsxlFunction.jsxlDirect(inputs.transformInputPass,filters.transformFilter),"pass",outputs.transFormOutput)

    // })

})

