import Header from '../components/Header'

// Pages
import Home from './Home'
import ListingDetails from './ListingDetails'
import Login from './Login'
import Logout from './Logout'
import Register from './Register'
import CreateListing from './CreateListing'
import Dashboard from './Dashboard'



import ProtectedRoute from '../utils/ProtectedRoute'

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
        <Route path="/" element={<ProtectedRoute />} >
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>

  );
}

export default Main;

