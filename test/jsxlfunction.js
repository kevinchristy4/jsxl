const jsxl = require('../lib/jsxl');
const { expect } = require('chai');
const util = require('util')



var jsxlfunction = function(){


    this.jsxlCompileOnceAndExecute = async(inputs,filters)=>{

       return new Promise((resolve)=>{
        jsxl.compile(
            filters,
            async(err,filter)=>{
                if (err) return console.log(err);
                jsxl.execute({
                    input: inputs
                },
                filter,
                async(err, output) => {
                    if(err){
                        resolve(err)
                    }else{
                        // console.log(output)
                        resolve(output)
                    }
                })
            },
        );
       }) 
    }

    this.jsxlDirect = async(inputs,filter)=>{

        return new Promise((resolve)=>{
            jsxl(
                {
                    input: inputs
                },
                filter,
                async (err, output) => {
                    if(err){
                        // console.log(err)
                        resolve([err,err.message])
                    }
                    console.log(util.inspect(output,{showHidden: false, depth: null}))
                    // console.log(output)
                    resolve(output)
                }
            );
        })
    }

  this.jsxlExplicitContext = async(target, parameters, inputs, filter)=>{

    return new Promise((resolve)=>{
        jsxl({
            target,
            parameters,
            key: 'input',
            source: {input:inputs}
        },
        filter,
        (err,output)=>{
            if(err){
                resolve(err)
            }
            // console.log(output)
            resolve(target)
        }
        );
    })

  }

    //Use await wherever result variable is called

  this.verifyResult = async(testName,result,expects,expValue,errMsg)=>{

    describe('',()=>{
        it(testName,async()=>{
            // console.log(util.inspect(Object.values(await result),{showHidden: false, depth: null}))
            if(expects.toLowerCase() == 'pass' && expValue != null){
                try{
                    expect(await result).to.be.a(typeof expValue).and.to.deep.equal(expValue)
                }catch(err){
                    console.log("Assertion error ------> "+err.message)
                    if((await result != undefined || null) && Object.keys(await result).length != 0 && (Object.values(await result)[0] != null||undefined) && Object.values(await result)[0].toString().includes('Error')){
                        throw new Error('Expected to pass but jsxl gave an error  ------> ' + Object.values(await result)[1] );
                    }
                } 
            }else 
            if(expects.toLowerCase() == 'fail' && errMsg != null){
                try{
                    expect(Object.values(await result)[0]).to.be.a('error')
                    expect(Object.values(await result)[1]).to.deep.equal(errMsg)
                }catch(err){
                    console.log("Assertion error ------> "+err.message)
                    if(!(Object.values(await result)[0].toString().includes('Error'))){
                        throw new Error('Expected to fail but jsxl did not return any error');
                    }
                }
            }
            else{
                throw new Error('Expected condition or expected values are not defined properly');
            }
        })
    })
  


   

  }


   
}
module.exports = new jsxlfunction()