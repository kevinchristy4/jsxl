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

    // this.filterFilter={

    //     $filter:(context,data,next)=>{
    //         next(null, typeof data == 'object')
    //     },
    //     $type:{
    //        $:[{
    //            $filter:(context,data,next)=>{
    //                 next(null,data %2 == 0)
    //            }
    //        }]
    //     }
    // }


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

    //////////////// Filters for $type modifier /////////////////////

    this.stringString = {
        lvl0:String,
        lvl1:{
            $type:{
                arrStr:[String],
                lvl2:{
                    $type:{
                        str:String
                    }
                }
            }
        }
    }

    this.numberNumber = {
        lvl0:Number,
        lvl1:{
            $type:{
                arrStr:[Number],
                lvl2:{
                    $type:{
                        str:Number
                    }
                }
            }
        }
    }

    this.boolean = {
        lvl0:Boolean,
        lvl1:{
            $type:{
                arrStr:[Boolean],
                lvl2:{
                    $type:{
                        str:Boolean
                    }
                }
            }
        }
    }

    this.date = {
        lvl0:Date,
        lvl1:{
            $type:{
                arrStr:[Date],
                lvl2:{
                    $type:{
                        str:Date
                    }
                }
            }
        }
    }

    this.function = {
        lvl0:Function,
        lvl1:{
            $type:{
                arrStr:[Function],
                lvl2:{
                    $type:{
                        str:Function
                    }
                }
            }
        }
    }

    this.array = {
        lvl0:Array,
        lvl1:{
            $type:{
                arrStr:Array,
                lvl2:{
                    $type:{
                        str:Array
                    }
                }
            }
        }
    }

    this.object = {
        lvl0:Object,
        lvl1:{
            $type:{
                arrStr:[Object],
                lvl2:{
                    $type:{
                        str:Object
                    }
                }
            }
        }
    }

//////////////////// Filters for $filter modifier ////////////////////////////

this.filter = {
    $filter:(context,data,next)=>{
        next(null,true)
    },
    $type:{
        lvl0:{
            $filter:(context,data,next)=>{
                next(null,data == 'true')
            },
        },
        lvl1:{
            $filter:(context,data,next)=>{
                next(null,Object.keys(data).includes('lvl2'))
            },
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,false)
                    }
                }],
                lvl2:{
                    $type:{
                        str:{
                            $filter:(context,data,next)=>{
                                next(null,data == 'true')
                            }
                        }
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        }
    }
}

this.filterFalseAtTop = {
    $filter:(context,data,next)=>{
        next(null,false)
    },
    $type:{
        lvl0:{
            $filter:(context,data,next)=>{
                next(null,data == 'true')
            },
        },
        lvl1:{
            $filter:(context,data,next)=>{
                next(null,Object.keys(data).includes('lvl2'))
            },
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,data)
                    }
                }],
                lvl2:{
                    $type:{
                        str:{
                            $filter:(context,data,next)=>{
                                next(null,data == 'true')
                            }
                        }
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        }
    }
}

