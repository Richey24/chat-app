const socket = io("https://dreamtechchat.herokuapp.com", {
  autoConnect: false,
}); //disabling auto connection to the backend

const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");
const customerList = document.getElementById("customerList");
const customerName = document.getElementById("customerName");

const myForm = document.getElementById("form");
myForm !== null && (myForm.onsubmit = submit);

// event handler for login
async function submit(event) {
  event.preventDefault();
  const user = {
    username: event.target.username.value,
    password: event.target.password.value,
  };
  const rep = await fetch("https://dreamtechhotel.herokuapp.com/user/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const res = await rep.json();
  localStorage.setItem("userId", res._id);
  localStorage.setItem("username", res.username);
  localStorage.setItem("role", res.role);
  // redirecting user to different page based on their role
  if (res.role === "Customer") {
    window.location.href =
      "https://brave-ocean-0db6b1310.1.azurestaticapps.net/customer.html";
  } else {
    window.location.href =
      "https://brave-ocean-0db6b1310.1.azurestaticapps.net/admin.html";
  }
  console.log(res);
}

// customer page load handler function
function connect() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href =
      "https://brave-ocean-0db6b1310.1.azurestaticapps.net/index.html";
  } //redirecting user to login page if they are not logged in
  socket.connect(); //connecting the socket to the backend
}

// login page load handler function
function check() {
  let userId = localStorage.getItem("userId");
  let role = localStorage.getItem("role");
  // redirecting user to their respective page if they are logged in
  if (userId) {
    role === "Customer" &&
      (window.location.href =
        "https://brave-ocean-0db6b1310.1.azurestaticapps.net/customer.html");
    role === "Employee" &&
      (window.location.href =
        "https://brave-ocean-0db6b1310.1.azurestaticapps.net/admin.html");
  }
}

// function that runs when the socket connect to the backend
socket.on("connect", () => {
  let userId = localStorage.getItem("userId");
  let username = localStorage.getItem("username");
  socket.emit("join-room", userId); //joining a room with the user id
  socket.emit("get-message", userId); // getting the user previous messages if any
  socket.emit("link", "34847584984"); // joining a room to be used for displaying notification
  heading.innerHTML = `Welcome ${username} to the best hotel in the city, Feel free to request for any services`; // displaying a welcome message to the user
});

// handler function for the user previous messages
socket.on("message1", (messages) => {
  let username = localStorage.getItem("username");
  if (messages === null) return; // return if the user has no previous messages
  // looping through the user previous message
  messages.map((mes) => {
    const temp = document.createElement("template");
    let mess = mes.trim(); //removing whitespace from the message string
    temp.innerHTML = mess;
    if (
      temp.content.firstElementChild.lastElementChild.innerHTML === username
    ) {
      temp.content.firstElementChild.lastElementChild.innerHTML = "You";
      // displaying "You" under a message to indicate the message was sent by you
    }
    left.appendChild(temp.content.firstChild); //appending each message to the chat div
    left.lastElementChild.scrollIntoView();
  });
});

// handler function for each message recieved
socket.on("message", (messages) => {
  let username = localStorage.getItem("username");
  const temp = document.createElement("template");
  // getting the message from the array of message and removing whitespace
  let mes = messages[messages.length - 1].trim();
  temp.innerHTML = mes;

  if (temp.content.firstElementChild.lastElementChild.innerHTML === username) {
    temp.content.firstElementChild.lastElementChild.innerHTML = "You";
    // displaying "You" under a message to indicate the message was sent by you
  }
  left.appendChild(temp.content.firstChild); //appending each message to the chat div
  left.lastElementChild.scrollIntoView();
});

// function that handle sending message
function send() {
  if (message.value === "") return; //return if the message input field is empty
  let userId = localStorage.getItem("userId");
  let username = localStorage.getItem("username");
  const recievedMessage = document.createElement("p"); // creating a p tag to hold the message
  const yourName = document.createElement("span"); // creating a span tag to hold the sender name
  yourName.className = "yourName"; // giving the span tag a class name for styling
  yourName.innerHTML = username; // putting the user name in the span tag
  const contain = document.createElement("div"); // creating a div tag to hold both the message p tag and the name span tag
  recievedMessage.innerHTML = message.value; // putting the message in the p tag
  recievedMessage.className = "right"; // giving the message p tag a class name for styling
  contain.innerHTML = recievedMessage.outerHTML; // putting the message p tag in the div tag
  contain.appendChild(yourName); // putting the username span tag in the div tag
  contain.className = "recievedDiv"; // giving the div tag a class name for styling
  socket.emit("newMessage", contain.outerHTML, userId); // sending the message to the backend
  socket.emit("noti", "34847584984", username); // sending notification
  message.value = ""; // clearing the input field
}
