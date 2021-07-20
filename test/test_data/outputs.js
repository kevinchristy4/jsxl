var outputs = function(){

  /////////////// Outputs for $type modifier  /////////////////////
  this.capitalize = (string) =>{
      if(string != null){
          return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }

  this.outputForType = (level,mustBe,not)=>{
      var lvl = null;
      (level == '0') ? lvl = 'lvl0' : lvl = 'lvl1.lvl2.str';
      if(not != 'null'){
          return `(execute v2) input.${lvl} must be type ${this.capitalize(mustBe)} (not ${this.capitalize(not)})`
      }else{
          return `(execute v2) input.${lvl} must be type ${this.capitalize(mustBe)} (not ${not})`
      }

  }

  //outputs for undefined errors 
  this.stringUndefined = "(execute v2) input.lvl0 must be provided";
  this.stringUndefinedlvl2 = "(execute v2) input.lvl1.lvl2.str must be provided";

  this.typePassGenericFunction = '(execute v2) input.lvl0 must be type lvl0 (not Function)'
 

  ///////////////////////// Outputs for $filter modifier //////////////////////////

  this.filterTrue = {
      lvl0: 'true',
      lvl1: {
        arrStr: [ true, true, 'test', 34 ],
        lvl2: { str: 'true' }
      }
  }

  this.filterFalse = {
      lvl1: {
          arrStr: [ true, true, 'test', 34 ],
          lvl2: {}
      }
  }

  this.ifString = "(compile) (execute v2) filter.$type.lvl0.$filter must be type Function (not String)";
  this.ifBoolean = "(compile) (execute v2) filter.$type.lvl1.$type.arrStr[0].$filter must be type Function (not Boolean)";
  this.useAlongsideANonModifier = "(compile) (execute v2) filter.$type mixes modifier ($filter) with non-modifier (lvl0)";

   //////////////////////// Outputs for $transform ////////////////////////////////////

   this.transform1 = {
      lvl0: 'trueT',
      lvl1: {
        arrStr: [
          'falseT', 'trueT',
          'falseT', 'trueT',
          'nullT',  'testT',
          '34T',    '0T',
          'NaNT'
        ],
        lvl2: { test: 'trueT' }
      }
    };

  this.removeValue = {
      lvl1:{one:1}
  };

  this.nullUndefined = {
      lvl0:"false"
  }

  this.verifyMofifiedValue = { lvl1: { lvl2: 44 }, lvl0: 'fromTransform' }

  this.typeError = "(compile) (execute v2) filter.$type.lvl0.$transform must be type Function (not Number)";


  //////////////////////////// Outputs for $remove /////////////////////////////////////////

  this.remove_test = {
      lvl0:'true'
  }

  this.stringerror = "(compile) (execute v2) filter.$type.lvl1.$remove must be type Boolean (not String)"
  this.nullError = "(compile) (execute v2) filter.$type.lvl1.$remove must be type Boolean (not null)"

   /////////////////////////// $insert, $default outputs /////////////////////////////////

   this.topLvlInsert = "(execute v2) input.lvl0 must be provided";

   this.insertAlllvl = {
    lvl0: 'Inserted value',
    lvl1: { arrStr: '\n', lvl2: { str: 'Inserted\n55' } }
  }

   this.insertNullUndefined = {
       lvl0: null, 
       lvl1: { 
           arrStr: undefined, 
           lvl2: { 
               str: [undefined, 0, null]  
           } 
       } 
   }

   this.insertDifferentTypeError = "(execute v2) input.lvl1.arrStr must be type Object (not Array)";
   this.useInsertWithRemoveDefault = "(compile) (execute v2) filter.$type.lvl0.$type filter.$type.lvl0.$type holds multiple of $remove, $insert, or $default modifiers while transforming";

   this.insertValues = { lvl0: 25, lvl1: { arrStr: [ 1, 2 ], lvl2: { test: [undefined,0] } } }

   this.defaultOutput = {
       lvl0: 'Defaulted value',
       lvl1: {
         arrStr: [ false, 'Defaulted value', false, null, 'test', 34, 0, NaN ],
         lvl2: { test: ["Defaulted value"] }
       }
     }

     this.defaultValuePresemt = {
      lvl0:'true',
      lvl1:{
          arrStr:[false,true,false,true,null,'test',34,0,NaN],
          lvl2:{
              test:'true'
          }
      }
  }

   this.defaultUndefinedOutput = {
       lvl0: 'undefined\n',
       lvl1: {
         arrStr: [ false, undefined, false, null, 'test', 34, 0, NaN ],
         lvl2: { test: null }
       }
     }

   this.defaultErrorWithType = "(execute v2) input.lvl1.lvl2.test must be type Array (not null)"

//////////////////////////////////// $optional outputs ////////////////////////////////

 this.optionalTrue = {
  lvl0: 'transformed value',
  lvl1: { arrStr: 'Inserted value', lvl2: { test: true } }
}

this.optionalAtTopError = "(execute v2) input.lvl0 must be provided";
this.optionalAlongWithOtherModifiers = "(compile) (execute v2) filter.$type.lvl1.$type.arrStr.$type filter.$type.lvl1.$type.arrStr.$type holds any of $remove, $insert, or $default modifiers but is explicitly mandatory (non-optional) while transforming"
this.optionalWithOtherDatatype = "(compile) (execute v2) filter.$type.lvl0.$optional must be type Boolean (not Number)";

/////////////////////////////////////// $map outputs ///////////////////////////////////////

this.mapWithString = {
  lvl0: 0,
  lvl1: { 
    arrStr: [ [ 'Mapped', undefined, 1, {} ], { '1': undefined, '2': { n: 'g' }, '3': null } ],
    lvl2: { 
      test: true 
    }
  }
}

this.mapUndefinedError = "(execute v2) input.lvl1.arrStr[0] cannot map into type undefined, is not Object or Array";
this.mapOtherdirectly = "(compile) (execute v2) one of\nfilter.$type.lvl0.$map must be type Function (not null),\nfilter.$type.lvl0.$map must be type Array (not null), or\nfilter.$type.lvl0.$map must be type Object (not null)"

this.mapNumberToArray = {
  lvl0: 44,
  lvl1: {
    arrStr: [ ['a','b'], {1:1}, null],
    lvl2: { test: null }
  }
}

this.mapOtherDattypeInput = "(execute v2) input.lvl0 must map with type String (not Number)"
this.mapInputNotPresentInFilter = '(execute v2) input.lvl1.arrStr[2] must be included in [ "test", "test1" ]'
this.mapOutOfArrayRange = "(execute v2) input.lvl1.arrStr[2] must be in range of [ 0, 6 ]";
this.mapInputOtherThanNumber = "(execute v2) input.lvl0 must map with type Number (not String)"

///////////////////////////// Comparison outputs ///////////////////////////

this.compareError = "(execute v2) input.lvl0 must be greater than 25";
this.compareError1 = '(execute v2) input.lvl1.arrStr[0] must be greater than or equal to "b"';
this.compareUndefinedFunc = "(execute v2) input.lvl0 must be equal to undefined";
this.compareundefinedDir = { lvl0: 30 };
this.compareNewLineFunc = '(execute v2) input.lvl1.arrStr[0] must be equal to "\\n"';
this.compareNewLineDir = '(execute v2) input.lvl1.arrStr[0] must be equal to "\\n"';

this.compareOtherModifiers = {
  lvl0: 'transformedValue',
  lvl1: {
    arrStr: ['c','d','g'],
    lvl2: { test: 'default', test1: 'test' }
  }
}

///////////////////////////// Match outputs ////////////////////////////

this.matchRegexFunc = "(execute v2) input.lvl0 must match /[test][0-5]/"
this.matchRegexDir = "(execute v2) input.lvl1.arrStr[2] must match /[a-f]/"
this.matchString = '(execute v2) input.lvl1.lvl2.test1 must match "rty"'
this.matchUndefined = "(execute v2) input.lvl0 must match undefined"
// this.matchOtherDatatype = "(compile) (execute v2) one of\nfilter.$type.lvl1.$type.arrStr[0].$match must be type Function (not Number),\nfilter.$type.lvl1.$type.arrStr[0].$match must be type String (not Number), or\nfilter.$type.lvl1.$type.arrStr[0].$match must be type RegExp (not Number)"
this.matchOtherDatatype = `(execute v2) input.lvl1.arrStr[0] must match 8`
this.matchWithOthermodifier = {
  lvl0: 'test5',
  lvl1: { arrStr: [ true, true, true ], lvl2: { test: 'undefined' } }
}


//////////////////////////////////// Message outputs ///////////////////////////////

this.message = "(execute v2) input.lvl0 Test message from $message"
this.messageTypeError = "(compile) (execute v2) filter.$type.lvl0.$message must be type String (not Number)"; 
this.messageTypeError1 = "(compile) (execute v2) filter.$type.lvl0.$message must be type String (not null)";
this.messageTypeError2 = "(compile) (execute v2) filter.$type.lvl0.$message must be type String (not Function)"

this.msgNewLineMsg = "(execute v2) input.lvl0 \n"


//////////////////////////////////// Rename outputs ///////////////////////////////////////

this.renameKeys = {
  RenameAt0: 'test66',
  lvl1: { arrStr: [ 'b', 5 ], lvl2: { RenamedAt2: 'undefined' } }
}

this.renameInsideArray = '(compile) (execute v2) filter.$type.lvl1.$type.arrStr[0].$rename cannot rename when inside array while filtering'

this.renameOtherDatatype = "(compile) (execute v2) one of\nfilter.$type.lvl0.$rename must be type Function (not Number) or\nfilter.$type.lvl0.$rename must be type String (not Number)"
this.renamePassNull = "(compile) (execute v2) one of\nfilter.$type.lvl0.$rename must be type Function (not null) or\nfilter.$type.lvl0.$rename must be type String (not null)"

this.renameUndefined = {
  lvl0: 'test66',
  lvl1: { '5': [ 'b', 5 ], lvl2: { RenamedAt2: 'undefined' } }
}

this.renameOtherDatatypesFunc = '(execute v2) input.lvl0.$rename function must return a value of type String'

this.renameOtherModifiers = {
  renamelvl1: { renameArr: [ 'b', 'a' ], renameLvl2: { Function: '22' } }
}

this.renameNewLine = {
  '\n': 'test66',
  lvl1: {
    arrStr: [ 'b', 5 ],
    lvl2: { 'lvl3Test': 'undefined' }
  }
}

this.renamePassFunc = '(execute v2) throws error (Unexpected identifier) while renaming'

////////////////////////////////// Array length outputs ///////////////////////////////////

this.lengthMax = '(execute v2) input.lvl0 must have maximum length 3'
this.lengthMin = "(execute v2) input.lvl1.arrStr must have minimum length 3"
this.lengthLen = "(execute v2) input.lvl1.lvl2.test must have exact length 1"

this.lengthTypeError = "(compile) (execute v2) one of\nfilter.$type.lvl0.$maxlen must be type Function (not String) or\nfilter.$type.lvl0.$maxlen must be type Number (not String)"
this.lengthTypeError1 = "(compile) (execute v2) one of\nfilter.$type.lvl0.$maxlen must be type Function (not null) or\nfilter.$type.lvl0.$maxlen must be type Number (not null)"

this.lengthErrorFunc = "(execute v2) input.lvl1.arrStr.$minlen function must return a value of type Number";
this.lengthErrorObj = "(execute v2) input.lvl1.arrStr.$minlen function must return a value of type Number"
this.lengthUndefined = "(execute v2) input.lvl1.arrStr.$minlen function must return a value of type Number";

this.lengthWithOtherModifier = { lvl0: [ 0, 1, 2 ], lvl1: { arrStr: '123', lvl2: { test: [ 1, 2 ] } } }

////////////////////////////////////  Includes Outputs  ///////////////////////////////////////////

this.inFail = "(execute v2) input.lvl0 must be included in [ null, 0 ]"
this.ninFail = "(execute v2) input.lvl1.arrStr[3] must be excluded from {\n\ttrue: 1\n}"

this.inNewLineInArray = {
lvl0: null,
lvl1: { arrStr: [ 'b', [ 'a' ], 0 ], lvl2: { test: Infinity } }
}

this.inStringError = "(compile) (execute v2) one of\nfilter.$type.lvl0.$in must be type Function (not String),\nfilter.$type.lvl0.$in must be type Array (not String), or\nfilter.$type.lvl0.$in must be type Object (not String)"
this.inNullError = "(compile) (execute v2) one of\nfilter.$type.lvl0.$in must be type Function (not null),\nfilter.$type.lvl0.$in must be type Array (not null), or\nfilter.$type.lvl0.$in must be type Object (not null)"

this.inOtherModifier = { lvl0: 5, lvl1: { arrStr: '123', lvl2: { test: [12] } } }

this.incError = "(execute v2) input.lvl0 must include true"
this.incFailAtTop = "(execute v2) input.lvl1 must be provided"
this.PassFuncKeyword = '(execute v2) throws error (Unexpected identifier) while modifying'

this.nincFail = "(execute v2) input.lvl1.lvl2.test must exclude 1"

this.incTypeError = "(compile) (execute v2) one of\nfilter.$type.lvl0.$inc must be type Function (not Array),\nfilter.$type.lvl0.$inc must be type Boolean (not Array),\nfilter.$type.lvl0.$inc must be type Number (not Array),\nfilter.$type.lvl0.$inc must be type String (not Array),\nfilter.$type.lvl0.$inc must be type RegExp (not Array), or\nfilter.$type.lvl0.$inc must be type Date (not Array)"
this.incTypeError1 = "(compile) (execute v2) one of\nfilter.$type.lvl1.$type.lvl2.$type.test.$inc must be type Function (not Object),\nfilter.$type.lvl1.$type.lvl2.$type.test.$inc must be type Boolean (not Object),\nfilter.$type.lvl1.$type.lvl2.$type.test.$inc must be type Number (not Object),\nfilter.$type.lvl1.$type.lvl2.$type.test.$inc must be type String (not Object),\nfilter.$type.lvl1.$type.lvl2.$type.test.$inc must be type RegExp (not Object), or\nfilter.$type.lvl1.$type.lvl2.$type.test.$inc must be type Date (not Object)"
this.incTypError2 = "(execute v2) input.lvl1.arrStr must include ()=>{}";

this.incWithOtherModifier = { lvl0: [ 6 ], lvl1: { arrStr: '123', lvl2: { renamed:{'one':1,true:false } } }};

this.inPassNumViaFunc = "(execute v2) input.lvl1.arrStr[0].$in function must return a value of type [ Array, Object ]"

this.incPassNewLineDir = {
lvl0: [ undefined, true, null, Infinity, '\n' ],
lvl1: { arrStr: [ 'test', 1, 5 ], lvl2: { test: { one: 1, true: false } } }
}

this.incPassNumberInput = "(execute v2) input.lvl1.arrStr must be of type array or object and include 5"
this.incPassStringInput = "(execute v2) input.lvl0 must include true"

///////////////////////////////// $toObject Outputs ///////////////////////////////////////

this.toObjectPass = {
lvl0: { '55': {} },
lvl1: {
  arrObj: {
    '99': { '4': 8, test1: 56, test: 55 },
    kkll: { '55': 88, true: false }
  }
}
}

this.toObjFailNumber = "(compile) (execute v2) filter.$type.lvl0.$toObject must be type String (not Number)"
this.toObjFailFunc = "(compile) (execute v2) filter.$type.lvl0.$toObject must be type String (not Function)"
this.toObjStrInput = "(execute v2) input.lvl0 cannot convert to Object, is not an Array"
this.toObjStrInputlvl1 = "(execute v2) input.lvl1.arrObj cannot convert to Object, is not an Array"
this.toObjNoKey = "(execute v2) input.lvl0[0] has no object key: test"
this.toObjStrKey = "(execute v2) input.lvl0[0] has non-String object key: test"
this.toObjUndefinedKey = "(execute v2) input.lvl1.arrObj[0] has no object key: lvl1"

this.toObjectWithOtherModifier = {
lvl0: { '66': {} },
lvl1: {
  arrStr: [ { lvl2: { '11': {} } } ]
}
}


///////////////////////////////////////// toArray outputs //////////////////////////////////////////////

this.toArrayPass = {
  lvl0: [ { one: 1, two: 2, '\n': 'test' } ],
  lvl1: {
    arrStr: [
      { lvl2: [ { '5': 6, lastLvl: 'lvl3' } ] }
    ]
  }
}

this.toArrayNull = "(compile) (execute v2) filter.$type.lvl0.$toArray must be type String (not null)"

this.toArrayOtherMod = {
renamed: [ { one: 1, two: 2, '\n': 'test' } ],
lvl1: {
  arrStr: [
    { lvl2: [ { '5': 6, lastLvl: 'lvl3' } ] }
  ]
}
}

this.toArrayTopLevel = '(execute v2) input.lvl0 must be an object for input to convert to array';
this.toArrayIncompatible = '(execute v2) input.lvl0.test must be an object for input.lvl0 to convert to array'

}
module.exports = new outputs();
