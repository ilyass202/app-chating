'use strict'

console.log("main.js chargé");

var usernamePage = document.querySelector("#username-page");
console.log("usernamePage:", usernamePage);
var chatPage = document.querySelector("#chat-page");
console.log("chatPage:", chatPage);
var usernameForm = document.querySelector("#username-form");
console.log("usernameForm:", usernameForm);
var Message = document.querySelector("#message");
console.log("Message input:", Message);
var MessageArea = document.querySelector("#messageArea");
console.log("MessageArea:", MessageArea);
var connecting = document.querySelector(".connecting");
console.log("connecting:", connecting);
var chatForm = document.querySelector("#messageForm");
console.log("chatForm:", chatForm);


// we declare global variables to access them anytime
var stompClient = null;
var username = null;


function connect(event){
    username = document.querySelector("#nom").value.trim();
    console.log("Nom saisi :", username);
    if(username){
        usernamePage.classList.add("hidden");
        chatPage.classList.remove("hidden");
        console.log("Affichage chat-page OK");
        var socket = new SockJS("/ws");
        stompClient = Stomp.over(socket);
        console.log("Tentative de connexion WebSocket");
        stompClient.connect({}, onConnect, onerror);
    } else {
        console.log("Aucun nom saisi, connexion non tentée");
    }
    event.preventDefault();
}
function onConnect(){
    console.log("Connexion WebSocket réussie");
    //we subscribe to the Topic before sending anything
    stompClient.subscribe("/topic/public", onMessagingReiceived);
    console.log("Abonnement à /topic/public effectué");
    //we send to the message to appropriate url 
    stompClient.send("/app/chat/user", {}, JSON.stringify({sender: username, status: 'JOIN'}));
    connecting.classList.add('hidden');
}

function onerror(error){
    console.log("Erreur de connexion WebSocket", error);
    connecting.textContent = "s'il vous plait veuillez refresher la page";
    connecting.style.color = 'red';
}
function onMessagingReiceived(payload){
    console.log("Message reçu:", payload);
    var message = JSON.parse(payload.body)
    var messageElement = document.createElement('li');
    if(message.status === 'JOIN'){
        messageElement.classList.add('event-message');
        message.content = message.sender + ' a entré dans le groupe';
    }else if (message.status ==='LEAVE'){
        messageElement.classList.add('event-message')
        message.content = message.sender + ' a laissé le groupe'
    }else {
        messageElement.classList.add("chat-message")
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        messageElement.appendChild(avatarElement);
        var usernameElement = document.createElement("span");
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }
    var texteElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    texteElement.appendChild(messageText);
    messageElement.appendChild(texteElement);
    MessageArea.appendChild(messageElement);
    MessageArea.scrollTop = MessageArea.scrollHeight;


    
}
function send(event){
    var message = Message.value.trim();
    console.log("Tentative d'envoi de message:", message);
    //get message and Stompconnecting here 
    if(message && stompClient){
        var sending = {
            content : message,
            sender : username,
            type : "CHAT" 
        };
        stompClient.send("/app/chat/Message", {}, JSON.stringify(sending));
        console.log("Message envoyé à /app/chat/Message");


    } else {
        console.log("Message vide ou stompClient non initialisé");
    }
    Message.value = '';
    event.preventDefault();
}


if(usernameForm) {
    usernameForm.addEventListener('submit', connect, true);
    console.log("EventListener ajouté sur usernameForm");
} else {
    console.log("usernameForm introuvable, EventListener non ajouté");
}
if(chatForm) {
    chatForm.addEventListener('submit', send, true);
    console.log("EventListener ajouté sur chatForm");
} else {
    console.log("chatForm introuvable, EventListener non ajouté");
}