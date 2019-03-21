
var  fs = require("fs"); // file system
var  https = require("https"); // creates an https server
var  path = require("path"); // used for working with url paths

  // used to create response headers
  /* If the user requests a .css file, we want to ensure we attach "text/css" to
  our response header, this way the browser knows how to handle it. */
  mimetypes = {

    "css":"text/css",
    "html":"text/html",
    "ico":"image/ico",
    "jpg":"image/jpeg",
    "js":"text/javascript",
    "json":"application/json",
    "png":"image/png",
    "map":"application/json"

  };

  options = {
   key: fs.readFileSync('app/certs/localhost.key'),
   cert: fs.readFileSync('app/certs/localhost.cert')
  };

  // Start a secure server that uses the credentials in ssl/crt.pfx
  server = https.createServer(options, function(request, response) {

    /* When requesting the homepage of a website, we usually only type
    www.mysite.com, but the server returns www.mysite.com/index.html. To make
    it easier for users to access our site, we add "/index.html" to their url
    so the user doesn't have to type out the whole address of our home page. */

    // If the url is empty
    if (request.url == "" || request.url == "/") {

      // The user is requesting the home page of the website, so give it to them
      request.url = "index.html";

    }

    fs.readFile(__dirname + "/app/" + request.url, function(error, content) {

      if (error) { // if there is an error reading the requested url

        console.log("Error: " + error); // output it to the console

      } else { // else, there is no error, write the file contents to the page

        // 200 is code for OK, and the second parameter is our content header
        console.log("url " + request.url);
        response.writeHead(200, {'Content-Type':mimetypes[path.extname(request.url).split(".")[1]],
                                  'X-Content-Type-Options':'nosniff'});
        response.write(content); // write that content to our response object

      }

      response.end(); // This will send our response object to the browser

    });

  });

  server.listen("443");