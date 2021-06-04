const jsxl = require('../../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')


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

        var input = {a:7}
        var filt = {a:String}
        var test = await jsxlFunction.jsxlDirect(input,filt)
        console.log(test.message)
        // expect(test).to.be.()
        expect(test).to.be.an('error');
        expect(test.message).to.eq('(execute v2) input.a must be type String (not Number)');

    })
})