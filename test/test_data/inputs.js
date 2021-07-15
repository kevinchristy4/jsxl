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

    this.typeGenericFunc = {
        lvl0:()=>{},
        test:{
            lvl1:()=>{}
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
        lvl0:5,
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
        lvl0:'fromInput',
        lvl1:{
            lvl2:55
        }
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

//////////////////////////// $Optional Inputs //////////////////////////////////

this.optionalNoInputValues = { 
    lvl1:{
        lvl2:{
        }
    }
}


////////////////////////////// $map Inputs ///////////////////////////////////////////

this.mapStringInput = {
    lvl0:'qwe',
    lvl1:{
        arrStr:['test','test1'],
        lvl2:{
            test:'true'
        }
    }
}

this.mapOtherDatatype = {
    lvl0:0,
    lvl1:{
        arrStr:[0,[1],{}],
        lvl2:{
            test:new Date()
        }
    }
}

this.mapToValuesNotPresent = {
    lvl0:'test66',
    lvl1:{
        arrStr:['test','test1','test2'],
        lvl2:{
            test:'false'
        }
    }
}

this.mapNumberToArray =  {
    lvl0:undefined,
    lvl1:{
        arrStr:[2,3,5],
        lvl2:{
            test:undefined
        }
    }
}

this.mapNumberOutOfRange ={
    lvl0:0,
    lvl1:{
        arrStr:[2,3,6,9],
        lvl2:{
            test:-9
        }
    }
}

this.mapOtherToArray = {
    lvl0:'Infinity',
    lvl1:{
        arrStr:[1],
        lvl2:{
            test:[]
        }
    }
}

/////////////////////////// Comparison Inputs //////////////////////////////

this.comparisonPositive = {
    lvl0:30,
    lvl1:{
        arrStr:['b','f','i'],
        lvl2:{
            test:{
                'one':1,
                'two':2
            },
            test1:new Date().getDate()
        }
    }
}

this.compareErrorInput ={
    lvl0:20,
    lvl1:{
        arrStr:['a','b','f','i'],
        lvl2:{
            test:{
                'one':1,
                'two':2
            },
            test1:new Date().getDate()
        }
    }
}

this.compareError1Input ={
    lvl0:30,
    lvl1:{
        arrStr:['a','b','f','i'],
        lvl2:{
            test:{
                'one':1,
                'two':2
            },
            test1:new Date().getDate()
        }
    }
}

this.compareUndefine = {
    lvl0:30
}

this.compareNewLine = {
    lvl0:30,
    lvl1:{
        arrStr:['1','2'],
    }
}

this.compareOtherModifiers = {
    lvl0:35,
    lvl1:{
        arrStr:['b','f','i'],
        lvl2:{
            test:undefined,
            test1:1
        }
    }
}

//////////////////////////// Match modifiers input ////////////////////////////

this.matchPass = {
    lvl0:'test123',
    lvl1:{
        arrStr:['b','f','i'],
        lvl2:{
            test:'undefined',
            test1:'qwerty'
        }
    }
}

this.matchFailFunc = {
    lvl0:'test66',
    lvl1:{
        arrStr:['b','f','i'],
        lvl2:{
            test:'undefined',
            test1:'qwerty'
        }
    }
}

this.matchFailDir = {
    lvl0:'test55',
    lvl1:{
        arrStr:['b','f','i'],
        lvl2:{
            test:'undefined',
            test1:'qwerty'
        }
    }
}

this.matchFailStr = {
    lvl0:'test55',
    lvl1:{
        arrStr:['b','f'],
        lvl2:{
            test:'undefined',
            test1:'qwe'
        }
    }
}


/////////////////////////////////// Message modifier ///////////////////////////////

this.message = {
    lvl0:'test66',
    lvl1:{
        arrStr:['b','f'],
        lvl2:{
            test:'undefined',
        }
    }
}

this.messageNoError = {
    lvl0:'test55',
    lvl1:{
        arrStr:['b','f'],
        lvl2:{
            test:'undefined',
        }
    }
}

///////////////////////////////////// Rename modifier input /////////////////////////////

this.renameKeys = {
    lvl0:'test66',
    lvl1:{
        arrStr:['b',5],
        lvl2:{
            test:'undefined',
        }
    }
}

this.renameWithModifiers = {
    lvl0:'test66',
    lvl1:{
        arrStr:['b','a'],
        lvl2:{
            test:'undefined',
        }
    }
}

/////////////////////////////////// Length modifier input ///////////////////////////////////////

this.length = {
    lvl0:['test',1,2],
    lvl1:{
        arrStr:['b','a','c'],
        lvl2:{
            test:[undefined],
        }
    }
}

this.lengthFailMax = {
    lvl0:['test',1,2,3],
    lvl1:{
        arrStr:['b','a','c'],
        lvl2:{
            test:[undefined],
        }
    }
}

this.lengthFailMin = {
    lvl0:['test',1,2],
    lvl1:{
        arrStr:['b','a'],
        lvl2:{
            test:[undefined],
        }
    }
}

this.lengthFail = {
    lvl0:['test',1,2],
    lvl1:{
        arrStr:['b','a','c'],
        lvl2:{
            test:[],
        }
    }
}

this.lengthWithOther = {
    lvl0:['test',1,2,undefined],
    lvl1:{
        arrStr:['b','a','c'],
        lvl2:{
            test:1,
        }
    }
}


//////////////////////////////////// Includes modifier inputs //////////////////////////////////

this.inPass = {
    lvl0:null,
    lvl1:{
        arrStr:['b',['a'],0],
        lvl2:{
            test:Infinity,
        }
    }
}

this.ninFail = {
    lvl0:null,
    lvl1:{
        arrStr:['b',['a'],0,true],
        lvl2:{
            test:Infinity,
        }
    }
}

this.inFail = {
    lvl0:'null',
    lvl1:{
        arrStr:['b',['a'],0],
        lvl2:{
            test:Infinity,
        }
    }
}

this.inWithOtherModifier = {
    lvl0:null,
    lvl1:{
        arrStr:undefined,
        lvl2:{
            test:1,
        }
    }
}

this.incPass = {
    lvl0:[undefined,true,null,Infinity,'\n'],
    lvl1:{
        arrStr:['test',1,5],
        lvl2:{
            test:{
                'one':1,
                true:false
            },
        }
    }
}

this.incFail =  {
    lvl0:[undefined,null,Infinity],
    lvl1:{
        arrStr:['test',1],
        lvl2:{
            test:{
                'one':1,
                true:false
            },
        }
    }
}

this.incFailAtTop =  {
    lvl0:[undefined,null,Infinity,true],
}

this.nincFail =  {
    lvl0:[undefined,null,Infinity,true],
    lvl1:{
        arrStr:['test',1,5],
        lvl2:{
            test:{
                'one':1,
                true:false,
                1:'one'
            },
        }
    }
}

this.incNumbe = {
    lvl0:[undefined,true,null,Infinity],
    lvl1:{
        arrStr:5,
        lvl2:{
            test:{
                'one':1,
                true:false
            },
        }
    }
}

this.incString = {
    lvl0:'test',
    lvl1:{
        arrStr:['test',1],
        lvl2:{
            test:{
                'one':1,
                true:false
            },
        }
    }
}

this.incWithOtherModifiers = {
    lvl0:[undefined,null,Infinity,true],
    lvl1:{
        arrStr:undefined,
        lvl2:{
            test:{
                'one':1,
                true:false
            },
        }
    }
}

///////////////////////////////////// $toObject Inputs ////////////////////////////////////////////

this.toObjectPass = {
    lvl0:[{'test':'55'}],
    lvl1:{
        arrObj:[{lvl1:'99',test1:56,4:8,'test':55},{lvl1:'kkll',55:88,true:false}],
    }
}

this.toObjectString = {
    lvl0:'test',
    lvl1:{
        arrObj:'55',
    }
}

this.toObjectStringlvl1 = {
    lvl0:[{test:'123'}],
    lvl1:{
        arrObj:'55',
    }
}

this.toObjectEmpArr = {
    lvl0:[],
    lvl1:{
        arrObj:[{lvl1:'321'}],
    }
}

this.toObjectArrNoKey = {
    lvl0:[{test1:'test'}],
    lvl1:{
        arrObj:'55',
    }
}

this.toObjectNumberValue = {
    lvl0:[{test:55}],
    lvl1:{
        arrStr:[{lvl1:'\n',test1:56,4:8,'test':55},{lvl1:'kkll',55:88,true:false}],
    }
}

this.toObjectundefinedValue = {
    lvl0:[{test:'55'}],
    lvl1:{
        arrObj:[{lvl1:undefined,test1:56,4:8,'test':55},{lvl1:'kkll',55:88,true:false}],
    }
}

this.toObjectWithotherModifier = {
    lvl0:[{test:'55'}],
    lvl1:{
        arrStr:[{lvl2:[{lvl3:'11'}]}],
    }
}


//////////////////////////////////////////////////// $toArray inputs /////////////////////////////////////////////////////

this.toArrInput = {
    lvl0:{
        'test':{
            'one':1,
            'two':2
        }
    },
    lvl1:{
        arrStr:[{lvl2:{lvl3:{5:6}}}],
    }
}

this.toArrInputTop = {
    lvl0:{
        'test':{
            'one':1,
            'two':2
        }
    },
    lvl1:{
        arrStr:[{lvl2:{lvl3:{5:6}}}],
    }
}

this.toArrayWithOtherMod = {
    lvl0:undefined,
    lvl1:{
        arrStr:[{lvl2:{lvl3:null}}],
    }
}

this.toArrInputIncompatible = {
    lvl0:{
        'test':true
    },
    lvl1:{
        arrStr:[{lvl2:{lvl3:{5:6}}}],
    }
}

}


module.exports = new inputs();        
