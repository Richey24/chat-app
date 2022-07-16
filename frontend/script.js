const socket = io("http://localhost:5000", { autoConnect: false });
const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");
const customerList = document.getElementById("customerList");
const customerName = document.getElementById("customerName");

const myForm = document.getElementById("form");
myForm !== null && (myForm.onsubmit = submit);

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
  if (res.role === "Customer") {
    window.location.href = "http://127.0.0.1:5500/frontend/customer.html";
  } else {
    window.location.href = "http://127.0.0.1:5500/frontend/admin.html";
  }
  console.log(res);
}

function connect() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "http://127.0.0.1:5500/frontend/index.html";
  }
  socket.connect();
}

function check() {
  let userId = localStorage.getItem("userId");
  let role = localStorage.getItem("role");
  if (userId) {
    role === "Customer" &&
      (window.location.href = "http://127.0.0.1:5500/frontend/customer.html");
    role === "Employee" &&
      (window.location.href = "http://127.0.0.1:5500/frontend/admin.html");
  }
}

socket.on("connect", () => {
  let userId = localStorage.getItem("userId");
  let username = localStorage.getItem("username");
  socket.emit("join-room", userId);
  socket.emit("get-message", userId);
  socket.emit("link", "34847584984");
  heading.innerHTML = `Welcome ${username} to the best hotel in the city, Feel free to request for any services`;
});

socket.on("message1", (messages) => {
  let username = localStorage.getItem("username");
  if (messages === null) return;
  messages.map((mes) => {
    const temp = document.createElement("template");
    let mess = mes.trim();
    temp.innerHTML = mess;
    if (
      temp.content.firstElementChild.lastElementChild.innerHTML === username
    ) {
      temp.content.firstElementChild.lastElementChild.innerHTML = "You";
    }
    left.appendChild(temp.content.firstChild);
    left.lastElementChild.scrollIntoView();
  });
});

socket.on("message", (messages) => {
  let username = localStorage.getItem("username");
  const temp = document.createElement("template");
  let mes = messages[messages.length - 1].trim();
  temp.innerHTML = mes;

  if (temp.content.firstElementChild.lastElementChild.innerHTML === username) {
    temp.content.firstElementChild.lastElementChild.innerHTML = "You";
  }
  left.appendChild(temp.content.firstChild);
  left.lastElementChild.scrollIntoView();
});

function send() {
  if (message.value === "") return;
  let userId = localStorage.getItem("userId");
  let username = localStorage.getItem("username");
  const recievedMessage = document.createElement("p");
  const yourName = document.createElement("span");
  yourName.className = "yourName";
  yourName.innerHTML = username;
  const contain = document.createElement("div");
  recievedMessage.innerHTML = message.value;
  recievedMessage.className = "right";
  contain.innerHTML = recievedMessage.outerHTML;
  contain.appendChild(yourName);
  contain.className = "recievedDiv";
  socket.emit("newMessage", contain.outerHTML, userId);
  socket.emit("noti", "34847584984", username);
  message.value = "";
}
