const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const socketIO = require("socket.io");
const axios = require("axios");
const { off } = require("process");
require('dotenv').config();

const port = 9000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log("HELLO")
console.log(process.env.BACKEND_URL)
console.log(backendUrl)

const corsOptions = {
  origin: frontendUrl,
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


app.get("/chats", (req, res) => {
  // Get the jwt 
  const cookies = parseCookies(req);
  const jwt = cookies.jwt;
  var config = {
    method: 'post',
    url: `${backendUrl}/api/fetch-chats-of-user/`,
    headers: {
      'Content-Type': 'application/json', 
    },
    data: {
      'jwt': jwt
    },
    withCredentials: true
  };

  axios(config)
  .then(function (response) {
        let modifiedChatData = []
        const current_user = response.data.user.id
        response.data.chats.forEach(chat => {
          let interlocutor = chat.users.filter(user => user.id !== current_user)[0]

          chat.offers.forEach(offer => {
            let offer_message = {
              id: offer.id,
              chatId: offer.chatId,
              sender: offer.user,
              receiver: offer.listing.owner,
              price: offer.price,
              listing: offer.listing,
              date: offer.date,
              isOffer: true,
              is_accepted: offer.is_accepted,
              buyer_left_review: offer.buyer_left_review,
              seller_left_review: offer.seller_left_review
            }
            chat.messages.push(offer_message)
          })
            
          let modifiedChat = {
            chatId: chat.chatId,
            interlocutor: interlocutor.id,
            interlocutor_name: interlocutor.username,
            last_accessed: chat.lastAccessed,
            messages: chat.messages,
            offers: chat.offers
          }
          modifiedChatData.push(modifiedChat)
        })
        console.log(modifiedChatData)
        res.status(200).send(modifiedChatData);
  }).catch(function (error) {
    console.log(error);
  });
})
io.on("connection", (socket) => {

  console.log(`User connected ${socket.id}`);

  socket.on("test_message", (data) => {
      console.log(data);
      socket.broadcast.emit("receive_message", data)
  })

  socket.on("message", (data) => {
    console.log(data);
    // Send the message to the django backend
    var config = {
      method: 'post',
      url: `${backendUrl}/api/add-message/`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        'chatId': data.room,
        'sender': data.sender,
        'receiver': data.interlocutor,
        'message': data.message,
      }
    }
    axios(config)
    .then(
      function (response) {
        io.emit("receive_message", response.data);
        console.log(response.data);
      }
    ).catch(function (error) {
      console.log(error);
    });
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
  })
})

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

