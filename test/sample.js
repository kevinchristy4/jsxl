const jsxl = require('../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('./jsxlfunction')


describe("Run examples from documentations",()=>{

    describe("Compile first and execute",()=>{
        var filter = [{
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
        }];
        var input = [ { number: 7 }, { number: 8 }, { number: 9 } ]
    
        it('Filter and Transform',async()=>{
            var results = await jsxlFunction.jsxlCompileAndExecute(filter,input)
            expect(await results).to.eql([ { number: 21 }, { number: 27 } ])
        })
    })

    describe("Calling jsxl directly",()=>{

        var input = [ { ada:{test:9,test1:"two"}, foo:{one: 1, two:[1,2]} } ]
        
        var filter = [ { ada: {test: {$type: null, $gt:8}, test1:String},foo:{one: Number, two:[Number, Number]}} ]

        it("Compile and execute in one go",async()=>{

            await jsxl.useFilters({
                jsonFilter : [ { ada: {test: {$type: null, $gt:8}, test1:String},foo:{one: Number, two:[Number, Number]}} ]
            })
            var result = await jsxlFunction.jsxlDirect(input,"jsonFilter")
                console.log(result)
                expect(JSON.stringify(await result)).to.equal(JSON.stringify(input))
        })

    })  
    
})