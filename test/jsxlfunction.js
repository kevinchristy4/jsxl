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
            jsxl(
                {
                    input: inputs
                },
                filter,
                async (err, output) => {
                    if(err){
                        resolve(err)
                    }
                    resolve(output)
                }
            );
        })
    }

    this.jsxlAddFilter = async(filters)=>{
        return new Promise((resolve)=>{
            resolve(jsxl.useFilters({
                jsonFilter : [ { ada: {test: {$type: null, $gt:8}, test1:String},foo:{one: Number, two:[Number, Number]}} ]
            }))
        })
    }


   
}
module.exports = new jsxlfunction()