import Tabs from "../components/Tabs"
import UserInformation from "../components/UserInformation";
import axios from "axios"
import { useState, useEffect } from "react";

function Dashboard() {

    const [myPurchases, setMyPurchases] = useState([])
    const [myListings, setMyListings] = useState([])
    const [myLikes, setMyLikes] = useState([])

    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/purchases/',
            withCredentials: true,
        };
        axios(config)
        .then(function (response) {
            setMyPurchases(response.data)
            console.log(response.data)
        }).catch(function (error) {
            console.log(error);
        });

        config = {
            method: 'get',
            url: 'http://localhost:8000/api/listings-by-user/',
            withCredentials: true,
        };
        axios(config)
        .then(function (response) {
            setMyListings(response.data)
            console.log(response.data)
        }).catch(function (error) {
            console.log(error);
        });

        config = {
            method: 'get',
            url: 'http://localhost:8000/api/likes/',
            withCredentials: true,
        };
        axios(config)
        .then(function (response) {
            setMyLikes(response.data.map((like) => like.listing))
        }).catch(function (error) {
            console.log(error);
        });
    }, [])
      

    return(
        <div className="container mt-4">
            <div className="row">
                <div className="col-3">
                    <UserInformation />
                </div>
                <div className="col-9">
                    <Tabs
                        myListings={myListings}
                        myLikes={myLikes}
                        myPurchases={myPurchases}
                     />
                </div>

           
            </div>
        </div>

    )
}

export default Dashboard