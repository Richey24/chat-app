
const socket = io("http://localhost:5000");
const left = document.getElementById("left")
const heading = document.getElementById("heading")
const message = document.getElementById("message")
socket.on("connect", ()=> {
    heading.innerHTML = 'you connected with id ' + socket.id
})

socket.on("message", (message)=> {
    const recievedMessage = document.createElement("p")
    recievedMessage.className = 'left'
    recievedMessage.innerHTML = message
    left.appendChild(recievedMessage)
})

function send() {
    socket.emit("newMessage", message.value)
    const yourMessage = document.createElement("p")
    yourMessage.className = 'right'
    yourMessage.innerHTML = message.value
    message.value = ""
    left.appendChild(yourMessage)
}