// const express = require('express')
// const mongoose = require('mongoose')
// const morgan = require('morgan')
// const bodyParser = require('body-parser')
// const db = mongoose.connection
// const session  = require('express-session');
// const WebSocket = require('websocket').server;

// mongoose.connect('mongodb://0.0.0.0:27017/chatdb', {useNewUrlParser: true , useUnifiedTopology : true})
// const wsServer = new WebSocket({
//     httpServer: app
// });

// db.on('error' , (err) =>{
//     console.log(err)
// })
// db.once('open' , () => {
//     console.log('Database Connected!')
// })

// const app = express()

// app.use(morgan('dev'))
// app.use(express.urlencoded({extended:true}))
// app.use(express.json())
// app.use(express.json());
// //session implementation
// app.use(session({
//     secret: 'temppassword',
//     resave: false,
//     saveUninitialized: true
// }));
// //session typed

// const PORT = process.env.PORT || 3000

// app.get('/', function(request, response){
//     response.sendFile(__dirname + "/index.html");
// });

// app.get('/loginpage', function(request, response){
//     response.sendFile(__dirname + "/route/loginpage.html");
// });

//   app.listen(PORT , () =>{
//     console.log('Server is running on port ${PORT}')
// })

// app.post('/login', (req, res) => {
//     const name = req.body.name;
//     if (!name) {
//       res.status(400).send('Name is required');
//       return;
//     }
    
//     req.session.myData = name;
//     console.log('data saved in session')
//     const collection = db.collection('users');
//     collection.insertOne({ name }, (err, result) => {
//       if (err) {
//         res.status(500).send('Error saving name to the database');
//         return;
//       }
//       res.sendFile(__dirname + "/route/chatpage.html");
//     });
//   });


// //session code 
// app.get('/getsessionData', (req, res) => {
//     const name = req.session.myData || 'No data available';
//     res.send(name);
//   });

const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schema and model for messages
const messageSchema = new mongoose.Schema({
  username: String,
  content: String,
});
const Message = mongoose.model('Message', messageSchema);

// Serve static files
app.use(express.static('public'));

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Handle incoming messages from clients
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    // Save the message to MongoDB
    const newMessage = new Message({
      username: message.username,
      content: message.content,
    });
    newMessage.save();
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
});

// Start the server
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
