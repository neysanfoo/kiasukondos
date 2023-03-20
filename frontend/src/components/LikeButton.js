import { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL + '/api';

const LikeButton = ({ user_id, listing_id }) => {
    const [isLiked, setIsLiked] = useState(false);

    // Check to see if the user has liked the listing
    useEffect(() => {
        var config = {
            method: 'get',
            url: baseURL + '/fetch-like-status/' + listing_id ,
            withCredentials: true,
          };
        axios(config)
        .then(function (response) {
            if (response.data.liked) {
                setIsLiked(true);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }, []);
  
    function likeListing() {
        const formData = new FormData();
        formData.append('user', user_id);
        formData.append('listing', listing_id);
        var config = {
            method: 'post',
            url: baseURL + '/likes/',
            withCredentials: true,
            data: formData
        };
        axios(config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const changeColor = () => {
        likeListing()
        setIsLiked(!isLiked);
    };

  
    return (
        <i className={isLiked ? 'bi bi-heart-fill heart active' : 'bi bi-heart-fill heart'} onClick={changeColor}></i>
    );
  };
  
  export default LikeButton;