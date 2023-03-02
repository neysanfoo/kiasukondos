import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const baseURL="http://127.0.0.1:8000/api"

function CreateListing() {
    useEffect(() => {
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/user/',
            withCredentials: true
        };
        
        axios(config)
        .then(function (response) {
            setFormData({ ...formData, owner: response.data.id });
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }, []);


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
        list_date: '',
        photo_main: null,
        photo_1: null,
        photo_2: null,
        photo_3: null,
        photo_4: null,
        photo_5: null,
        photo_6: null,
        town: ''
    });

    const towns = ['PUNGGOL', 'JURONG WEST', 'BEDOK', 'BUKIT MERAH', 'CHOA CHU KANG', 'TAMPINES',
    'SENGKANG', 'ANG MO KIO', 'HOUGANG', 'TOA PAYOH', 'JURONG EAST', 'WOODLANDS',
    'BUKIT BATOK', 'SEMBAWANG', 'CENTRAL', 'QUEENSTOWN', 'BISHAN', 'CLEMENTI',
    'MARINE PARADE', 'PASIR RIS', 'YISHUN', 'GEYLANG', 'SERANGOON',
    'BUKIT PANJANG', 'KALLANG/WHAMPOA', 'BUKIT TIMAH']

    console.log(formData)
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(baseURL + "/listings/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
            window.location.href = "/"

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

            <label htmlFor="town">Town</label>
            <select
                id="town"
                name="town"
                onChange={handleChange}
                value={formData.town}
                required
            >
                {towns.map((town) => (
                    <option value={town}>{town}</option>
                ))}
            </select>

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
            
            
            <label htmlFor="list_date">List Date:</label>
            <input
                type="date"
                id="list_date"
                name="list_date"
                onChange={handleChange}
                value={formData.list_date}
            />
            
            <label htmlFor="photo_main">Main Photo:</label>
            <input
                type="file"
                id="photo_main"
                name="photo_main"
                onChange={handleFileChange}
            />
            
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
            
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}

export default CreateListing;