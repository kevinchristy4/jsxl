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
    };
  
    this.modifierFilter1 = {
        $filter:(context,object,next)=>{
                next(null,(typeof object == 'object' && typeof object.insert == 'string'))
        },
        $type:
        {
            insert:{
                $insert:'insertedID'
            },
            remove:{
                $remove:true
            },
            jFormData:{
                $filter:(context,dtd,next)=>{
                    console.log(dtd)
                    next(null,dtd)
                },
                $transform:(context,dd,next)=>{
                    console.log(dd)
                    next(null,dd)
                },
                $type:{
                    default:{
                        $type:String,
                        $default:'test123'
                    },
                    optional:{
                        $type:String,
                        $optional:true      
                    },
                    fieldConfigs:[{
                        map:{
                            $type:Number,
                            $map:{'triple_select':3},
                        },
                        mapTo:{
                            $type:String,
                            $map:['zero','one','double','triple']
                        },
                        className:{
                            $type:String
                        },
                        templateOptions:{
                            equal:{
                                $type:String,
                                $eq:(context,type,next)=>{
                                    next(null,type.toLowerCase())
                                }
                            },
                            any_gt_in:[{
                                $any:[{
                                    $type:Number,
                                    $gte:10
                                },
                                {
                                    $type:String,
                                    $in:['a','b','c']
                                }]
                            }]
                        }
                    }]
            }
            }
        }
    
    }


    //merge question:
    this.tst1 = {
        id:{
            $insert:'insertedID'
        },
        planKey:{
            $remove:true
        }
    };
    this.tst2 = {
         jFormData:{
                    key:{
                        $type:String,
                        $default:'test123'
                    },
                    title:{
                        $type:String,
                        $optional:true      
                    },
                    fieldConfigs:Array
            }
    }

    

}
module.exports = new filters();        
       
    
