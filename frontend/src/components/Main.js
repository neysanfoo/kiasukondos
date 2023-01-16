import Header from './Header'
import Home from './Home'
import '../styles.css'

import {Routes, Route} from 'react-router-dom'

function Main() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>

  );
}

export default Main;

