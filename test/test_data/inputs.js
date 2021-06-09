
var inputs = function(){

    this.modifier1={
        "insert": "modifier",
        "remove": "test123",
        "jFormData": {
            "fieldConfigs": [
                {
                    "map": "triple_select",
                    "mapTo": 3,
                    "className": "page-input-field",
                    "templateOptions": {
                        "equal": "triple",
                        "any_gt_in": [10,"b",30]
                    }
                }
            ]
        }
    }

    this.typeInput_pass = {
        "string":"stringTest",
        "number":5,
        "boolean":true,
        "date":new Date(),
        "array":[1,2,3],
        "object":{"a":1}
    };

    this.typeInput_fail = {
        "string":"stringTest",
        "number":5,
        "boolean":true,
        "date":new Date(),
        "array":[1,2,"3"],
        "object":{"a":1}
    };

    this.filterInput_pass = {
        one:[1,2,3,4],
        two:[5,6,7,8],
        three:[9,10,11,12],
        four:[13,14,15,16]
    }

    this.transformInputPass = {
        1:[1,2,3,4],
        2:[5,6,7,8],
        3:[9,10,11,12],
        4:[13,14,15,16]
    }



}


module.exports = new inputs();        
