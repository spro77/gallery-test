import React, { useState, useEffect } from "react";
import axios from "axios"
import {Container, Box, Grid, Pagination, CircularProgress, Alert, Card, CardContent, CardMedia, Typography, Button, CardActionArea, CardActions} from '@mui/material';

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
        console.error("Error fetching data: ", error.message);
        setError(error.message);
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

 const onCardClickHandler = (id) => {
   axios.delete(`http://jsonplaceholder.typicode.com/photos/${id}`)
    .then(() => {
      const newData = state.data.filter(el => el.id !== id)
      setState({
        ...state,
        data: newData,
        ...paginateData(newData, state.currentPage)
      });
    })
    .catch((error) => {
      console.error("Error fetching data: ", error.message);
      setError(error.message);
    })
 }

  if (loading) {
    return(
      <Box style={{ display: 'flex', height:'100%', alignItems:'center', justifyContent: 'center'}}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="warning">{error}</Alert>
  };

  return (
    <Container maxWidth="lg" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Grid container spacing={2}>
        {state.paginatedData?.map((el, i) => (
          <Grid item key={el.title}>
            <Card style={{ width: 267 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="150"
                  image={el.thumbnailUrl}
                  alt={el.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {el.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {el.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" onClick={()=>onCardClickHandler(el.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
      count={state.totalPages}
      page={state.currentPage}
      hideNextButton={state.currentPage === state.totalPages}
      hidePrevButton={state.currentPage === 1}
      onChange={(e,p)=>onPageChangeHandler(e,p)}
      style={{marginTop:'3rem'}}
      />
    </Container>
  )
}
export default App