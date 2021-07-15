const jsxl = require('../../lib/jsxl');
const { expect } = require('chai');
const jsxlFunction = require('../jsxlfunction')
const util = require('util')
const inputJson = require('../test_data/inputs')
const filters = require('../test_data/filters');
const { test } = require('mocha');
const { any } = require('async');


describe('Test Group - feature/context',()=>{


    it('test',async()=>{

      
        const jsxl = require('../../lib/jsxl')

        var inp = {
            1:'one',
        }

        var filter = {
            1:{
                $map:{"one":0,'two':new Date()}
            }
        }
        

        jsxlFunction.verifyResult('',jsxlFunction.jsxlDirect(inp,filter),"pass",inp,"(execute v2) input (source) must be like type Object (not String)")

      
      


    })
})