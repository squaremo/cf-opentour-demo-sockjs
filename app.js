var express = require('express');

var host = process.env.VCAP_APP_HOST || "localhost";
var port = process.env.VCAP_APP_PORT || "3000";

var app = module.exports = express.createServer();

//load express configurations
var expressConfig = require('./lib/express_config');
expressConfig.configure(app);

//load routes (after configurations)
var routes  = require('./lib/routes');
routes(app);

app.listen(port, host);

var socks = require("./lib/sockets");


//Pass app and also sessionStore from expressConfig so we can get hold
//of sessions to authenticate
socks(app, expressConfig.sessionStore);
