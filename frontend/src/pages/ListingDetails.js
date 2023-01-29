import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
const baseURL="http://127.0.0.1:8000/api"

function ListingDetails() {
    const [listingData, setListingData] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const { listing_id } = useParams()

    useEffect(() => {
        axios.get(baseURL + "/listings/" + listing_id + "/").then((response) => {
            setListingData(response.data)
        })

    }, [])

    useEffect (() => {
        // Check if the current user logged in is the owner of the listing
        // If he is then add a button that routes to "edit-listing/" + listing_id
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        };
        axios(config)
        .then(function (response) {
            if (response.data.id === listingData.owner) {
                setIsOwner(true)
            }
        }
        ).catch(function (error) {
            console.log(error);
        }
        );
    }, [listingData])

    function getPropertyType() {
        if (listingData.property_type === 1) {
            return "HDB"
        } else if (listingData.property_type === 2) {
            return "Condominium"
        } else if (listingData.property_type === 3) {
            return "Landed"
        } else {
            return "Other"
        }
    }

    function getSaleOrRent() {
        if (listingData.sale_or_rent === 1) {
            return "Sale"
        } else if (listingData.sale_or_rent === 2) {
            return "Rent"
        }
    }
    console.log(listingData)


    return(
        <div className="container mt-4">
            {isOwner &&
                <div>
                <Link to={'/edit-listing/' + listing_id}>
                <button type="button">Edit Listing</button>
                </Link>
                </div>
            }
            <h1>{ listingData.title }</h1>
            <img src={ listingData.photo_main } alt="listing" />
            <p><b>Owner Name: </b> { listingData.owner_name } </p>
            <p><b>Address: </b> { listingData.address }</p>
            <p><b>Zipcode: </b> { listingData.zipcode }</p>
            <p><b>Property Type: </b>{ getPropertyType(listingData.property_type) }</p>
            <p><b>Sale or Rent: </b>{ getSaleOrRent(listingData.sale_or_rent) }</p>
            <p><b>Price: </b> { listingData.price }</p>
            <p><b>Bedrooms: </b> { listingData.bedrooms }</p>
            <p><b>Bathrooms: </b> { listingData.bathrooms }</p>
            <p><b>Size: </b>{ listingData.sqmeters } Square Meters</p>
            <p><b>Description: </b>{ listingData.description }</p>
        </div>
    )
}

export default ListingDetails;