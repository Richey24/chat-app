const socket = io("http://localhost:5000");
const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");
const customerList = document.getElementById("customerList");
const customerName = document.getElementById("customerName");
const noti = document.getElementById("noti");

let id = "";

socket.on("connect", () => {
  socket.emit("link", "34847584984");
});

socket.on("message", (messages, secondId) => {
  if (id !== secondId) return;
  const temp = document.createElement("template");
  let mes = messages[messages.length - 1].trim();
  temp.innerHTML = mes;
  if (
    temp.content.firstElementChild.lastElementChild.innerHTML ===
    "Customer service"
  ) {
    temp.content.firstElementChild.lastElementChild.innerHTML = "You";
  }
  left.appendChild(temp.content.firstChild);
  left.lastElementChild.scrollIntoView();
});

socket.on("message1", (messages) => {
  if (messages === null) return;
  messages.map((mes) => {
    const temp = document.createElement("template");
    let mess = mes.trim();
    temp.innerHTML = mess;
    if (
      temp.content.firstElementChild.lastElementChild.innerHTML ===
      "Customer service"
    ) {
      temp.content.firstElementChild.lastElementChild.innerHTML = "You";
    }
    left.appendChild(temp.content.firstChild);
    left.lastElementChild.scrollIntoView();
  });
});

socket.on("noti", (username) => {
  noti.innerHTML = `New message from ${username}`;
});

function send() {
  if (message.value === "") return;

  const recievedMessage = document.createElement("p");
  const yourName = document.createElement("span");
  yourName.className = "yourName";
  yourName.innerHTML = "Customer service";
  const contain = document.createElement("div");
  recievedMessage.innerHTML = message.value;
  recievedMessage.className = "right";
  contain.innerHTML = recievedMessage.outerHTML;
  contain.appendChild(yourName);
  contain.className = "recievedDiv";

  socket.emit("newMessage", contain.outerHTML, id);

  message.value = "";
  noti.innerHTML = "";
}

async function getAllUser() {
  let userId = localStorage.getItem("userId");
  let role = localStorage.getItem("role");

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
  customers.forEach((customer) => {
    let singleCus = document.createElement("li");
    let chat = document.createElement("p");
    chat.id = customer._id;
    singleCus.innerHTML = customer.username;
    chat.innerHTML = "Chat";
    singleCus.appendChild(chat);
    customerList.appendChild(singleCus);
  });

  customers.forEach((single) => {
    let oneUser = document.getElementById(single._id);
    oneUser.addEventListener("click", () => {
      document.getElementById("chatDiv").style.display = "block";
      document.getElementById("chatDiv").scrollIntoView({ behavior: "smooth" });
      left.innerHTML = "";
      customerName.innerHTML = `You are in a chat with ${single.username}`;
      id = single._id;
      socket.emit("join-room", single._id);
      socket.emit("get-message", single._id);
    });
  });
}
