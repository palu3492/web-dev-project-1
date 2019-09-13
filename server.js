// built-in Node.js modules
var fs = require('fs');
var http = require('http');
var path = require('path');

var port = 8000;
var public_dir = path.join(__dirname, 'public');

// Properly serve files with correct 'Content-Type' for the six file types above
// Select proper 'Content-Type' without the use of if-else statements
// HTML, CSS, JavaScript, JSON, Jpeg, and Png files
let contentTypeMap = {
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

function NewRequest(req, res) {
    // Properly differentiate between GET and POST requests
    if(req.method === 'GET'){
        var filename = req.url.substring(1); // remove / at beginning of filename
        if (filename === '') {
            filename = 'index.html'; // default page if no file requested
        }
        var fullpath = path.join(public_dir, filename);
        fs.readFile(fullpath, (err, data) => {
           if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Oh no! Could not find file');
                res.end();
           }
           else {
               let fileType = path.extname(filename).toLowerCase();
               // Select proper 'Content-Type' without the use of if-else statements
               // Properly serve files with correct 'Content-Type' for the six file types above
               let contentType = contentTypeMap[fileType];
               console.log(fullpath);
               console.log(contentType);
               res.writeHead(200, {'Content-Type': contentType});
               res.write(data);
               res.end();
           }
        });
    }else if(req.method === 'POST'){
    /*
    Add a POST request handler for the url '/sign-up'
    Add uploaded data to the 'data/members.json' file
    Respond with the contents of the 'join.html' file
     */
    }
}

var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port);
server.listen(port, '0.0.0.0');