this.filterPassString = {
    $filter:(context,data,next)=>{
        next(null,true)
    },
    $type:{
        lvl0:{
            $filter:'string',
        },
        lvl1:{
            $filter:(context,data,next)=>{
                next(null,Object.keys(data).includes('lvl2'))
            },
            $type:{
                arrStr:[{
                    $filter:123
                }],
                lvl2:{
                    $type:{
                        str:{
                            $filter:(context,data,next)=>{
                                next(null,data == 'true')
                            }
                        }
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        }
    }
}

this.filterPassBoolean = {
    $filter:(context,data,next)=>{
        next(null,true)
    },
    $type:{
        lvl0:{
            $filter:(context,data,next)=>{
                next(null,true)
            },
        },
        lvl1:{
            $filter:(context,data,next)=>{
                next(null,Object.keys(data).includes('lvl2'))
            },
            $type:{
                arrStr:[{
                    $filter:false
                }],
                lvl2:{
                    $type:{
                        str:{
                            $filter:(context,data,next)=>{
                                next(null,data == 'true')
                            }
                        }
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        }
    }
}

this.filterPassUndefined = {
    $filter:(context,data,next)=>{
        next(null,true)
    },
    $type:{
        lvl0:{
            $filter:(context,data,next)=>{
                next(null,true)
            },
        },
        lvl1:{
            $filter:(context,data,next)=>{
                next(null,Object.keys(data).includes('lvl2'))
            },
            $type:{
                arrStr:[{
                    $filter:undefined
                }],
                lvl2:{
                    $type:{
                        str:{
                            $filter:(context,data,next)=>{
                                next(null,data == 'true')
                            }
                        }
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        }
    }
}

this.filterAlongNonModifier = {
    $filter:(context,data,next)=>{
        next(null,true)
    },
    $type:{
        lvl0:{
            $filter:(context,data,next)=>{
                next(null,true)
            },
        },
        $filter:(context,data,next)=>{
            next(null,true)
        },
        lvl1:{
            $filter:(context,data,next)=>{
                next(null,Object.keys(data).includes('lvl2'))
            },
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }],
                lvl2:{
                    $type:{
                        str:{
                            $filter:(context,data,next)=>{
                                next(null,data == 'true')
                            }
                        }
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        }
    }
}

///////////////////////// Filters for $transform /////////////////////////////

this.transformObject = {
    $transform:(context,data,next)=>{
        next(null,data)
    },
    $type:{
        lvl0:{           
            $transform:(context,data,next)=>{
                next(null,'trueT')
            }
        },
        lvl1:{
            $transform:(context,data,next)=>{
                next(null,null)
            },
            $type:{
                arrStr:[{
                    $transform:(context,data,next)=>{
                        next(null,data+'T')
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                            $transform:(context,data,next)=>{
                                next(null,'trueT')
                            }
                        },
                    },
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }
            }
        },
    }
}


this.removeAnKeyValue = {
    $transform:(context,data,next)=>{
        delete data.lvl0
        next(null,data)
    },
    $type:{
        lvl0:String,
        lvl1:Object
    }
}

this.pass_null_Undefined = {
    $transform:(context,data,next)=>{
        next(null,null)
    },
    $type:{
        lvl0:{           
                $transform:(context,data,next)=>{
                    next(null,"undefined")
                }
        }
    }
}

this.passOtherDataTypes = {
    $transform:null,
    $type:{
        lvl0:{           
                $transform:123
        }
    }
}

this.passdownModifiedValues = {
    $transform:(context,data,next)=>{
        data.lvl0 = 'fromTransform'
        next(null,data)
    },
    $type:{
        lvl0:{           
            $filter:(context,data,next)=>{
                if(data == 'fromInput'){
                    next(null,true);
                }else{
                    next(null,false)
                }
            }
        }
    }
}


/////////////////////////// Filters for $remove /////////////////////////

this.removeFilter = {
    
    $type:{
        lvl0:{           
            $remove:false
        },
        lvl1:{
            $remove:true,
            $type:{
                arrStr:[{
                    $transform:(context,data,next)=>{
                        next(null,data+'T')
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                            $transform:(context,data,next)=>{
                                next(null,'trueT')
                            }
                        },
                    }
                }
            }
        }
    }
}

this.remove_stringDatatype = {
    $type:{
        lvl0:{           
            $remove:false
        },
        lvl1:{
            $remove:'true'
        }
    }
}

this.remove_null_undefined = {
    $type:{
        lvl0:{           
            $remove:undefined
        },
        lvl1:{
            $remove:null,
        }
    }
}

this.remove_topLevel = {
    $remove:true,
    $type:{
        lvl0:{           
            $remove:false
        },
        lvl1:{
            $remove:false,
        }
    }
}

/////////////////////////// $insert Filters //////////////////////////////////

this.insertFilterAtTop = {
    $insert:{
        lvl:"test level"
    },
    $type:{
        lvl0:{   
            $type:Boolean
        },
        lvl1:{
            $type:{
                arrStr:Array,
                lvl2:{
                    $type:{
                        test:String
                    }
                }
            }
        }
    }
},

this.insertAtAllLvl = {
    $type:{
        lvl0:{   
            $type:String,
            $insert:"Inserted value"
        },
        lvl1:{
            $transform:(context,data,next)=>{
                next(null,data)
            },
            $type:{
                arrStr:{
                    $insert:(context,data,next)=>{
                        next(null,["inserted","value",1,true,false,undefined,null])
                    }
                },
                lvl2:{
                    $type:{
                        test:{
                           $type:String,
                           $insert:"Inserted"+"\n"+55
                        },
                    },
                }
            }
        },
    },
}

this.insertNullUndefined = {
    $type:{
        lvl0:{   
            $insert:null
        },
        lvl1:{
            $type:{
                arrStr:{
                    $insert:(context,data,next)=>{
                        next(null,undefined)
                    }
                },
                lvl2:{
                    $type:{
                        str:{
                           $insert:(context,data,next)=>{
                                next(null,[undefined,0,null])
                           }
                        },
                    },
                }
            }
        },
    },
}

this.insertUseAlongType = {
    $type:{
        lvl0:{
            $type:Number,   
            $insert:0
        },
        lvl1:{
            $type:{
                arrStr:{
                    $type:Object,
                    $insert:(context,data,next)=>{
                        next(null,[])
                    }
                },
                lvl2:{
                    $type:{
                        test:{
                           $insert:(context,data,next)=>{
                                next(null,[undefined,0])
                           },
                           $type:Array
                        },
                    },
                }
            }
        },
    },
}

this.useInsertWithRemoveDefault = {

    $type:{
        lvl0:{
            $type:Number,   
            $insert:0,
            $remove:false
        },
        lvl1:{
            $type:{
                arrStr:{
                    $type:Object,
                    $insert:(context,data,next)=>{
                        next(null,[])
                    },
                    $default:true
                },
                lvl2:{
                    $type:{
                        test:{
                           $insert:(context,data,next)=>{
                                next(null,[undefined,0])
                           },
                           $type:Array
                        },
                    },
                }
            }
        },
    },
}

this.insertValuesNotPresent = {
    $type:{
        lvl0:{
            $insert:"test",
            $transform:(context,data,next)=>{
                console.log(data)
                next(null,25)
            }
        },
        lvl1:{
            $type:{
                arrStr:{
                    $insert:(context,data,next)=>{
                        next(null,[1,2])
                    },
                },
                lvl2:{
                    $type:{
                        test:{
                           $insert:(context,data,next)=>{
                                next(null,[undefined,0])
                           },
                        },
                    },
                }
            }
        },
    },
}

///////////////////////////// $default filters ///////////////////////////////

this.defaultMissingvalues =  {
    $type:{
        lvl0:{
            $default:"test",
            $transform:(context,data,next)=>{
                console.log(data)
                next(null,25)
            }
        },
        lvl1:{
            $type:{
                arrStr:{
                    $default:(context,data,next)=>{
                        next(null,[1,2])
                    },
                },
                lvl2:{
                    $type:{
                        test:{
                           $default:(context,data,next)=>{
                                next(null,[undefined,0])
                           }
                        }
                    }
                }
            }
        }
    }
}

this.defaultFilter = {
    $type:{
        lvl0:{
            $default:"Defaulted value",
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $default:(context,data,next)=>{
                        next(null,"Defaulted value")
                    },
                }],
                lvl2:{
                    $type:{
                        test:{
                           $default:(context,data,next)=>{
                                next(null,["Defaulted value"])
                           },
                        },
                    },
                }
            }
        },
    },
}

this.defaultUndefinedFilter = {
    $type:{
        lvl0:{
            $default:"undefined"+"\n"
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $default:(context,data,next)=>{
                        next(null,undefined)
                    },
                }],
                lvl2:{
                    $type:{
                        test:{
                           $default:(context,data,next)=>{
                                next(null,null)
                           },
                        },
                    },
                }
            }
        },
    },
}

this.defaultAtTop = {
    $default:{"one":1},
    $type:{
        one:Number
    }
}

this.defaultWithFilter_Type = {
    $type:{
        lvl0:{
            $type:Number,   
            $default:"test",
            $filter:(context,data,next)=>{
                next(null,false)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $default:(context,data,next)=>{
                        next(null,undefined)
                    },
                }],
                lvl2:{
                    $type:{
                        test:{
                           $default:(context,data,next)=>{
                                next(null,null)
                           },
                           $type:Array
                        },
                    },
                }
            }
        },
    },
}

this.defaultwithInsert_remove = {
    $type:{
        lvl0:{
            $default:"Defaulted value",
            $remove:true
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $default:(context,data,next)=>{
                        next(null,"Defaulted value")
                    },
                    $insert:"test"
                }],
                lvl2:{
                    $type:{
                        test:{
                           $default:(context,data,next)=>{
                                next(null,["Defaulted value"])
                           },
                        },
                    },
                }
            }
        },
    },
}
    
}

module.exports = new filters();        
       
    
