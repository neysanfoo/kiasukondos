import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";


function Chat() {
    const [message, setMessage] = useState("");
    const socket = io("http://localhost:9000");
    const [userId, setUserId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [chatData, setChatData] = useState([])

    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
            setUserId(response.data.id);
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }, []);

    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:9000/messages',
            withCredentials: true
        };

        axios(config)
        .then(function (response) {
            // Create an array of {chatId,sender,receiver,messages}
            let chatList = [];
            response.data.messages.forEach((message) => {
                let chatId = createChatId(message.sender, message.receiver);
                let chat = chatList.find((chat) => chat.chatId === chatId);
                if (chat) {
                    chat.messages.push({message: message.message,
                            sender_name: message.sender_name,
                            sender: message.sender,
                            receiver: message.receiver,
                            timestamp: message.date});
                } else {
                    chatList.push({
                        chatId: chatId,
                        receiver: message.sender === userId ? message.receiver : message.sender,
                        receiver_name: message.sender === userId ? message.receiver_name : message.sender_name,
                        messages: [{message: message.message,
                            sender_name: message.sender_name,
                            sender: message.sender,
                            receiver: message.receiver,
                            timestamp: message.date}]
                    })
                }
            }
            )
            // sort the messages by time
            chatList.forEach((chat) => {
                chat.messages.sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                })
            })
            setChatData(chatList)
        })
        .catch(function (error) {
            console.log(error);
        });
    }, [userId]);


    const createChatId = (user1Id, user2Id) => {
        return [user1Id, user2Id].sort().join('-');
    };


    function joinChat (receiverId) {
        setReceiverId(receiverId)
        // create a room with chatId
        const chatId = createChatId(userId, receiverId);
        socket.emit("join", chatId);
    }

    function getCurrentTime() {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return time;
    }

    function sendMessage (receiverId) {
        const chatId = createChatId(userId, receiverId);
        socket.emit("message", {
            chatId: chatId,
            sender: userId,
            receiver: receiverId,
            body: message,
        })
        setMessage("")
    }

    useEffect(() => {
        socket.on("message", (message) => {
            let chatList = [];
            message.messages.forEach((message) => {
                let chatId = createChatId(message.sender, message.receiver);
                let chat = chatList.find((chat) => chat.chatId === chatId);
                if (chat) {
                    chat.messages.push({message: message.message,
                            sender_name: message.sender_name,
                            sender: message.sender,
                            receiver: message.receiver,
                            timestamp: message.date});
                } else {
                    chatList.push({
                        chatId: chatId,
                        receiver: message.sender === userId ? message.receiver : message.sender,
                        receiver_name: message.sender === userId ? message.receiver_name : message.sender_name,
                        messages: [{message: message.message,
                            sender_name: message.sender_name,
                            sender: message.sender,
                            receiver: message.receiver,
                            timestamp: message.date}]
                    })
                }
            }
            )
            // sort the messages by time
            chatList.forEach((chat) => {
                chat.messages.sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                })
            })
            // add the other lists from chataData to chatList with different chatId
            chatData.forEach((chat) => {
                if (chat.chatId !== message.chatId) {
                    chatList.push(chat)
                }
            }
            )
            setChatData(chatList)



        }
        )
    }, [chatData]);



    return (
        <div className='outer--container'>
            <div className='chat--sidebar'>
                <div className='chat--sidebar--header'>
                    <h2>Inbox</h2>
                </div>
                {chatData.map((chat) => {
                    return (
                        <div className='chat--sidebar--users' >
                            <div className='chat--sidebar--user' onClick={()=>joinChat(chat.receiver)}>
                                <h3>{chat.receiver_name}</h3>
                            </div>
                        </div>
                )})}
            </div>
            <div className='chat--main'>
                {chatData.map((chat) => {
                    return (
                    <>
                        {chat.receiver === receiverId ?  
                        <>
                        <div className='chat--main--header'>
                            <h2>{chat.receiver_name}</h2>
                        </div> 
                        <div className='chat--main--messages'>
                        <div className='wrapper--to--start--at--bottom'>
                            {
                                chat.messages.map((message) => {
                                    return (
                                        <div className='chat--main--message'>
                                            <h3>{message.sender_name}</h3>
                                            <p>{message.message}</p>
                                            <p>{message.timestamp}</p>
                                            <hr />
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                        </div>
                        </>
                : null}
                <div className='chat--main--input'>
                    <input type="text" name="body" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button type="button" onClick={()=>sendMessage(receiverId)}>Send</button>
                </div>
                </>
                )
                })}
            </div>

        </div>
    )
}

export default Chat;