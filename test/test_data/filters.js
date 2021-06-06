const { filter } = require("async")

var filters = function(){

    this.filter1 = {
        $filter:(context,object,next)=>{
            next(null, Object.keys(object)[0].includes('inputTest'))
        },
        $type:{
            $:{
                planId:String,
                planKey:{
                    $remove: true
                },
                jFormData:{
                    key:{
                        $remove:true
                    },
                    title:{
                        $insert:'adadai'
                    },
                    objToArr:{
                        $type:Object,
                        $inc:'one'
                    }
                }
            }
        }
    }
}
module.exports = new filters();        
       
    
