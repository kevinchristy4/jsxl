const jsxl = require('../../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')

describe('Test Group - Regression - Compile and execute multiple filters',()=>{

    var input0 = [ { ada:{test:9,test1:"two"}, foo:{one: 1, two:[1,2]} } ]
    var input1 = [ { number: 7 }, { number: 8 }, { number: 9 } ]
    var output1 = [ { number: 21 }, { number: 27 } ]
    var input2 = [ 2, 4, 6,7,8,9 ];

    var aloneInput = [{
        inputTest: {
            "planId": "c619ea31",
            "planKey": "test123",
            "jFormData": {
                "key": "test123",
                "title": "Test",
                "fieldConfigs": [
                    {
                        "key": "single_select",
                        "type": "single",
                        "className": "page-input-field",
                        "templateOptions": {
                            "type": "single",
                            "label": "Single select",
                            "logics": [],
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
                ]
            }
        }
    }
    ]
    var aloneFilter = [{
        $filter:(context,object,next)=>{
            next(null,(typeof object.inputTest == 'object' && object.inputTest.planKey.includes('test') && object.inputTest.jFormData.key.includes('test')))
        },
        $any:[{
            $transform: (context, object, next)=>{
                if(object.inputTest.jFormData.fieldConfigs[0].type != 'single'){return next('Type is not signle') }
                else{object.inputTest.jFormData.fieldConfigs[0].templateOptions.logics = [1]}
                next(null, object);
            }

        }]
    }]

    before(async()=>{

        // Add 4 filters
        await jsxl.useFilters({
            requestFilter : [ { ada: {test: {$type: null, $gt:8}, test1:String},foo:{one: Number, two:[Number, Number]}} ],
            filterFromExample: [{
                $filter: (context, object, next) => {
                    next(null, !(object && typeof object.number == 'number' && object.number % 2 == 0)); 
                },
                $type: {
                    number: {
                        $type: Number,
                        $transform: (context, object, next) => {
                            next(null, object * 3);
                        }
                    }
                },
            }],
            contextFilter: [ { 
                $filter: (context, object, next) => {
                    next(null, !(object && typeof object.number == 'number' && 
                                    object.number % context.parameters.modulus == 0)); 
                },
                $type: { number: Number }
            } ],
            EvenNumbers: [ { 
                $type: Number,
                $filter: (context, number, next) => {
                    next(null,number %2 == 0) 
                }
            } ]
        })
    })

    it('execute multiple filters',async()=>{

        var result0 = await jsxlFunction.jsxlDirect(input0,"requestFilter")
        // console.log(result0)
        expect(JSON.stringify(await result0)).to.equal(JSON.stringify(input0))

        var result1 = await jsxlFunction.jsxlDirect(input1,"filterFromExample")
        // console.log(result1)
        expect(JSON.stringify(await result1)).to.equal(JSON.stringify(output1))


        var result2 = await jsxlFunction.jsxlDirect(input2,"EvenNumbers")
        // console.log(result2)
        expect(await result2).to.be.an('array').that.does.not.include(7,9)

    })

    it('Compile and execute a new filter directly that is not included before',async()=>{

        var result3 = await jsxlFunction.jsxlDirect(aloneInput,aloneFilter)
        // console.log(await result3[0].inputTest.jFormData.fieldConfigs[0].templateOptions.logics);
        expect(await result3[0].inputTest.jFormData.fieldConfigs[0].templateOptions.logics).to.be.an('array').that.contain(1)
    })

    


})