const users = [];

// Join User To Chat
const userJoin = ({ id, username, room }) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// Ger Current User
const getCurrentUser = (id) => {
  return users.find((usr) => usr.id === id);
};

// User Leave Chat
const userLeave = (id) => {
  const index = users.findIndex((usr) => usr.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get Room Users
const getRoomUsers = (room) => {
  return users.filter((usr) => usr.room === room);
};

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
