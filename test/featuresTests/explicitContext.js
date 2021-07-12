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
            a:{
                'one':{1:1},
            },
            b:{
                'two':{2:2}
            }
        }

        var filter = {
            $toArray:'topLevel',
            $type:{
                $:{
                    $toArray:'lowerLevel'
                }
            }
        }

        jsxlFunction.verifyResult('',jsxlFunction.jsxlDirect(inp,filter),"pass",inp,"(execute v2) input (source) must be like type Object (not String)")

      
      


    })
})