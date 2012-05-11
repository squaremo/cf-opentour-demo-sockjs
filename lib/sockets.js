var sockjs = require('sockjs');

var sockets = [];

function addConnection(connection) {
    sockets.push(connection);
    connection.on('close', function() {
        var i = sockets.indexOf(connection);
        if (i > -1) {
            sockets.splice(i);
        }
    });
}

function broadcast(msg) {
    for (var i = 0, len = sockets.length; i < len; i++) {
        sockets[i].write(msg);
    }
}

module.exports = function(app, sessionStore) {
    var socksrv = sockjs.createServer({'prefix': '/socks'});
    socksrv.installHandlers(app);

    socksrv.on('connection', function(connection) {
        function authenticate(sessionId) {
            connection.removeListener('data', authenticate);
	    sessionStore.get(sessionId, function (err, session) {
	        if (err || !session) {
	            // if we cannot grab a session, turn down the connection
                    console.log("No session for session ID " + sessionId);
	            connection.close(500, 'Authentication error');
	        } else {
                    addConnection(connection);
                    connectToChat(connection, session.user);
	        }
            });
        }
        connection.on('data', authenticate);
    });

    function connectToChat(socket, user) {
        socket.on('data', function(data) {
	    broadcast(user + ": " + data);
        });
	broadcast("SYSTEM: '" + user + "' just joined the chat");
    };
}
