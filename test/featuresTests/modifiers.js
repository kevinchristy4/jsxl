const jsxl = require('../../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')
const inputJson = require('../test_data/inputs.json')
const filters = require('../test_data/filters')

describe('Test Group - feature/modifiers',()=>{

    var inputJsonsss = {
        inputTest: {
            "planId": "c619ea31",
            "planKey": "test123",
            "jFormData": {
                "key": "test123",
                "title": "Test",
                "objToArr":{
                    'one':1,
                    'two':2
                }
            }
        }
    }

    var initialFilter = {
        $filter:(context,object,next)=>{
            next(null, Object.keys(object)[0].includes('inputTest'))
        },
        $type:{
            $:{
                planId:String,
                planKey:{
                    $remove: true
                },
                jFormData:{
                    key:{
                        $remove:true
                    },
                    title:{
                        $insert:'adadai'
                    },
                    objToArr:{
                        $type:Object,
                        $inc:'one'
                    }
                }
            }
        }
    }

    var secondFilter = {

        $type:{
            inputTest:{
                planId:String,
                planKey:{
                    $remove: true
                },
                jFormData:{
                    key:{
                        $remove:true
                    },
                    title:{
                        $insert:'adadai'
                    },
                    objToArr:{
                        $type:Object,
                        $inc:'one'
                    }
                }
            }
        }
    }

    var output = {
        inputTest: {
          planId: 'c619ea31',
          jFormData: { title: 'adadai', objToArr: { one: 1, two: 2 } }
        }
      };

    



    it('Filter with remove, insert and include modifier',async()=>{

        // var result = await jsxlFunction.jsxlDirect(inputJsonsss,initialFilter)
        // var result1 = await jsxlFunction.jsxlDirect(result,secondFilter)
        // console.log(util.inspect(await result, {showHidden: false, depth: null}))
        // console.log(util.inspect(await result1, {showHidden: false, depth: null}))
        jsxlFunction.directCallWrapper(inputJson.input3,filters.filter1,"Pass",output);
      

    })

})

