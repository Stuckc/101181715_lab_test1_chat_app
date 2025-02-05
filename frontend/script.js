const socket = io("http://localhost:5000");

let userToken = null;
let username = "";

// Login Function
function login() {
    const user = $("#username").val();
    const pass = $("#password").val();

    $.post("http://localhost:5000/auth/login", { username: user, password: pass })
        .done((data) => {
            userToken = data.token;
            username = data.user.username;
            $("#auth-section").hide();
            $("#chat-section").show();
            $("#user-name").text(username);
            loadMessages();
        })
        .fail((err) => {
            $("#auth-message").text(err.responseJSON.message || "Login failed.");
        });
}

// Signup Function
function register() {
    const user = $("#username").val();
    const pass = $("#password").val();

    $.post("http://localhost:5000/auth/signup", { username: user, password: pass })
        .done(() => {
            $("#auth-message").text("User registered! Please login.").css("color", "green");
        })
        .fail((err) => {
            $("#auth-message").text(err.responseJSON.message || "Signup failed.");
        });
}

// Send Message
function sendMessage() {
    const text = $("#message").val();
    if (!text) return;

    const messageData = { sender: username, text };
    socket.emit("sendMessage", messageData);

    $.post("http://localhost:5000/chat/send", messageData)
        .done(() => $("#message").val(""));
}

// Receive Messages in Real-Time
socket.on("receiveMessage", (message) => {
    displayMessage(message);
});

// Load Messages from DB
function loadMessages() {
    $.get("http://localhost:5000/chat/messages")
        .done((messages) => {
            $("#chat-box").html("");
            messages.forEach((msg) => displayMessage(msg));
        });
}

// Display Message in Chat
function displayMessage(msg) {
    const cssClass = msg.sender === username ? "sender" : "receiver";
    $("#chat-box").append(`<div class="message ${cssClass}"><strong>${msg.sender}:</strong> ${msg.text}</div>`);
}

// Logout
function logout() {
    userToken = null;
    username = "";
    $("#auth-section").show();
    $("#chat-section").hide();
}
