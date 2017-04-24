// Third-party dependencies.
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var sendHttpRequest = require('request');

// Load environment variables.
// Notify the developer if API credentials can't be found.
var dotenv = require('dotenv').config();
if (dotenv.parsed.SLACK_CLIENT_ID === '' || process.env.SLACK_CLIENT_ID === undefined) {
  console.error('SLACK_CLIENT_ID is not set')
}
if (dotenv.parsed.SLACK_CLIENT_SECRET === '' || process.env.SLACK_CLIENT_SECRET === undefined) {
  console.error('SLACK_CLIENT_SECRET is not set')
}

// Load quote data into memory.
var data = require('./quotes.json');

// Initialize new Express application.
var app = express();

// Attach json data (if present) to request body.
app.use(bodyParser.json());

// Attach URL query parameters (if present) to request body.
app.use(bodyParser.urlencoded({ extended: true }));

// Construct OAuth handshake URL with API credentials.
var hostAuthUrl = encodeURIComponent(path.resolve(process.env.HOST_URL, 'auth'));
var baseUrl = 'https://slack.com/api/oauth.access'
  + '?client_id=' + process.env.SLACK_CLIENT_ID
  + '&client_secret=' + process.env.SLACK_CLIENT_SECRET
  + '&redirect_uri=' + hostAuthUrl;

// handleAuthResponse returns a function with a reference to an HTTP response
//   object. It sends an appropriate response based on error parameter.
// In: Server response.
// Out: Request handler closure.
function handleAuthResponse(response) {
  // In: HTTP request error or null if okay.
  // In: Request result.
  return function(error, result) {  
    if (error !== null) {
      response.send('Error, please try again.')
    } else {
      // Access token can be used to identify the team ID if the scope was set.
      var _ = result.body.access_token;
      response.send('Pengo mvp added.')
    }
  }
}

// OAuth handshake route endpoint. Makes a request to Slack's API oauth.access,
// which returns without error if the authentication code is correct.
// Our front webpage does not use this. Instead, clicking "Add to Slack"
// sends Slack a permission request that redirects the user to this endpoint.
// This needs to be added to the app's settings at https://api.slack.com/apps
app.get('/auth', function(request, response) {
  // Require an OAuth handshake code to continue.
  if (request.query.code === undefined) {
  	return response.redirect('/');
  }
  // Attach the OAuth handshake code to base API URL.
  var authUrl = baseUrl + '&code=' + request.query.code;
  // request lib signature: .get([urlstring], [function callback(error, result){}])
  sendHttpRequest.get(authUrl, handleAuthResponse(response));
});

// Bind application to the environment's port and log to console.
var port = process.env.PORT || 3750;
app.listen(port, function() {
  console.log('listening on', port);
});
