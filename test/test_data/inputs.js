
var inputs = function(){


    ///////////////// Inputs For $type modifier //////////////////////

    this.stringString = {
        lvl0:'TestString',
        lvl1:{
            arrStr:['TestString'+'\n'+3],
            lvl2:{
                str:''
            }
        }
    }

    this.stringUndefined = {
        lvl0:undefined,
        lvl1:{
            arrStr:['sting'],
            lvl2:{
                str:'String'
            }
        }
    }

    this.stringUndefinedlvl2 = {
        lvl0:'String',
        lvl1:{
            arrStr:['sting'],
            lvl2:{
                str:undefined
            }
        }
    }

    this.stringNull = {
        lvl0:null,
        lvl1:{
            arrStr:['sting'],
            lvl2:{
                str:'string'
            }
        }
    }

    this.stringNulllvl2 = {
        lvl0:'null',
        lvl1:{
            arrStr:['sting'],
            lvl2:{
                str:null
            }
        }
    }

    this.numberNumber = {
        lvl0:1,
        lvl1:{
            arrStr:[-NaN,-Infinity,-50,-5^-5,-0.25,-0,0,0.25,5^5,50,Infinity,NaN],
            lvl2:{
                str:2
            }
        }
    }

    this.numberNull = {
        lvl0:null,
        lvl1:{
            arrStr:[-NaN,-Infinity,-50,-5^-5,-0.25,-0,0,0.25,5^5,50,Infinity,NaN],
            lvl2:{
                str:2
            }
        }
    }

    this.numberNulllvl2 = {
        lvl0:5,
        lvl1:{
            arrStr:[-NaN,-Infinity,-50,-5^-5,-0.25,-0,0,0.25,5^5,50,Infinity,NaN],
            lvl2:{
                str:null
            }
        }
    }

    this.boolean = {
        lvl0:true,
        lvl1:{
            arrStr:[true,false],
            lvl2:{
                str:false
            }
        }
    }

    this.booleanNull = {
        lvl0:null,
        lvl1:{
            arrStr:[true,false],
            lvl2:{
                str:false
            }
        }
    }

    this.booleanNulllvl2 = {
        lvl0:true,
        lvl1:{
            arrStr:[true,false],
            lvl2:{
                str:null
            }
        }
    }

    this.date = {
        lvl0:new Date(2018,11),
        lvl1:{
            arrStr:[new Date(0),new Date(2018)],
            lvl2:{
                str:new Date("date")
            }
        }
    }

    this.dateNull = {
        lvl0:null,
        lvl1:{
            arrStr:[new Date(0),new Date(2018)],
            lvl2:{
                str:new Date("date")
            }
        }
    }

    this.dateNulllvl2 = {
        lvl0:new Date(2018,11),
        lvl1:{
            arrStr:[new Date(0),new Date(2018)],
            lvl2:{
                str:null
            }
        }
    }

    this.function = {
        lvl0:()=>{},
        lvl1:{
            arrStr:[()=>{}],
            lvl2:{
                str:()=>{}
            }
        }
    }

    this.functionNull = {
        lvl0:null,
        lvl1:{
            arrStr:[()=>{}],
            lvl2:{
                str:null
            }
        }
    }

    this.functionNulllvl2 = {
        lvl0:function name(params) {
            
        },
        lvl1:{
            arrStr:[()=>{}],
            lvl2:{
                str:null
            }
        }
    }

    this.array = {
        lvl0:[1,2],
        lvl1:{
            arrStr:[()=>{},1,new Date(),"test",true,{},[]],
            lvl2:{
                str:[undefined]
            }
        }
    }

    this.arrayNull = {
        lvl0:null,
        lvl1:{
            arrStr:[()=>{},1,new Date(),"test",true,{},[]],
            lvl2:{
                str:[]
            }
        }
    }

    this.arrayNulllvl2 = {
        lvl0:[],
        lvl1:{
            arrStr:[()=>{},1,new Date(),"test",true,{},[]],
            lvl2:{
                str:null
            }
        }
    }

    this.object = {
        lvl0:{},
        lvl1:{
            arrStr:[{},{1:()=>{}}],
            lvl2:{
                str:{}
            }
        }
    }

    this.objectNull = {
        lvl0:null,
        lvl1:{
            arrStr:[{},{1:()=>{}}],
            lvl2:{
                str:{}
            }
        }
    }

    this.objectNulllvl2 = {
        lvl0:{null:null},
        lvl1:{
            arrStr:[{},{1:()=>{}}],
            lvl2:{
                str:null
            }
        }
    }

    ////////////////////// Inputs for Filter modifier ///////////////////////
    
    this.filterTrue = {
        lvl0:'true',
        lvl1:{
            arrStr:[false,true,false,true,null,'test',34,0,NaN],
            lvl2:{
                str:'true'
            }
        }
    }

    this.filterFalse = {
        lvl0:'false',
        lvl1:{
            arrStr:[false,true,false,true,null,'test',34,0,NaN],
            lvl2:{
                str:'false'
            }
        }
    }

    //////////////////////////// Inputs for $transform //////////////////////

    this.transform1 = {
        lvl0:'false',
        lvl1:{
            arrStr:[false,true,false,true,null,'test',34,0,NaN],
            lvl2:{
                test:'false'
            }
        }
    }
    
    this.transform_removeValue = {
        lvl0:'false',
        lvl1:{
            'one':1
        }
    }

    this.transform_null_undefined = {
        lvl0:'false',
    }

    this.transform_otherDataTypes = {
        lvl0:'false'
    }

    this.transform_validateModifiedValues = {
        lvl0:'fromInput'
    }

    ////////////////////////// Inputs for $remove //////////////////////////////////

    this.removeInput = {
        lvl0:'true',
        lvl1:{
            arrStr:[false,true,false,true,null,'test',34,0,NaN],
            lvl2:{
                str:'true'
            }
        }
    }

    /////////////////////////// Inputs for $insert, $default and $optional /////////////////////////////////

    this.insertInput = {
        lvl0:'true',
        lvl1:{
            arrStr:[false,true,false,true,null,'test',34,0,NaN],
            lvl2:{
                str:'true'
            }
        }
    }

    this.insertPartialInput = {
        lvl1:{
            lvl2:{
            }
        }
    }

    this.defaultInput = {
        lvl0:undefined,
        lvl1:{
            arrStr:[false,undefined,false,null,'test',34,0,NaN],
            lvl2:{
            }
        }
    }


this.defaultWithValues = {
    lvl0:'true',
    lvl1:{
        arrStr:[false,true,false,true,null,'test',34,0,NaN],
        lvl2:{
            test:'true'
        }
    }
}

}

module.exports = new inputs();        
