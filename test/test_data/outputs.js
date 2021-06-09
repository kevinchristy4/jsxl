var outputs = function(){

    this.outputTest= {
        "insert": "insertedID",
        "jFormData": {
            "default": "test123",
            "fieldConfigs": [
                {
                    "map": 3,
                    "mapTo": "triple",
                    "className": "page-input-field",
                    "templateOptions": {
                        "equal": "triple",
                        "any_gt_in": [10,"b",30]
                    }
                }
            ]
        }
    };

    this.typeOutput_pass = {
        "string":"stringTest",
        "number": 5,
        "boolean": true,
        "date":new Date().toString(),
        "array": [ 1, 2, 3 ],
        "object": { "a": 1 }
    }

    this.typeError = "(compile) (execute v2) filter.$type mixes modifier ($type) with non-modifier (string)";
    this.typeError2 = "(execute v2) input.array[2] must be type Number (not String)";

    this.filterOutput = { one: [ 2, 4 ], two: [ 6, 8 ], three: [ 10, 12 ], four: [ 14, 16 ] };

    this.transFormOutput = { '2': [ 60, 80 ], '4': [ 140, 160 ] };
}
module.exports = new outputs();
