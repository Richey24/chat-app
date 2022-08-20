const socket = io("https://dreamtechchat.herokuapp.com");
const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");
const customerList = document.getElementById("customerList");
const customerName = document.getElementById("customerName");
const noti = document.getElementById("noti");

let id = "";

socket.on("connect", () => {
  socket.emit("link", "34847584984"); // joining a room to be used for displaying notification
});

// handler function for each message recieved
socket.on("message", (messages, secondId) => {
  if (id !== secondId) return; // return if the id sent by the backend is not the user id
  const temp = document.createElement("template");
  let mes = messages[messages.length - 1].trim();
  temp.innerHTML = mes;
  if (
    temp.content.firstElementChild.lastElementChild.innerHTML ===
    "Customer service"
  ) {
    temp.content.firstElementChild.lastElementChild.innerHTML = "You";
    // displaying "You" under a message to indicate the message was sent by you
  }
  left.appendChild(temp.content.firstChild); //appending each message to the chat div
  left.lastElementChild.scrollIntoView();
});

// handler function for the user previous messages
socket.on("message1", (messages) => {
  if (messages === null) return; // return if the user has no previous messages
  // looping through the user previous message
  messages.map((mes) => {
    const temp = document.createElement("template");
    let mess = mes.trim(); //removing whitespace from the message string
    temp.innerHTML = mess;
    if (
      temp.content.firstElementChild.lastElementChild.innerHTML ===
      "Customer service"
    ) {
      temp.content.firstElementChild.lastElementChild.innerHTML = "You";
      // displaying "You" under a message to indicate the message was sent by you
    }
    left.appendChild(temp.content.firstChild);
    left.lastElementChild.scrollIntoView();
  });
});

// notification handler
socket.on("noti", (username) => {
  // displaying the notification to the user
  noti.innerHTML = `New message from ${username}`;
});

// function that handle sending message
function send() {
  if (message.value === "") return; //return if the message input field is empty

  const recievedMessage = document.createElement("p"); // creating a p tag to hold the message
  const yourName = document.createElement("span"); // creating a span tag to hold the sender
  yourName.className = "yourName"; // giving the span tag a class name for styling
  yourName.innerHTML = "Customer service"; // putting the user name in the span tag
  const contain = document.createElement("div"); // creating a div tag to hold both the message p tag and the name span tag
  recievedMessage.innerHTML = message.value; // putting the message in the p tag
  recievedMessage.className = "right"; // giving the message p tag a class name for styling
  contain.innerHTML = recievedMessage.outerHTML; // putting the message p tag in the div tag
  contain.appendChild(yourName); // putting the username span tag in the div tag
  contain.className = "recievedDiv"; // giving the div tag a class name for styling

  socket.emit("newMessage", contain.outerHTML, id); // sending the message to the backend

  message.value = ""; // clearing the input field
  noti.innerHTML = ""; // clearing the notification
}

// get all customers from the database
async function getAllUser() {
  let userId = localStorage.getItem("userId");
  let role = localStorage.getItem("role");

  // redirect to login if the user is not logged in or the logged in user is not an admin
  if (!userId || role !== "Employee") {
    window.location.href =
      "https://brave-ocean-0db6b1310.1.azurestaticapps.net/index.html";
    return;
  }
  let response = await fetch(
    "https://dreamtechhotel.herokuapp.com/user/get/all"
  );
  let users = await response.json();
  let customers = users.user.filter((user) => user.role === "Customer");
  // displaying the UI for the list of user
  customers.forEach((customer) => {
    console.log(customer);
    let singleCus = document.createElement("li");
    let chat = document.createElement("p");
    chat.id = customer._id; // giving each chat button the id of the customer id
    singleCus.innerHTML = customer.name;
    chat.innerHTML = "Chat";
    singleCus.appendChild(chat);
    customerList.appendChild(singleCus);
  });

  customers.forEach((single) => {
    let oneUser = document.getElementById(single._id); // getting each chat button by the id
    oneUser.addEventListener("click", () => {
      document.getElementById("chatDiv").style.display = "block"; // displaying the chat UI
      document.getElementById("chatDiv").scrollIntoView({ behavior: "smooth" });
      left.innerHTML = "";
      customerName.innerHTML = `You are in a chat with ${single.name}`;
      id = single._id;
      socket.emit("join-room", single._id); // joining the room of that user id
      socket.emit("get-message", single._id); // getting all the previous messages
    });
  });
}
