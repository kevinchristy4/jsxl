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

//////////////////////////////// $optional filters /////////////////////////////////

this.optionalTrue = {
    $type:{
        lvl0:{
            $transform:(context,data,next)=>{
                console.log(data)
                next(null,'transformed value')
            },
            $optional:true,
            $default:'test'
        },
        lvl1:{
            $type:{
                arrStr:{
                    $optional:true,
                    $insert:'Inserted value'
                },
                lvl2:{
                    $type:{
                        test:{
                           $optional:true,
                           $default:true
                        }
                    },
                    $optional:true
                }
            },
        }
    }
}

this.optionalAtTopandFalse = {
    $optional:true,
    $type:{
        lvl0:{
            $optional:false,
        },
        lvl1:{
            $type:{
                arrStr:{
                    $optional:false,
                },
                lvl2:{
                    $type:{
                        test:{
                           $optional:false,
                        }
                    },
                    $optional:true
                }
            },
        }
    }
}

this.optionalAlongWithInsertDefault = {
    $default:"test",
    $insert:"InsertThis",
    $optional:false,
    $type:{
        lvl0:{
            $insert:'test',
            $transform:(context,data,next)=>{
                console.log(data)
                next(null,'transformed value')
            },
            $optional:true,
        },
        lvl1:{
            $type:{
                arrStr:{
                    $optional:false,
                    $default:'test'
                },
                lvl2:{
                    $type:{
                        test:{
                           $remove:true,
                           $optional:false
                        },
                    },
                }
            },
            $optional:false
        },
    },
}

this.optionalWithOtherDatatype =  {
    $optional:"test",
    $type:{
        lvl0:{
            $insert:'test',
            $transform:(context,data,next)=>{
                console.log(data)
                next(null,'transformed value')
            },
            $optional:123,
        },
        lvl1:{
            $type:{
                arrStr:{
                    $optional:()=>{},
                    $default:'test'
                },
                lvl2:{
                    $type:{
                        test:{
                           $remove:true,
                           $optional:new Date()
                        },
                    },
                }
            },
            $optional:[{},{}]
        },
    },
}

///////////////////////////// $map Filters //////////////////////////////

this.mapSimpleFilter = {
    $type:{
        lvl0:{
            $insert:'test',
            $map:{"test":0,true:new Date(),"qwe":'test'+'n'}
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $default:'test',
                    $map:{
                        'test':['Mapped',console.log(44),1,new Error('ada')],
                        'test1':{1:undefined,2:{"n": 'g'},3:null}
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                           $type:Boolean,
                            $map:(context,data,next)=>{
                                next(null,{'true':true})
                            }
                        }
                    }
                }
            }
        }
    }
}

this.mapOtherDatatypes = {
    $type:{
        lvl0:{
            $map:{0:0,true:new Date(),"qwe":'test'+'n'}
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $default:'test',
                    $map:{
                        [1]:['Mapped',console.log(44),1,new Error('ada')],
                        0:{1:undefined,2:{"n": 'g'},3:null}
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                           $type:Boolean,
                            $map:(context,data,next)=>{
                                next(null,{55:true})
                            }
                        }
                    }
                }
            }
        }
    }
}

this.mapPassUndefinedDirectly = {
    $type:{
        lvl0:{
            $remove:true,
            $map:undefined
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $map:undefined
                }],
                lvl2:{
                    $type:{
                        test:{
                            $map:(context,data,next)=>{
                                next(null,undefined)
                            }
                        }
                    }
                }
            }
        }
    }
}

this.mapPassOtherDiretcly = {
    $type:{
        lvl0:{
            $remove:true,
            $map:null
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $map:0
                }],
                lvl2:{
                    $type:{
                        test:{
                            $map:(context,data,next)=>{
                                next(null,'undefined')
                            }
                        }
                    }
                }
            }
        }
    }
}

this.mapNumberToArray = {
    $type:{
        lvl0:{
            $default:1,
            $map:['q',44,['a','b'],{1:1},new Date(),null,undefined,()=>{}]
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $type:null,
                    $map:['q',44,['a','b'],{1:1},new Date(),null,undefined]
                }],
                lvl2:{
                    $type:{
                        test:{
                           $insert:(context,data,next)=>{
                                next(null,5)
                           },
                            $map:(context,data,next)=>{
                                next(null,['q',44,['a','b'],{1:1},new Date(),null,undefined])
                            }
                        }
                    }
                }
            }
        }
    }
}

///////////////////////// Comparision filters /////////////////////////////////////

