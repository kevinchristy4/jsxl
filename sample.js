const jsxl = require('jsxl');
const jsxlUtil = require('jsxl/lib/utils')
const { expect } = require('chai');
const jsxlFunction = require('./jsxlfunction')


describe("test",()=>{

    var filter = [{
        $filter: (context, object, next) => {
            next(null, !(object && typeof object.number == 'number' && object.number % 2 == 0)); 
        },
        $type: {
            number: {
                $type: Number,
                $transform: (context, number, next) => {
                    next(null, number * 3);
                }
            }
        },
    }];
    var input = [ { number: 7 }, { number: 8 }, { number: 9 } ]





    it('test',async()=>{

        var results = await jsxlFunction.jsxlCompileAndExecute(filter,input)
        expect(await results).to.eql([ { number: 21 }, { number: 27 } ])



    })
})