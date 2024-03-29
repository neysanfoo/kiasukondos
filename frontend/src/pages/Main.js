import Header from '../components/Header'

// Pages
import HomePage from './HomePage'
import Home from './Home'
import ListingDetails from './ListingDetails'
import Login from './Login'
import Logout from './Logout'
import Register from './Register'
import CreateListing from './CreateListing'
import EditListing from './EditListing'
import Dashboard from './Dashboard'
import Chat from './Chat'
import EditProfile from './EditProfile'
import UserProfile from './UserProfile'



import ProtectedRoute from '../utils/ProtectedRoute'

import '../styles.css'

import { Routes, Route } from 'react-router-dom'

function Main() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homes" element={<Home />} />
        <Route path="/listing/:listing_id" element={<ListingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-profile/:user_id" element={<UserProfile />} />
        <Route path="/" element={<ProtectedRoute />} >
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listing_id" element={<EditListing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </div>

  );
}

export default Main;

