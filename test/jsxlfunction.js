const jsxl = require('../lib/jsxl');

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


   
}
module.exports = new jsxlfunction()