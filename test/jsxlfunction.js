const jsxl = require('../lib/jsxl');
const { expect } = require('chai');
const util = require('util')



var jsxlfunction = function(){


    this.jsxlCompileAndExecute = async(inputs,filters)=>{

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
                        resolve(err)
                    }
                    // console.log(output[0])
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


  this.verifyResult = async(testName,result,expects,expValue,errMsg)=>{

    describe(testName,()=>{
        it(testName,async()=>{
            // var result = await this.jsxlDirect(inputs,filters)
            // console.log(util.inspect(await result,{showHidden: false, depth: null}))
            if(expects.toLowerCase() == 'pass' && expValue != null){
                try{
                    expect(await result).to.be.a(typeof expValue).and.to.deep.equal(expValue)
                }catch(err){
                    console.log("Assertion error ------> "+err.message)
                    if(await result.message != undefined){
                        throw new Error('Expected to pass but jsxl gave an error  ------> ' +result.message );
                    }
                } 
            }else 
            if(expects.toLowerCase() == 'fail' && errMsg != null){
                try{
                    expect(await result).to.be.a('error')
                    expect(await result.message).to.deep.equal(errMsg)
                }catch(err){
                    console.log("Assertion error ------> "+err.message)
                    if(await result.message == undefined){
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