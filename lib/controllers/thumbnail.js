var fs = require('fs');
var ImageResize = require('node-image-resize'),
request = require('request');
var moment = require('moment');




exports.thumbnailMaker = function(req, res) {

    //DOWNLOAD FUNCTION FOR THE IMAGE THROUGH URL
    var download = function(uri, filename, callback){

        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };


    //PARSE THE URL AND SPECIFY FILENAME
    var  uri= req.body.url;
    var filename = moment.utc()+".jpg";

    //DOWNLOAD THE FILE
    download( uri , filename , function(){
        console.log('done');

        //USE IMAGE THUMBNAIL MIDDLEWARE MODULE TO RESIZE
        var image = new ImageResize(filename);

            image.smartResizeDown({
                width: 50,
                height: 50
            }).then(function () {

                //STORE IT IN ROOT DIRECTORY
                image.stream(function (err, stdout, stderr) {
                    var writeStream = fs.createWriteStream('./resized'+filename);
                    stdout.pipe(writeStream);

                    //SEND AS A RESPONSE
                    writeStream.pipe(res);

                    res.json({
                        success: true,
                        message: 'Enjoy your thumbnail!'

                    });

                });
            });

    });




};