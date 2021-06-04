const jsxl = require('../../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')

describe('Test Group - feature/modifiers',()=>{

    var inputJson = [{
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
    }]

    var initialFilter = [{
        $filter:(context,object,next)=>{
            next(null, Object.keys(object)[0].includes('inputTest'))
        },
        $any:[{
            $type: Object
        }]
    }]

    var secondFilter = [{

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
    }]

    



    it('Filter with remove, insert and include modifier',async()=>{

        var result = await jsxlFunction.jsxlDirect(inputJson,initialFilter)
        var result1 = await jsxlFunction.jsxlDirect(result,secondFilter)
        console.log(util.inspect(await result1, {showHidden: false, depth: null}))

    })

})

