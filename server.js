//importing requiried packages to our application
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const mongoDbStore = require('connect-mongodb-session')(session);

//mongo db URI to connect to DB
const MONGO_URI = 'mongodb+srv://luki:I0vfrJMk44hqhfLC@cluster0.iqybe.mongodb.net/chat?retryWrites=true&w=majority';

//importing application routes
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');

//importing application controllers
const errorController = require('./controllers/error');

// initialization the server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//storing the sessions in the DB
const store = new mongoDbStore ({
    uri:MONGO_URI,
    collection:'sessions'
});

//defining the static folder
app.use(express.static(path.join(__dirname, 'public')));

//using ejs as template engine
app.set('view engine', 'ejs');

//using flash to send flash messages
app.use(flash());

//encoding parameters values
app.use(bodyParser.urlencoded({extended: false}));


app.set('socketio', io);

//using session middleware for storing user sessions
app.use(session({
    secret:'keyboard rat',
    resave: false,
    saveUninitialized:false,
    store:store
}))

//application routes
app.use(authRoutes);

app.use(publicRoutes);

app.use(chatRoutes);

app.use(errorController.get404);


const PORT = 3000 || process.env.PORT;

//DB connection
mongoose
.connect(MONGO_URI)
.then(() => {
    console.log('connected successfully');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.log(err);
});

