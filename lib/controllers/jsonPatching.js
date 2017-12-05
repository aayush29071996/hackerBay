//Require the JSON PATCH NPM MODULE
var jsonpatch = require('fast-json-patch');

exports.patcher = function(req, res) {


    //PARSE THE ORIGNAL DOCUMENT HERE
    var document = { firstName: req.body.jsonObject };

    //PARSE THE NEW PATCH OBJECT AND FUNCTION HERE
    var operation = { op: "replace", path: "/firstName", value: req.body.jsonPatchObject };


    //PERFORM THE PATCH OPERATION HERE
    document = jsonpatch.applyOperation(document, operation).newDocument;

    //SEND RESPONSE HERE DOCUMENT
    res.json({
        success: true,
        message: 'Enjoy your patch!',
        document: document
    });


};