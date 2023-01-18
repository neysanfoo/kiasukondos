import Header from '../components/Header'
import Home from './Home'
import ListingDetails from './ListingDetails'
import '../styles.css'

import {Routes, Route} from 'react-router-dom'

function Main() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
      </Routes>
    </div>

  );
}

export default Main;

