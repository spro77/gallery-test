import React, { useState, useEffect } from "react";
import axios from "axios"
import {Container, Box, Grid, Pagination, CircularProgress} from '@mui/material';

const App = () => {
  console.log("APP RELOADED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState({
    data: null,
    currentPage: null,
    totalPages: null,
    perPage: null,
    paginatedData: null
  })

  const paginateData = (data, page = 1, numItems = 10) => {
    if( !Array.isArray(data) ) {
      throw `Expect array and got ${typeof data}`;
    }
    const currentPage = parseInt(page);
    const perPage = parseInt(numItems);
    const offset = (page - 1) * perPage;
    const paginatedData = data.slice(offset, offset + perPage);

    return {
      currentPage,
      perPage,
      totalPages: Math.ceil(data.length / perPage),
      paginatedData
    };
  }

  useEffect(() => {
    console.log("FETCHING");
    axios("http://jsonplaceholder.typicode.com/photos")
      .then(({data}) => {
        setState({
          ...state,
          data: data,
          ...paginateData(data)
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
    });
 }, []);

 const onPageChangeHandler = (e, p) => {
   setState({
     ...state,
     ...paginateData(state.data, p)
   })
 }

  if (loading) {
    return(
      <Box style={{ display: 'flex', height:'100%', alignItems:'center', justifyContent: 'center'}}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) return "Error!";
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {state.paginatedData.map((el, i) => (
          <Grid item key={el.title}>
            <img src={el.thumbnailUrl} alt={el.title} />
          </Grid>
        ))}
      </Grid>
      <Pagination
      count={state.totalPages}
      page={state.currentPage}
      hideNextButton={state.currentPage === state.totalPages}
      hidePrevButton={state.currentPage === 1}
      onChange={(e,p)=>onPageChangeHandler(e,p)}
      />
    </Container>
  )
}
export default App