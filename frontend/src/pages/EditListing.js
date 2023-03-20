import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const baseURL = process.env.REACT_APP_BACKEND_URL + "/api";

function EditListing() {
    const listing_id = useParams().listing_id;
    const [owner, setOwner] = useState(null)
    const [photoMainURL, setPhotoMainURL] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        zipcode: '',
        property_type: 1,
        sale_or_rent: 1,
        description: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        garage: '',
        sqmeters: '',
        is_published: true,
    });

    useEffect(() => {
        var config = {
            method: 'get',
            url: baseURL + '/listings/' + listing_id + '/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
            const res = response.data
            setFormData({
                title: res.title,
                address: res.address,
                zipcode: res.zipcode,
                property_type: res.property_type,
                sale_or_rent: res.sale_or_rent,
                description: res.description,
                price: res.price,
                bedrooms: res.bedrooms,
                bathrooms: res.bathrooms,
                garage: res.garage,
                sqmeters: res.sqmeters,
                is_published: res.is_published, 
            })
            setOwner(res.owner)
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }, []);

    useEffect (() => {
        var config = {
            method: 'get',
            url: baseURL + '/user/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
            // Check if the current user is the owner of this listing
            if (owner && response.data.id !== owner) {
                window.location.href = "/homes"
            } 
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }, [formData]);




    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        console.log(e.target.files);
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        const file = e.target.files[0];
        if (file){
            const imageUrl = URL.createObjectURL(file);
            const img = new Image();
            img.src = imageUrl;
            img.onload = () =>{
                URL.revokeObjectURL(img.src);
            };
            setPhotoMainURL(e.target.files[0])
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios.patch(baseURL + "/listings/" + listing_id + "/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
            window.location.href = "/homes"

        }
        )
    };

    return (
        <div className='container'>
        <form className='create--listing--form' onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                onChange={handleChange}
                value={formData.title}
                required
            />

            <label htmlFor="address">Address:</label>
            <input
                type="text"
                id="address"
                name="address"
                onChange={handleChange}
                value={formData.address}
                required
            />

            <label htmlFor="zipcode">Zipcode:</label>
            <input
                type="text"
                id="zipcode"
                name="zipcode"
                onChange={handleChange}
                value={formData.zipcode}
                required
            />
            
            <label htmlFor="property_type">Property Type:</label>
            <select
                id="property_type"
                name="property_type"
                onChange={handleChange}
                value={formData.property_type}
                required
            >
                <option value="1">HDB</option>
                <option value="2">Condo</option>
                <option value="3">Landed</option>
            </select>
            
            <label htmlFor="sale_or_rent">Sale or Rent:</label>
            <select
                id="sale_or_rent"
                name="sale_or_rent"
                onChange={handleChange}
                value={formData.sale_or_rent}
                required
            >
                <option value="1">For Sale</option>
                <option value="2">For Rent</option>
            </select>
            
            <label htmlFor="description">Description:</label>
            <textarea
                id="description"
                name="description"
                onChange={handleChange}
                value={formData.description}
                required
            ></textarea>
            
            <label htmlFor="price">Price:</label>
            <input
                type="number"
                id="price"
                name="price"
                onChange={handleChange}
                value={formData.price}
                required
            />
            
            <label htmlFor="bedrooms">Bedrooms:</label>
            <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                required
            />
            
            <label htmlFor="bathrooms">Bathrooms:</label>
            <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                required
            />
            
            <label htmlFor="garage">Garage:</label>
            <input
                type="number"
                id="garage"
                name="garage"
                onChange={handleChange}
                value={formData.garage}
            />
            
            <label htmlFor="sqmeters">Sq Meters:</label>
            <input
                type="number"
                id="sqmeters"
                name="sqmeters"
                onChange={handleChange}
                value={formData.sqmeters}
                required
            />
            
            <>
            <label htmlFor="photo_main">Main Photo:</label>
            <input
                type="file"
                id="photo_main"
                name="photo_main"
                onChange={handleFileChange}
            />
                {photoMainURL && <img src={photoMainURL} class = "photo_main" alt="..." />}
                
            </>
            <label htmlFor="photo_1">Additional Photo 1:</label>
            <input
                type="file"
                id="photo_1"
                name="photo_1"
                onChange={handleFileChange}
            />

            <label htmlFor="photo_2">Additional Photo 2:</label>
            <input
                type="file"
                id="photo_2"
                name="photo_2"
                onChange={handleFileChange}
            />
            <label htmlFor="photo_3">Additional Photo 3:</label>
            <input
                type="file"
                id="photo_3"
                name="photo_3"
                onChange={handleFileChange}
            />
            <label htmlFor="photo_4">Additional Photo 4:</label>
            <input
                type="file"
                id="photo_4"
                name="photo_4"
                onChange={handleFileChange}
            />
            
            <label htmlFor="photo_5">Additional Photo 5:</label>
            <input
                type="file"
                id="photo_5"
                name="photo_5"
                onChange={handleFileChange}
            />
            
            <label htmlFor="photo_6">Additional Photo 6:</label>
            <input
                type="file"
                id="photo_6"
                name="photo_6"
                onChange={handleFileChange}
            />
            
            <button type="submit">Update</button>
        </form>
        </div>
    )

}

export default EditListing;