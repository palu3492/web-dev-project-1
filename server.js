// built-in Node.js modules
var fs = require('fs');
var http = require('http');
var path = require('path');
var qs = require('querystring');

var port = 8000;
var publicDirectory = path.join(__dirname, 'public');

// load in members.json when starting server so it can be changed when a member signs up
let memebersFilePath = path.join(publicDirectory, 'data/members.json');
let memebersJson;
fs.readFile(memebersFilePath, (err, data) => { // read data from members.json
    if (err) {
        console.log('Could not read or find members.json');
        return console.log(err);
    }else {
        let membersFileContents = data.toString(); // get data from file and make string
        memebersJson = JSON.parse(membersFileContents); // turn data into object
    }
});

// load in join.html when starting server
let joinFilePath = path.join(publicDirectory, 'join.html');
let joinFileData;
fs.readFile(joinFilePath, (err, data) => {
    if(err){
        console.log('Could not read or find join.html');
        return console.log(err);
    }else{
        joinFileData = data;
    }
});

// Properly serve files with correct 'Content-Type' for the six file types above
// Select proper 'Content-Type' without the use of if-else statements - i'm using a object so if-else aren't needed
// HTML, CSS, JavaScript, JSON, Jpeg, and Png files - jpg too since that's what the images actually are
const contentTypeMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpeg': 'image/jpg',
    '.jpg': 'image/jpg',
    '.png': 'image/png',
};

// This function handles the incoming GET requests and returns the proper file or error to the client
function handleGET(req, res){
    var requestedFile = req.url.substring(1); // remove / at beginning of filename
    if (requestedFile === '') {
        requestedFile = 'index.html'; // default page if no file requested
    }
    var fullpath = path.join(publicDirectory, requestedFile);
    fs.readFile(fullpath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Error: ' + requestedFile + 'could not be found');
            res.end();
        }
        else {
            let fileType = path.extname(requestedFile).toLowerCase();
            // Properly serve files with correct 'Content-Type' for the six file types above
            // Select proper 'Content-Type' without the use of if-else statements
            if (fileType in contentTypeMap) {
                let contentType = contentTypeMap[fileType];
                res.writeHead(200, {'Content-Type': contentType});
                res.write(data);
            }else{
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Error: ' + fileType + ' is an unsupported file type');
            }
            res.end();
        }
    });
}

function updateMembersJson(postRequestData){
    let signupFormData = qs.parse(postRequestData); // turn form data into object
    /*
    { fname: '',
      lname: '',
      email: '',
      gender: 'Female',
      birthday: '1999-01-01' }
     */

    // change the members object
    // not reading members.json here to avoid race condition
    memebersJson[signupFormData['email']] = {
        'fname': signupFormData['fname'], // last name
        'lname': signupFormData['lname'], // first name
        'gender': signupFormData['gender'].substring(0,1), // first letter of gender
        'birthday': signupFormData['birthday']
    };
    let writeData = JSON.stringify(memebersJson, null, "\t")+'\n'; // make members object into json string
    fs.writeFile(memebersFilePath, writeData, (err) => { // update file
        if(err) {
            console.log('Could not find or write to members.json');
            return console.log(err);
        }
    });
}

// This function handles the incoming POST requests and returns the proper file or error to the client
// It also reads the incoming POST data form the sign-up form and puts it into the members.json 'database'
// Might want to break this into functions (too big)
function handlePOST(req, res){
    let postPage = req.url;
    // Add a POST request handler for the url '/sign-up'
    if(postPage === '/sign-up'){
        // Add uploaded data to the 'data/members.json' file
        // do this here
        let postRequestData = '';
        req.on('data', chunk => {
            postRequestData += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            updateMembersJson(postRequestData)
        });

        // Respond with the contents of the 'join.html' file
        // this file is already read in when server starts
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
        res.write('Error: server cannot handle post request to ' + req.url);
        res.end();
    }
}

// Function determines the type of request and calls the correct function to handle that request
// req: request object coming from client, res: response object to return responses to the client
function NewRequest(req, res) {
    // Properly differentiate between GET and POST requests
    if(req.method === 'GET'){
        handleGET(req, res);
    }else if(req.method === 'POST'){
        handlePOST(req, res);
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error: ' + req.method + ' is an unsupported request method');
        res.end();
    }
}

// holds the created server and passes a callback to handle incoming requests
var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port); // this is the port clients connect to. ip: localhost (0.0.0.0)
server.listen(port, '0.0.0.0');