this.comparisionFilter = {
    $type:{
        lvl0:{
            $type:Number,
            $gt:(context,data,next)=>{
                next(null,25)
            },
            $lt:40,
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $type:String,
                    $gte:"b",
                    $lte:(context,data,next)=>{
                        next(null,"i")
                    },
                }],
                lvl2:{
                    $type:{
                        test:{
                            $ne:(context,data,next)=>{
                               next(null,{'one':1,'two':2})
                            }
                        },
                        test1:{
                            $type:Number,
                            $eq:new Date().getDate()
                        }
                    }
                }
            }
        }
    }
}

this.comparisonUndefined = {
    $type:{
        lvl0:{
            $type:Number,
            $eq:(context,data,next)=>{
                next(null,undefined)
            },
        }
    }
}

this.comparisonUndefinedDirect = {
    $type:{
        lvl0:{
            $type:Number,
            $lt:undefined,
        }
    }
}

this.comparisonNewLine = {
    lvl0:{
        $type:Number,
        $gt:(context,data,next)=>{
            next(null,25)
        },
        $lt:40,
    },
    lvl1:{
        $type:{
            arrStr:[{
                $type:String,
                $eq:(context,data,next)=>{
                    next(null,"\n")
                },
            }],
        }
    }
}

this.comparisonNewLineDirect = {
    lvl0:{
        $type:Number,
        $gt:(context,data,next)=>{
            next(null,25)
        },
        $lt:40,
    },
    lvl1:{
        $type:{
            arrStr:[{
                $type:String,
                $eq:"\n",
            }],
        }
    }
}

this.comparisonOtherModifiers = {
    $type:{
        lvl0:{
            $type:Number,
            $gt:(context,data,next)=>{
                next(null,30)
            },
            $transform:(context,data,next)=>{
                next(null,'transformedValue')
            }
        },
        lvl1:{
            $type:{
                arrStr:{
                    $insert:['c','d','g'],
                    $gte:"c",
                    $lte:(context,data,next)=>{
                        next(null,"g")
                    },
                },
                lvl2:{
                    $type:{
                        test:{
                            $default:'default',
                            $ne:undefined
                        },
                        test1:{
                            $map:['ada','test'],
                            $eq:'test'
                        }
                    }
                }
            }
        }
    }
}

////////////////////////// Match modifiers filter /////////////////////////////////////

this.matchPass = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/^[test][\d]*/)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                   $match:/\w/
                }],
                lvl2:{
                    $type:{
                        test:{
                            $match:undefined
                        },
                        test1:{
                            $match:'rty'
                        }
                    }
                }
            }
        }
    }
}

this.matchFail = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                   $match:/[a-f]/
                }],
                lvl2:{
                    $type:{
                        test:{
                            $match:undefined
                        },
                        test1:{
                            $match:'rty'
                        }
                    }
                }
            }
        }
    }
}

this.matchFailUndefined = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,undefined)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                   $match:/[a-f]/
                }],
                lvl2:{
                    $type:{
                        test:{
                            $match:undefined
                        },
                        test1:{
                            $match:'rty'
                        }
                    }
                }
            }
        }
    }
}

this.matchFailOtherdatatype = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                   $match:123
                }],
                lvl2:{
                    $type:{
                        test:{
                            $match:undefined
                        },
                        test1:{
                            $match:'rty'
                        }
                    }
                }
            }
        }
    }
}

this.matchWithOtherModifiers = {
    $type:{
        lvl0:{
            $insert:0,
            $map:['test5'],
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $transform:(context,data,next)=>{
                        next(null,true)
                    },
                   $match:/[a-i]/
                }],
                lvl2:{
                    $type:{
                        test:{
                            $match:undefined
                        },
                        test1:{
                            $filter:(context,data,next)=>{
                                next(null,false)
                            },
                            $match:'rty'
                        }
                    }
                }
            }
        }
    }
}

///////////////////////////////////////// Message modifer filters /////////////////////////////////

this.message = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            },
            $message:"Test message from $message"
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,data)
                    }
                }],
                lvl2:{
                    $type:{
                        test:String
                    }
                }
            }
        }
    }
}



this.messageNumber = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            },
            $message:123
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }],
                lvl2:{
                    $type:{
                        test:String
                    }
                }
            }
        }
    }
}

this.messageNull = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            },
            $message:null
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }],
                lvl2:{
                    $type:{
                        test:String
                    }
                }
            }
        }
    }
}

this.messageFunc = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            },
            $message:(context,data,next)=>{
                next(null,'test')
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }],
                lvl2:{
                    $type:{
                        test:String
                    }
                }
            }
        }
    }
}

this.messageNewLine = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-5]/)
            },
            $message:"\n"
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $filter:(context,data,next)=>{
                        next(null,true)
                    }
                }],
                lvl2:{
                    $type:{
                        test:String
                    }
                }
            }
        }
    }
}

/////////////////////////////////// Rename modifier filters /////////////////////////////////////

this.rename = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:'RenameAt0'
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $type:null
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:'RenamedAt2'
                        }
                    }
                }
            }
        }
    }
}

