const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')
const inputs = require('../test_data/inputs')
const filters = require('../test_data/filters')
const outputs = require('../test_data/outputs');
const exp = require('constants');
const { date } = require('../test_data/inputs');

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
            lvl0:[{test:'55'}],
            lvl1:{
                arrStr:[{lvl2:[{lvl3:'11'}]}],
            }
        }

        var filter = {
            // $rename:"renameAtTop",
            // $inc:(context,data,next)=>{
            //     next(null,Function)
            // },
            $type:{
                lvl0:{
                    $toObject:'test',
                    // $insert:[{'test':'99'}],
                    // $remove:true,
                    $type:[{
                        $transform:(context,data,next)=>{
                            next(null,{'test':'66'})
                        }
                    }],
                    // $transform:(context,data,next)=>{
                    //     next(null,'data')
                    // },
                    // $rename:"renamed",
                    // $remove:true,
                    // $insert:[6],
                    // $maxlen:3
                    // $inc:6,
                    // $ninc:0
                },
                lvl1:{
                    $type:{
                        arrStr:{
                            // $default:{'b':1},
                            // $toObject:'lvl2',
                            $type:[{
                                lvl2:{
                                    $type:[{
                                        lvl3:String
                                    }],
                                    $toObject:'lvl3',
                                    $ninc:'11'
                                }
                            }]
                            // $transform:(context,data,next)=>{
                            //     next(null,'123')
                            // },
                            // $inc:(context,data,next)=>{
                            //     next(null,'b')
                            // },
                            // $ninc:(context,data,next)=>{
                            //     next(null,'Test')
                            // } 
                        },
                        // lvl2:{
                        //     $type:{
                        //         test:{
                        //             // $length:2,
                        //             // $insert:'22',
                        //             // $map:[1,[12]],
                        //             $rename:"renamed",
                        //             $inc:(context,data,next)=>{
                        //                 next(null,'one')
                        //             },
                        //             $ninc:1
                        //         }
                        //     },
                        //     // $rename:'renameLvl2'
                        //     $ninc:'renamed'
                        // }
                    },
                    // $rename:'renamelvl1'
                }
            }
        }
        // console.log(new Date())
        jsxlFunction.verifyResult('',jsxlFunction.jsxlDirect(inp,filter),"pass",inp,"(execute v2) input (source) must be like type Object (not String)")
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

