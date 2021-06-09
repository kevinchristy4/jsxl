const { filter } = require("async")

var filters = function(){

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
    };

    this.typeFilter = {

        $type:{
            string:String,
            number:Number,
            boolean:Boolean,
            date:{
                $type: Date, 
                $transform: (context, date, next) => {
                    next(null, date.toString());
                }  
            },
            array:[Number],
            object:{"a":Number}
        }
    }

    this.typeFilter2 = {

        $type:{
            string:String,
            $type:null,
            number:Number,
            boolean:Boolean,
            date:{
                $type: Date, 
                $transform: (context, date, next) => {
                    next(null, date.toString());
                }  
            },
            array:[Number],
            object:{"a":Number}
        }
    }

    this.filterFilter={

        $filter:(context,data,next)=>{
            next(null, typeof data == 'object')
        },
        $type:{
           $:[{
               $filter:(context,data,next)=>{
                    next(null,data %2 == 0)
               }
           }]
        }
    }


    this.transformFilter={

        $transform:(context,data,next)=>{
            for(let i in data){
                if(Number(i)%2 != 0){
                    delete data[i]
                }
            }
            next(null,data)
        },
        $type:{
           $:[{
                $filter:(context,data,next)=>{
                    next(null,data %2 == 0)
                },
               $transform:(context,data,next)=>{
                    next(null,data*10)
               }
           }]
        }
    }

}



    


module.exports = new filters();        
       
    
