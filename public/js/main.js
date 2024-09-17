const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const myUserName = document.getElementById('user-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('setMyUser', (myUserName => outputMyUserName(myUserName)));

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
      return false;
    }
  
    socket.emit('chatMessage', msg);
  
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');
    
    div.classList.add(message.isAdmin ? 'message-admin' : 'message');
    
    div.innerHTML = message.isAdmin 
        ?  `<p class="text">${message.text}</p>`
        : `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputMyUserName(user) {
    myUserName.innerText = user;
}
  
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}