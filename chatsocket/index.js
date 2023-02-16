const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const socketIO = require("socket.io");
const axios = require("axios")

const port = 9000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,

}
app.use(cors(corsOptions));


app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());


function parseCookies (request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function(cookie) {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
  });

  return list;
}

app.get("/messages", (req, res) => {
  // Get the jwt 
  const cookies = parseCookies(req);
  const jwt = cookies.jwt;
  var config = {
    method: 'post',
    url: 'http://localhost:8000/api/messages/',
    headers: {
      'Content-Type': 'application/json', 
    },
    data: {
      'jwt': jwt
    }
  };

  axios(config)
  .then(function (response) {
        res.status(200).send(response.data);
  }).catch(function (error) {
    console.log(error);
  });
});




app.post("/server", (req, res) => {
  io.emit("command", req.body);
  console.log(req.body)
  res.status(201).json({ status: "reached" });
});

io.on("connection", (socket) => {
  console.log('a user connected');

  socket.on("join", function (room) {
    console.log("user joined " + room);
    socket.join(room);
  })


  socket.on("message", function (data) {
    // save the message in the django backend
    var config = {
      method: 'post',
      url: 'http://localhost:8000/api/add_message/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        'sender': data.sender,
        'receiver': data.receiver,
        'message': data.body,
      }
    };
    axios(config)
    .then(
      function (response) {
        response.data.chatId = data.chatId;
        io.to(data.chatId).emit("message", response.data);
      }
    ).catch(function (error) {
      console.log(error);
    }
    );
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

