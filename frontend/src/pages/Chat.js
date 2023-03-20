import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import RatingSystem from '../components/RatingSystem';
let socket;
const baseURL = "http://localhost:8000/api"

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

    const [ratingStatus, setRatingStatus]=useState();
    const [rating, setRating]=useState(0);
    const [ratingFilled, setRatingFilled]=useState('');

    const [reviewData, setReviewData]=useState({
        'rating':'',
        'review': '',
      })
    

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
        setMessageData(
            {
                ...messageData,
                message: ""
            }
        )
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

    function acceptOffer(offer_id) {
        var config = {
            method: 'post',
            url: 'http://localhost:8000/api/offer/accept/',
            withCredentials: true,
            data: {
                "offer": offer_id,
            }
        }
        axios(config)
        .then(function (response) {
            console.log(response.data);
            // reload page
            window.location.reload();
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    function handleChange(event){
        setReviewData({
          ...reviewData,
          [event.target.name]: event.target.value
        })
      }


    function handleSubmit(listing_id){
        if (reviewData.rating === '')
        {
          setRatingFilled('Please give a rating.')
        }
        else{
          const RatingformData = new FormData();
          RatingformData.append('rating', reviewData.rating);
          RatingformData.append('review', reviewData.review);
          RatingformData.append("listing", listing_id)
          RatingformData.append("reviewee", interlocutorId)
            var config = {
                method: 'post',
                url: 'http://localhost:8000/api/leave-review/',
                withCredentials: true,
                data: RatingformData
            }
            axios(config)
            .then(function (response) {
                // reload page
                window.location.reload();
            }
            )
            .catch(function (error) {
                console.log(error);
            }
            );
        }
        
      }

    function writeOfferMessage(is_accepted, price, title, is_owner, sender_name, offer_id, listing_id, buyer_left_review,seller_left_review) {
        // return jsx of the offer message
        // If is_owner and is_accepted, say that you have sold this for price
        // If is_owner and not_accpeted, say sender_name has offered price for listing title (Link to listing)
        // If not is_owner and is_accepted, say that you have bought this for price
        // If not is_owner and not_accepted, say that you have offered price for listing title (Link to listing)
        console.log(sender_name)
        console.log(listing_id)
        console.log(buyer_left_review)
        console.log(seller_left_review)
        if (is_owner) {
            if (is_accepted) {
                return (
                    <div className='chat--main--offer--message'>
                        <h3>You have sold <Link to={`/listing/${listing_id}`}>{title}</Link> for ${price}</h3>
                        {
                            seller_left_review ? null : 
                            <>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#reviewModal1">Give a review</button>
                            <div class="modal fade" id="reviewModal1" tabIndex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="reviewModalLabel">Review for {title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                <form>
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Rating</label>
                                    <RatingSystem handleChange={handleChange} />
                                    <p className='text-muted'>{ratingFilled}</p>
                                    <label  for="InputReview" class="form-label">Review</label>
                                    <textarea onChange={handleChange} name="review" value={reviewData.review} type="text" class="form-control" id="InputReview" rows="5"></textarea>
                                </div>
                                </form>
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={() => handleSubmit(listing_id)} type="button" class="btn btn-primary">Submit</button>
                                </div>
                            </div>
                            </div>
                            </div>
                            </>
                        }
                    </div>
                )
            } else {
                return (
                    <div className='chat--main--offer--message'>
                        <h3>{sender_name} has offered ${price} for <Link to={`/listing/${listing_id}`}>{title}</Link></h3>
                        <button onClick={()=>acceptOffer(offer_id)}>Accept</button>
                    </div>
                )
            }
        }

        if (is_accepted) {
            return (
                <div className='chat--main--offer--message'>
                    <h3>You have bought <Link to={`/listing/${listing_id}`}>{title}</Link> ${price}</h3>
                    {
                        buyer_left_review ? null :
                        <>
                        <button type="button" className="course--information--enroll--button" data-bs-toggle="modal" data-bs-target="#reviewModal">Give a review</button>
                        <div class="modal fade" id="reviewModal" tabIndex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="reviewModalLabel">Review for {title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <form>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Rating</label>
                                <RatingSystem handleChange={handleChange} />
                                <p className='text-muted'>{ratingFilled}</p>
                                <label  for="InputReview" class="form-label">Review</label>
                                <textarea onChange={handleChange} name="review" value={reviewData.review} type="text" class="form-control" id="InputReview" rows="5"></textarea>
                            </div>
                            </form>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={() => handleSubmit(listing_id)} type="button" class="btn btn-primary">Submit</button>
                            </div>
                        </div>
                        </div>
                        </div>
                        </>
                    }
                </div>
            )
        }

        return (
            <div className='chat--main--offer--message'>
                <h3>You have offered ${price} for <Link to={`/listing/${title}`}>{title}</Link></h3>
            </div>
        )

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
                                                {writeOfferMessage(
                                                    message.is_accepted,
                                                    message.price, 
                                                    message.listing.title, 
                                                    false, 
                                                    message.sender.username, 
                                                    message.id, 
                                                    message.listing.id, 
                                                    message.listing.buyer_left_review, 
                                                    message.listing.seller_left_review)}
                                                <p>{convertTime(message.date)}</p>
                                                <hr />
                                                 </> :
                                                <>
                                                {writeOfferMessage(
                                                    message.is_accepted,
                                                    message.price,
                                                    message.listing.title,
                                                    true,
                                                    message.sender.username,
                                                    message.id,
                                                    message.listing.id,
                                                    message.listing.buyer_left_review,
                                                    message.listing.seller_left_review
                                                )}
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
