// built-in Node.js modules
var fs = require('fs');
var http = require('http');
var path = require('path');
var qs = require('querystring');

var port = 8000;
var publicDirectory = path.join(__dirname, 'public');

let memebersFilePath = path.join(publicDirectory, 'data/members.json');
let memebersJson;
fs.readFile(memebersFilePath, (err, data) => { // read data from members.json
    if (err) {
        console.log('Could not open or find members.json');
        return console.log(err);
    }else {
        let membersFileContents = data.toString(); // get data from file and make string
        memebersJson = JSON.parse(membersFileContents); // turn data into json (object)
    }
});

let joinFilePath = path.join(publicDirectory, 'join.html');
let joinFileData;
fs.readFile(joinFilePath, (err, data) => {
    if(err){
        console.log('Could not find or read join.html');
    }else{
        joinFileData = data;
    }
});

// Properly serve files with correct 'Content-Type' for the six file types above
// Select proper 'Content-Type' without the use of if-else statements
// HTML, CSS, JavaScript, JSON, Jpeg, and Png files
const contentTypeMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpeg': 'image/jpg',
    '.jpg': 'image/jpg',
    '.png': 'image/png',
};

/*
/images/imagethumb09.jpg
/images/close.png
/images/imagefull01.jpg
/css/style.css
/signup.html
*/

function handleGET(req, res){
    var requestedFile = req.url.substring(1); // remove / at beginning of filename
    if (requestedFile === '') {
        requestedFile = 'index.html'; // default page if no file requested
    }
    var fullpath = path.join(publicDirectory, requestedFile);
    fs.readFile(fullpath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Oh no! Could not find file');
            res.end();
        }
        else {
            let fileType = path.extname(requestedFile).toLowerCase();
            // Select proper 'Content-Type' without the use of if-else statements
            // Properly serve files with correct 'Content-Type' for the six file types above
            let contentType = contentTypeMap[fileType];
            res.writeHead(200, {'Content-Type': contentType});
            res.write(data);
            res.end();
        }
    });
}

function handlePOST(req, res){
    let postPage = req.url;
    // Add a POST request handler for the url '/sign-up'
    if(postPage === '/sign-up'){
        // Add uploaded data to the 'data/members.json' file
        // do this here
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            let formData = qs.parse(requestBody); // turn form data into object
            /*
            { fname: '',
              lname: '',
              email: '',
              gender: 'Female',
              birthday: '1999-01-01' }
             */

            // change the members json object
            memebersJson[formData['email']] = {
                'fname': formData['fname'],
                'lname': formData['lname'],
                'gender': formData['gender'].substring(0,1),
                'birthday': formData['birthday']
            };
            let writeData = JSON.stringify(memebersJson); // make json object into string
            fs.writeFile(memebersFilePath, writeData, function(err) { // update file
                if(err) {
                    console.log('Could not find or write to members.json');
                    return console.log(err);
                }
                //console.log("members.json updated with the following: ");
                //console.log(writeData);
            });
        });

        // Respond with the contents of the 'join.html' file
        if(joinFileData){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(joinFileData);
            res.end();
        }else{
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Could not find join.html');
            res.end();
        }
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error: post request did not work');
        res.end();
    }
}

function NewRequest(req, res) {
    // Properly differentiate between GET and POST requests
    if(req.method === 'GET'){
        handleGET(req, res);
    }else if(req.method === 'POST'){
        handlePOST(req, res);
    }
}

var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port);
server.listen(port, '0.0.0.0');
