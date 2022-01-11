const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get usename and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join Chat Room
socket.emit("joinChatRoom", { username, room });

// Get Room and Users
socket.on("roomUsers", ({ room, users }) => {
  displayRoomName(room);
  displayRoomUsers(users);
});

// Handle message from server
socket.on("message", (message) => {
  showMessageToDOM(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

const chatForm = document.getElementById("chat-form");

// Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  // Emitting the message to server
  socket.emit("chatMessage", msg);
  // Clear message from input & focus
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Show message to DOM
function showMessageToDOM({ text, username, time }) {
  //   console.log(msg);
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
	<p class="text">${text}</p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}

function displayRoomName(room) {
  roomName.innerHTML = room;
}

function displayRoomUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join()}
    `;
}
