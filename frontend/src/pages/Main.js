import Header from '../components/Header'

// Pages
import Home from './Home'
import ListingDetails from './ListingDetails'
import Login from './Login'
import Logout from './Logout'
import Register from './Register'
import CreateListing from './CreateListing'


import '../styles.css'

import {Routes, Route} from 'react-router-dom'

function Main() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </div>

  );
}

export default Main;

