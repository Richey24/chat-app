const socket = io("http://localhost:5000");
const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");
const customerList = document.getElementById("customerList");
const customerName = document.getElementById("customerName");
const noti = document.getElementById("noti");

socket.on("connect", () => {
  socket.emit("link", "34847584984");
});

socket.on("message", (message) => {
  console.log(message);
  const recievedMessage = document.createElement("p");
  const container = document.createElement("div");
  console.log(message);
  recievedMessage.innerHTML = message;
  recievedMessage.className = "left";
  container.innerHTML = recievedMessage.outerHTML;
  container.className = "recievedDiv";
  if (left.lastElementChild?.className === "recievedDiv") {
    left.lastElementChild.appendChild(recievedMessage);
    left.lastElementChild.scrollIntoView();
    return;
  }
  left.appendChild(container);
  left.lastElementChild.scrollIntoView();
});

socket.on("noti", (username) => {
  noti.innerHTML = `New message from ${username}`;
});

function send() {
  if (message.value === "") return;
  let userId = localStorage.getItem("userId");
  socket.emit("newMessage", message.value, userId);
  const yourMessage = document.createElement("p");
  const container = document.createElement("div");
  yourMessage.innerHTML = message.value;
  yourMessage.className = "right";
  container.innerHTML = yourMessage.outerHTML;
  container.className = "sendDiv";
  if (left.lastElementChild?.className === "sendDiv") {
    left.lastElementChild.appendChild(yourMessage);
    message.value = "";
    left.lastElementChild.scrollIntoView();
    return;
  }
  message.value = "";
  left.appendChild(container);
  left.lastElementChild.scrollIntoView();
  noti.innerHTML = "";
}

async function getAllUser() {
  let response = await fetch(
    "https://dreamtechhotel.herokuapp.com/user/get/all"
  );
  let users = await response.json();
  let customers = users.user.filter((user) => user.role === "1");
  users.user.forEach((customer) => {
    let singleCus = document.createElement("li");
    let chat = document.createElement("p");
    chat.id = customer._id;
    singleCus.innerHTML = customer.username;
    chat.innerHTML = "Chat";
    singleCus.appendChild(chat);
    customerList.appendChild(singleCus);
  });
  users.user.forEach((single) => {
    let oneUser = document.getElementById(single._id);
    oneUser.addEventListener("click", () => {
      customerName.innerHTML = `You are in a chat with ${single.username}`;
      socket.emit("join-room", single._id);
      socket.emit("get-message", "34847584984", single._id);
      console.log(`you clicked on user ${single._id}`);
    });
  });
}
