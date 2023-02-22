import React, { useState } from "react";
import axios from "axios";

function SearchContainer({ setListing }) {
  const [searchInput, setSearchInput] = useState("");
  const [numBedrooms, setNumBedrooms] = useState("");
  const [sortingOrder, setSortingOrder] = useState("");
  const [saleType, setSaleType] = useState("");

  const handleSearch = () => {
    const queryParams = {
      searchInput,
      numBedrooms,
      sortingOrder,
      saleType,
    };
    // create the queryString with params which are not empty string
    const queryString = Object.keys(queryParams)
      .filter((key) => queryParams[key] !== "")
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");

    axios.get(`http://localhost:8000/api/search/?${queryString}`)
      .then((response) => {
        setListing(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="search-input"
      />
      <select
        value={numBedrooms}
        onChange={(event) => setNumBedrooms(event.target.value)}
        className="num-rooms-select"
      >
        <option value="">Number of Bedrooms</option>
        <option value="1">1 Bedroom</option>
        <option value="2">2 Bedrooms</option>
        <option value="3">3 Bedrooms</option>
        <option value="4">4 Bedrooms</option>
      </select>
      <select
        value={sortingOrder}
        onChange={(event) => setSortingOrder(event.target.value)}
        className="sorting-order-select"
      >
        <option value="">Sort By</option>
        <option value="priceHighToLow">Price: High to Low</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="newestListings">Newest Listings</option>
      </select>
      <select
        value={saleType}
        onChange={(event) => setSaleType(event.target.value)}
        className="sale-type-select"
      >
        <option value="">Sale Type</option>
        <option value="forSale">For Sale</option>
        <option value="forRent">For Rent</option>
      </select>
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
}

export default SearchContainer;
