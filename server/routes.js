/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var user = require('./api/user/user.js');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  
  app.use('/api/user', function(request,response){
    switch(request.body.type)
    {
      case 'register':
        user.registerUser(request,response);
      break;

      case 'login':
        user.authUser(request,response);
      break;

      case 'adminLogin':
        user.authAdminUser(request,response);
      break;      

      case 'checkSession':
        user.checkSession(request,response);
      break;            

      case 'getUserLocationDetails':
        user.getUserLocationDetails(request, response);
      break;
    }
    
  });
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
