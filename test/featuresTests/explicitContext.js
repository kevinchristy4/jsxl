const jsxl = require('../../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')
const inputJson = require('../test_data/inputs')
const filters = require('../test_data/filters');
const { test } = require('mocha');
const { any } = require('async');


describe('Test Group - feature/context',()=>{

    var target = [{
        inputTest: {
            "options": [
                {
                    "label": "Options",
                    "score": 22,
                    "value": 1
                }
            ]
        }
    }
    ];
    var filter = [{
        $filter:(context,object,next)=>{
            next(null,(object && typeof object.inputTests == 'object') && object.inputTests.options[0].score == context.parameters.ten)
        },
        $any:[{ 
            $transform: (context, object, next)=>{
                if(object.inputTests.options[0].label != 'Options'){return next('label is not option') }
                else{object.inputTests.options[0].value = context.parameters.ten}
                next(null, object);
            }
        }]
    }]

    var inputs = [{
        inputTests: {
            "options": [
                {
                    "label": "Options",
                    "score": 10,
                    "value": 1,
                    "default": "",
                    "allowTypeIn": "",
                    "affectedOptions": [2,3,4]
                }
            ]
        }
    }
    ];

    var parameters = {
        ten:10
    }

    var output = {
        inputTest: {
          planId: 'c619ea31',
          jFormData: { title: 'adadai', objToArr: { one: 1, two: 2 } }
        }
      };

      var testName = 'explicitContext'
      var errorMessage = '(execute v2) input.inputTest.planId must be type Number (not String)';

    // it('Filter with explicit inputs',async()=>{

    //     var result = await jsxlFunction.jsxlExplicitContext(target,parameters,inputs,filter)
    //     var res = Array.from(Object.keys(await result),k=>[`${k}`,result[k]])
    //     var arr = []
    //     res.forEach((value,index)=>{
    //         value.forEach((ival, iinde)=>{
    //             arr.push(ival)
    //         })
    //     })
    //     var data = arr[1];
    //     var data1 = arr[3];
    //     expect(data.inputTest.options[0].score).to.be.eq(22)
    //     expect(data1[0].inputTests.options[0].value).to.be.eq(10)

    // })

    it('test',async()=>{

        // var input = 7
        // var filt = Number
        // console.log(process.env.compiler)
        // jsxlFunction.verifyResult(testName,await jsxlFunction.jsxlDirect(inputJson.input3,filters.filter1),"pass",output,errorMessage)
       
        // console.log(test)
        // expect(test).to.be.an('Error');
        // expect(test.message).to.eq('test');
        // console.log(typeof filters.filter1)
       

        console.log(process.env.compiler)
        const jsxl = require('../../lib/jsxl')

        // jsxl({
        //     input:{
        //         a:{one:1,two:2},
        //         b:{four:4,five:5}
        // },
        // },
        // {
        //    $filter:(context,data,next)=>{
        //        console.log(data)
        //        console.log(Object.keys(data).includes('c'))
        //             next(null,Object.keys(data).includes('b'))
        //    },
        //    $type:{
        //        $:{
        //         $filter:(context,data,next)=>{
        //             console.log(data)
        //             next(null,true)
        //            },
        //            $type:{
        //                $:{
        //                 $type:Number,
        //                 $filter:(context,data,next)=>{
        //                     console.log(typeof data)
        //                     next(null,true)
        //                    }
        //                }
        //            }
        //        }, 
        //    }
        // }
        
        // ,(err,output)=>{
        // // console.log(output)
        // console.log(err)
        
        // }
        // )
        this.aaa =()=>{
            return 55
        }

        jsxlFunction.jsxlDirect(
            {ada:{a:'lll'},aaa:{b:'kkkjjj'}},{
                $type:{
                        $:{
                            $type:{
                                $:{
                                    // $type:String,
                                    // $optional:true,
                                    // $insert:(context,data,next)=>{
                                    //         if(data == 'tter'){
                                    //             next(null,('aaa'))
                                    //         }else{
                                    //             next(null,data)
                                    //         }
                                    // },
                                    // $lt:(context,data,next)=>{
                                        // console.log(typeof data)
                                        // console.log('s' < 'tt')
                                        // next(null,-5)
                                    // },
                                    // $eq:undefined,
                                    // $match:(context,data,next)=>{
                                    //     next(null, [1,5])
                                    // },
                                    // $maxlen:(context,data,next)=>{next(null,null)},
                                    // $message:'aaaa+\n',
                                    $filter:(context,data,next)=>{
                                        // var tt = [2,3,4,5,[6]]
                                            next(null,true)
                                            // console.log(data)
                                        // console.log(tt.includes([6]))
                                    },
                                    // $inc:(context,data,next)=>{
                                    //     console.log(data)
                                    //     next(null,['abcd','efgh'])
                                    // }
                                    // $default:(context,data,next)=>{
                                    //     next(null, 'dd')
                                    // }
                                    // $remove:true
                                }
                            },

                            // $optional:true,
                            $rename:(context,data,next)=>{
                                next(null,undefined)
                            },

                            $filter:(context,data,next)=>{
                                console.log(data)
                                next(null,true)
                            },
                            $transform:(context,data,next)=>{
                                
                                next(null,data)
                            },
                            // $default:{c:9}
                            $eq:(context,data,next)=>{
                                // console.log(tt == { b: '4' })

                                next(null,data)
                            }

                            // $remove:false,
                            // $insert:{d:4},
                        }
                    },

                $filter:(context,data,next)=>{
                    next(null,true)
                },
            $transform:(context,data,next)=>{
                // console.log(data()+"aaa");
                // console.log(data.aaa = 'ada')
                
                next(null, data)
            }}
        )


    })
})