const socket = io("http://localhost:5000");
const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");
socket.on("connect", () => {
  heading.innerHTML = "you connected with id " + socket.id;
});

socket.on("message", (message) => {
  const recievedMessage = document.createElement("p");
  const breakLine = document.createElement("br");
  recievedMessage.className = "left";
  recievedMessage.innerHTML = message;
  if (left.lastElementChild?.className === "left") {
    left.lastElementChild.innerHTML = left.lastElementChild.innerHTML + breakLine.outerHTML + message;
    return;
  }
  left.appendChild(recievedMessage);
});

function send() {
  socket.emit("newMessage", message.value);
  const yourMessage = document.createElement("p");
  const breakLine = document.createElement("br");
  yourMessage.className = "right";
  yourMessage.innerHTML = message.value;
  if (left.lastElementChild?.className === "right") {
    left.lastElementChild.innerHTML =
      left.lastElementChild.innerHTML + breakLine.outerHTML + message.value;
    message.value = "";
    return;
  }
  message.value = "";
  left.appendChild(yourMessage);
}
