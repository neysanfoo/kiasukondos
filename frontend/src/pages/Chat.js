import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
let socket;

const test_data = [
    {
        "chatId": "1-2",
        "interlocutor": 2,
        "inteculator_name": "User 2",
        "messages": [
            {
                "messageid": 1,
                "sender": 1,
                "receiver": 2,
                "sender_name": "User 1",
                "receiver_name": "User 2",
                "message": "Hello 2",
                "date": "2021-05-01T00:00:00Z",
                "isOffer" : false
            },
            {
                "messageid": 2,
                "sender": 2,
                "receiver": 1,
                "sender_name": "User 2",
                "receiver_name": "User 1",
                "message": "Hello 1",
                "date": "2021-05-01T00:00:00Z",
                "isOffer" : false
            },
        ]
    },
    {
        "chatId": "1-4",
        "interlocutor": 4,
        "inteculator_name": "User 4",
        "messages": [
            {
                "messageid": 3,
                "sender": 1,
                "receiver": 4,
                "sender_name": "User 1",
                "receiver_name": "User 4",
                "message": "Hello 4",
                "date": "2021-05-01T00:00:00Z",
                "isOffer" : false
            },
            {
                "messageid": 4,
                "sender": 4,
                "receiver": 1,
                "sender_name": "User 4",
                "receiver_name": "User 1",
                "message": "Hello 1",
                "date": "2021-05-01T00:00:00Z",
                "isOffer" : false
            },
        ]
    }
]

function Chat() {
    //This will connect your socket connection first time and it will disconnect when the component ejects.
    // This is to prevent multiple connections on the same page
    useEffect(() => {
        socket = io.connect("http://localhost:9000");
  
        return () => {
          socket.disconnect();
        };
    
    }, []);


    const [userId, setUserId] = useState(null);
    const [currentRoom, setCurrentRoom] = useState("");
    const [interlocutorId, setInterlocutorId] = useState(null);
    const [chatData, setChatData] = useState([])
    const [messageData, setMessageData] = useState({
        message: "",
        room: null,
        sender: null,
        interlocutor: null
    });
    const [incomingMessageData, setIncomingMessageData] = useState({})


    // Get the current user Id
    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
            setUserId(response.data.id);
            setMessageData({
                ...messageData,
                sender: response.data.id,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }, []);

    // Get the chat data for the current user
    useEffect(() => {
        if (userId) {
            var config = {
                method: 'get',
                url: 'http://localhost:9000/chats',
                withCredentials: true
            };

            axios(config)
            .then(function (response) {
                // sort messages by time
                response.data.forEach((chat) => {
                    chat.messages.sort((a, b) => {
                        return new Date(a.date) - new Date(b.date);
                    })
                })
                // sort by last_access (newest first)
                response.data.sort((a, b) => {
                    return new Date(b.last_accessed) - new Date(a.last_accessed);
                })

                setChatData(response.data);
                setCurrentRoom(response.data[0].chatId);
                setInterlocutorId(response.data[0].interlocutor);
                setMessageData({
                    ...messageData,
                    room: response.data[0].chatId,
                    interlocutor: response.data[0].interlocutor
                });
                joinChat(response.data[0].interlocutor)
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }, [userId]);

    function sendMessage() {
        socket.emit("message", messageData);
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
           setIncomingMessageData(data.message);
        })

    }, [socket])

    useEffect(() => {
        if (incomingMessageData) {
            // update the messages of chatData with the same ChatId
            const newChatData = chatData.map((chat) => {
                if (chat.chatId === incomingMessageData.chatId) {
                    chat.messages.push(incomingMessageData);
                }
                return chat;
            })
            setChatData(newChatData);
        }
    }, [incomingMessageData])



    function joinChat(interlocutor) {
        setInterlocutorId(interlocutor);
        const chatId = createChatId(userId, interlocutor);
        setCurrentRoom(chatId);
        setMessageData({
            ...messageData,
            room: chatId,
            interlocutor: interlocutor,
            message: ""
        })
        socket.emit("join_room", chatId);
    }

    const createChatId = (user1Id, user2Id) => {
        return [user1Id, user2Id].sort().join('-');
    };

    function convertTime(date) {
        const time = new Date(date);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const hours12 = hours % 12 || 12;
        const minutes0 = minutes < 10 ? '0' : '';
        return `${hours12}:${minutes0}${minutes} ${ampm}`;
    }

    function acceptOffer(offer) {
        axios.post('/api/offer/accept', {
            offerId: offer.id
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    console.log(chatData)

    return (
        <div className='outer--container'>
            <div className='chat--sidebar'>
                <div className='chat--sidebar--header'>
                    <h2>Inbox</h2>
                </div>
                {chatData.map((chat) => {
                    return (
                        <div className='chat--sidebar--users' >
                            {
                                chat.interlocutor === interlocutorId ?
                                <div className='chat--sidebar--user--active'>
                                    <h3>{chat.interlocutor_name}</h3>
                                </div> :
                                <div className='chat--sidebar--user' onClick={()=>joinChat(chat.interlocutor)}>
                                    <h3>{chat.interlocutor_name}</h3>
                                </div>
                            }
                        </div>
                )})}
            </div>
            <div className='chat--main'>
                {chatData.map((chat) => {
                    return (
                    <>
                        {chat.interlocutor === interlocutorId ?  
                        <>
                            <div className='chat--main--header'>
                                <h2>{chat.interlocutor_name}</h2>
                            </div> 
                            <div className='chat--main--messages'>
                            <div className='wrapper--to--start--at--bottom'>
                                {
                                    chat.messages.map((message) => {
                                        return (
                                            message.isOffer ?
                                            // is the current user the one sending or receiving offer?
                                            message.sender.id === userId ?
                                                <>
                                                <div className='chat--main--offer--message'>
                                                    <b>Your have offered ${message.price} for <Link to={"/listing/" + message.listing.id}>{message.listing.title}</Link></b>
                                                </div> 
                                                    <p>{convertTime(message.date)}</p>
                                                    <hr />
                                                 </> :
                                                <>
                                                <div className='chat--main--offer--message'>
                                                    <b>{message.sender.username} has offered you ${message.price} for <Link to={"/listing/" + message.listing.id}>{message.listing.title}</Link></b>
                                                    <button type="button" onClick={()=>acceptOffer(message)}>Accept</button>
                                                </div>
                                                    <p>{convertTime(message.date)}</p>
                                                    <hr />
                                                </> :
                                                <div className='chat--main--message'>
                                                    <h3>{message.sender.username}</h3>
                                                    <p>{message.message}</p>
                                                    <p>{convertTime(message.date)}</p>
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
                    <input type="text" name="body" value={messageData.message} onChange={(e) => setMessageData({
                        ...messageData,
                        message: e.target.value
                    })} />
                    <button type="button" onClick={()=>sendMessage(interlocutorId)}>Send</button>
                </div>
                </>
                )
                })}
            </div>

        </div>
    )
}

export default Chat;