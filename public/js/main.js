const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from URL

const socket = io();



// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {

    // Output the message to DOM
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});


// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // to prevent submitting the form to a file

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();


});


// Output message to DOM


document.getElementById('imageUpload').addEventListener('change', function() {
    var file = this.files[0],
        reader = new FileReader();
    reader.onload = function(e) {
        this.value = '';
        socket.emit('img', e.target.result);
    };
    reader.readAsDataURL(file);
}, false);
  
  
socket.on('newImg', (imgData) => {

    //var profile = new Image();
    //profile.src = imgData.text;

    //console.log(profile);    

    outputImage(imgData);
    //console.log(proImage);

});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

function outputImage(imgData) {
    //profile.setAttribute("height", "400");
    //profile.setAttribute("width", "400");
    
    const div = document.createElement('div');
    div.classList.add('message');

    div.innerHTML = `
        <p class="meta">
            ${imgData.username}
            <span>
            ${imgData.time}
            </span>
        </p>
        <p class="text">
        <img style='display:block; width:400px;height:400px;' id='base64image'
        src='${imgData.text}' />
        </p>
    `;

    //div.appendChild(profile);
    chatMessages.appendChild(div);
}