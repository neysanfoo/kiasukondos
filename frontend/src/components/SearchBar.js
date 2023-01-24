import React, { useState } from 'react';
import Select from 'react-select';

const tempOptions = [
    { name: "Option 1", url: "/option1" },
    { name: "Option 2", url: "/option2" },
    { name: "Option 3", url: "/option3" },
    { name: "Option 4", url: "/option4" }
];

const options = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'category', label: 'Category' },
];

const roomsOptions = [
    { value: '1', label: '1 Room' },
    { value: '2', label: '2 Rooms' },
    { value: '3', label: '3 Rooms' },
    { value: '4', label: '4 Rooms' },
    { value: '5', label: '5 Rooms' },
    { value: '6', label: '6 Rooms' },
];

const bedroomsOptions = [
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5 Bedrooms' },
];

const typeOptions = [
    { value: 'rent', label: 'Rent' },
    { value: 'sale', label: 'Sale' },
];

const squareMetersOptions = [
    { value: '50', label: '50 sqm' },
    { value: '100', label: '100 sqm' },
    { value: '150', label: '150 sqm' },
    { value: '200', label: '200 sqm' },
    { value: '250', label: '250 sqm' },
];

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [selectedRoomsOption, setSelectedRoomsOption] = useState(roomsOptions[0]);
    const [selectedBedroomsOption, setSelectedBedroomsOption] = useState(bedroomsOptions[0]);
    const [selectedTypeOption, setSelectedTypeOption] = useState(typeOptions[0]);
    const [selectedSquareMetersOption, setSelectedSquareMetersOption] = useState(squareMetersOptions[0]);

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }

    const handleRoomsSelectChange = (selectedRoomsOption) => {
        setSelectedRoomsOption(selectedRoomsOption);
    }

    const handleBedroomsSelectChange = (selectedBedroomsOption) => {
        setSelectedBedroomsOption(selectedBedroomsOption);
    }

    const handleTypeSelectChange = (selectedTypeOption) => {
        setSelectedTypeOption(selectedTypeOption);
    }

    const handleSquareMetersSelectChange = (selectedSquareMetersOption) => {
        setSelectedSquareMetersOption(selectedSquareMetersOption);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // make API call to search endpoint with searchQuery, selectedOption, selectedRoomsOption, selectedBedroomsOption, selectedTypeOption, and selectedSquareMetersOption
    }

    return (
        <div>
        <div className='search--bar--and--filters--container'>
            <form className='search--bar' onSubmit={handleSubmit}>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={handleChange} />
                <button type="submit"><i class="bi bi-search"></i></button>
            </form>
            <Select className='search--select' options={options} value={selectedOption} onChange={handleSelectChange} />
            <Select className='search--select' options={roomsOptions} value={selectedRoomsOption} onChange={handleRoomsSelectChange} />

            <Select className='search--select' options={typeOptions} value={selectedTypeOption} onChange={handleTypeSelectChange} />

        </div>
        {/* <div className='search--bar--filters--container'>
            <Select className='search--select' options={options} value={selectedOption} onChange={handleSelectChange} />
            <Select className='search--select' options={roomsOptions} value={selectedRoomsOption} onChange={handleRoomsSelectChange} />
            <Select className='search--select' options={bedroomsOptions} value={selectedBedroomsOption} onChange={handleBedroomsSelectChange} />
            <Select className='search--select' options={typeOptions} value={selectedTypeOption} onChange={handleTypeSelectChange} />
            <Select className='search--select' options={squareMetersOptions} value={selectedSquareMetersOption} onChange={handleSquareMetersSelectChange} />
        </div> */}
        </div>
    );
}

export default SearchBar;