this.renameInsideArray = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:'RenameAt0'
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:'5'
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:'RenamedAt2'
                        }
                    }
                }
            }
        }
    }
}

this.renamePassNumber = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:123
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:'5'
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:'RenamedAt2'
                        }
                    }
                }
            }
        }
    }
}

this.renamePassNull = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:null
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:'5'
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:'RenamedAt2'
                        }
                    }
                }
            }
        }
    }
}

this.renamePassUndefined = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:undefined
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:'5'
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:'RenamedAt2'
                        }
                    }
                }
            }
        }
    }
}

this.renameDatatypesViaFunc = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:(context,data,next)=>{
                next(null,123)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:(context,data,next)=>{
                        next(null,[1])
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:(context,data,next)=>{
                                next(null,Function)
                            }   
                        }
                    }
                }
            }
        }
    }
}

this.renamePassConstruc = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:(context,data,next)=>{
                next(null,Function)
            }
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:(context,data,next)=>{
                        next(null,[1])
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:(context,data,next)=>{
                                next(null,Function)
                            }   
                        }
                    }
                }
            }
        }
    }
}

this.renamePassFunctionKeyword = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:Function
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:(context,data,next)=>{
                        next(null,[1])
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:(context,data,next)=>{
                                next(null,Function)
                            }   
                        }
                    }
                }
            }
        }
    }
}

this.renamePassNewLine = {
    $type:{
        lvl0:{
            $match:(context,data,next)=>{
                next(null,/[test][0-6]/)
            },
            $rename:"\n"
        },
        lvl1:{
            $type:{
                arrStr:[{
                    $rename:(context,data,next)=>{
                        next(null,[1])
                    }
                }],
                lvl2:{
                    $type:{
                        test:{
                            $rename:(context,data,next)=>{
                                next(null,Function)
                            }   
                        }
                    }
                }
            }
        }
    }
}

this.renameWithOtherModifiers = {
    $rename:"renameAtTop",
    $type:{
        lvl0:{
            $transform:(context,data,next)=>{
                next(null,'123')
            },
            $rename:"renamed",
            $remove:true
        },
        lvl1:{
            $type:{
                arrStr:{
                    $rename:'renameArr',
                    $type:[String]
                },
                lvl2:{
                    $type:{
                        test:{
                            $insert:'22',
                            $rename:(context,data,next)=>{
                                next(null,'Function')
                            }   
                        }
                    },
                    $rename:'renameLvl2'
                }
            },
            $rename:'renamelvl1'
        }
    }
}

////////////////////////////////////// Length modifier filters ///////////////////////////////////

this.lengthPass = {
    $type:{
        lvl0:{
                $maxlen:(context,data,next)=>{
                next(null,'3')
            }
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:3
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:1  
                        }
                    }
                }
            }
        }
    }
}

this.lengthString = {
    $type:{
        lvl0:{
                $maxlen:'3'
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:3
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:1  
                        }
                    }
                }
            }
        }
    }
}

this.lengthNull = {
    $type:{
        lvl0:{
                $maxlen:null
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:3
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:1  
                        }
                    }
                }
            }
        }
    }
}

this.lengthOtherDataFunc = {
    $type:{
        lvl0:{
                $maxlen:3
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:(context,data,next)=>{
                        next(null,Function)
                    }
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:1  
                        }
                    }
                }
            }
        }
    }
}

this.lengthFuncDir = {
    $type:{
        lvl0:{
                $maxlen:Function
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:(context,data,next)=>{
                        next(null,Function)
                    }
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:1  
                        }
                    }
                }
            }
        }
    }
}

this.lengthOtherDataObj = {
    $type:{
        lvl0:{
                $maxlen:3
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:(context,data,next)=>{
                        next(null,{'one':1})
                    }
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:1  
                        }
                    }
                }
            }
        }
    }
}

this.lengthOtherUndefined = {
    $type:{
        lvl0:{
                $maxlen:3
        },
        lvl1:{
            $type:{
                arrStr:{
                    $minlen:(context,data,next)=>{
                        next(null,undefined)
                    }
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:undefined
                        }
                    }
                }
            }
        }
    }
}

this.lengthWithOtherModifiers = {
    $type:{
        lvl0:{
            $insert:[0,1,2],
            $maxlen:3
        },
        lvl1:{
            $type:{
                arrStr:{
                    $transform:(context,data,next)=>{
                        next(null,'123')
                    },
                    $minlen:(context,data,next)=>{
                            next(null,'\n')
                    }   
                },
                lvl2:{
                    $type:{
                        test:{
                            $length:2,
                            $map:[1,[1,2]] 
                        }
                    }
                }
            }
        }
    }
}


}

module.exports = new filters();        
       
    
