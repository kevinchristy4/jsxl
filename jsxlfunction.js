const jsxl = require('jsxl');

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
                        return err
                    }else{
                        // console.log(output)
                        resolve(output)
                    }
                })
            },
        );
       }) 
    }


   
}
module.exports = new jsxlfunction()