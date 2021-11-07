import React, { useState, useEffect } from "react";
import axios from "axios"
import './App.css';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios("http://jsonplaceholder.typicode.com/photos")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
  }); }, []);

  if (loading) return "Loading...";
  if (error) return "Error!";
  return ( <>
    <img src={data[10].thumbnailUrl} alt={data[10].title} />
    </>
  )
}
export default App