import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const baseURL="http://127.0.0.1:8000/api"

function Home() {
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get(baseURL + "/hello/").then((response) => {
      setData(response.data)
    })
  }, [])

  return (
    <>
      {data.map((item) => (
        <div key={item.id}>
          <h1>{item.message}</h1>
        </div>
      ))}
    </>
  )
}

export default Home

