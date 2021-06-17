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


}
module.exports = new outputs();
