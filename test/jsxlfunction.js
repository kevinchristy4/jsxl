const jsxl = require('../lib/jsxl');
const { expect } = require('chai');
const util = require('util')



var jsxlfunction = function(){


    this.jsxlCompileAndExecute = async(...args)=>{

       return new Promise((resolve)=>{
        jsxl.compile(
            args[0],
            async(err,filter)=>{
                if (err) return console.log(err);
                jsxl.execute({
                    input: args[1]
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
            try{
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
            }
            catch(err){
                resolve(err)
            }
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

  this.directCallWrapper = async(inputs,filters,expects,expValue,errMsg)=>{

    describe('WrapperFunction',()=>{
        it('ada',async()=>{
            var result = await this.jsxlDirect(inputs,filters)
            // console.log(util.inspect(await result,{showHidden: false, depth: null}))
            if(expects.toLowerCase() == 'pass' && (expValue != null)){
                expect(await result).to.be.a(typeof expValue).and.to.deep.equal(expValue)
            }else 
            if(expects.toLowerCase() == 'error' && errMsg != null){
                expect(await result).to.be.a('error')
                expect(await result.message).to.deep.equal(errMsg)
            }
            else{
                throw new Error('Either expected - condition or values are missing');
            }
        })
    })
  


   

  }


   
}
module.exports = new jsxlfunction()