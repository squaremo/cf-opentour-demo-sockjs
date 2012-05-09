var socket = new SockJS('/socks');

// on connection to server, ask for user's name with an anonymous callback
socket.onopen = function() {
    console.log("client connected");
    var maybeCookie = /jsessionid=(.*)/.exec(document.cookie);
    if (maybeCookie) {
        socket.send(unescape(maybeCookie[1]));
    }
};

socket.onmessage = function (msg) {
    $("#chatList").append(getList(msg.data));
};

socket.onclose = function () {
    console.log("disconnected");
};

function sendchat() {
    var message = $('#chatField').val();
    $('#chatField').val('');
    // tell server to execute 'sendchat' and send along one parameter
    socket.send(message);
    return false;
}
function getList(data) {
	data = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return "<li class='form-search'>" + data +  '</li>';
}

// on load of page
$(function() {
    // when the client clicks SEND
    $('#form-send').submit(sendchat);
    $('#chatField').focus();
});
