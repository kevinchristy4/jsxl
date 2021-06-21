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
       
        var inp = {
            lvl0:undefined,
            lvl1:{
                arrStr:[false,undefined,false,null,'test',34,0,NaN],
                lvl2:{
                }
            }
        }

        var filter = {
            $default:"test",
            $type:{
                lvl0:{
                    $type:Number,   
                    $default:"test",
                    // $remove:false
                    $filter:(context,data,next)=>{
                        console.log(data)

                        next(null,false)
                    }
                },
                lvl1:{
                    $type:{
                        arrStr:[{
                            // $type:Object,
                            $default:(context,data,next)=>{

                                next(null,undefined)
                            },
                            // $remove:true
                        }],
                        lvl2:{
                            $type:{
                                test:{
                                   $default:(context,data,next)=>{
                                        next(null,null)
                                   },
                                   $type:Array
                                },
                            },
                        }
                    }
                },
            },
        }
        // console.log(new Date())
        jsxlFunction.verifyResult('',jsxlFunction.jsxlDirect(inp,filter),"pass",{
            lvl0: 'Inserted value',
            lvl1: {
              arrStr: [ 'inserted', 'value', 1, true, false, undefined, null ],
              lvl2: { test: Infinity }
            }
          },"(execute v2) input (source) must be like type Object (not String)")
        // console.log(outputs.outputForType("0","string","number"))
        // console.log(outputs.outputForType("2","string","null"))
        // console.log(outputs.outputForType("2","date","function"))



    })
    // it('Transform_Modifier',async()=>{

    //     // console.log('asasasasas')
    //     expect(typeof "aa").to.be.equal('string');

    //     // jsxlFunction.verifyResult('Transform_Modifier',jsxlFunction.jsxlDirect(inputs.transformInputPass,filters.transformFilter),"pass",outputs.transFormOutput)

    // })

})

