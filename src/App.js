import React, { useState, useEffect } from "react";
import axios from "axios"
import {AppBar, Toolbar, Container, Box, Grid, Pagination, CircularProgress, Alert, Card, CardContent, CardMedia, Typography, Button, CardActionArea, CardActions, Modal, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

const App = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationState, setPaginationState] = useState({
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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid darkgray',
    borderRadius: '.5rem',
    boxShadow: 24,
    p: 2,
  };

  useEffect(() => {
    axios("http://jsonplaceholder.typicode.com/photos")
      .then(({data}) => {
        setPaginationState({
          ...paginationState,
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
    setPaginationState({
      ...paginationState,
      ...paginateData(paginationState.data, p)
    })
  }

  const onDeleteHandler = (id) => {
    axios.delete(`http://jsonplaceholder.typicode.com/photos/${id}`)
      .then(() => {
        const newData = paginationState.data.filter(el => el.id !== id)
        setPaginationState({
          ...paginationState,
          data: newData,
          ...paginateData(newData, paginationState.currentPage)
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error.message);
        setError(error.message);
      })
  }

  const cardActionAreaHandler = (el) => {
    setOpenModal(el)
  }

  const filterChangeHandler = (e) => {
    const sortedData = e.target.value === 0 ? paginationState.data.sort((a, b) => a.albumId - b.albumId) : paginationState.data.sort((a, b) => a.title.localeCompare(b.title))
    setPaginationState({
      ...paginationState,
      data: sortedData,
      ...paginateData(sortedData)
    });
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
    <>
      <AppBar position="sticky" style={{background:'white'}}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color:'black', display: { xs: 'none', sm: 'block' } }}
          >
            PHOTOS
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              id="filter-autowidth"
              onChange={filterChangeHandler}
              autoWidth
              label="Filter"
              defaultValue={0}
            >
              <MenuItem value={0}>By album</MenuItem>
              <MenuItem value={1}>By alphabet</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop: '48px'}}>
        <Grid container spacing={2}>
          {paginationState.paginatedData?.map((el, i) => (
            <Grid item key={el.title}>
              <Card style={{ width: 267 }}>
                <CardActionArea onClick={()=>cardActionAreaHandler(el)}>
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
                  <Button size="small" color="primary" onClick={()=>onDeleteHandler(el.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Pagination
        count={paginationState.totalPages}
        page={paginationState.currentPage}
        hideNextButton={paginationState.currentPage === paginationState.totalPages}
        hidePrevButton={paginationState.currentPage === 1}
        onChange={(e,p)=>onPageChangeHandler(e,p)}
        style={{marginTop:'3rem'}}
        />
      </Container>

      <Modal
        open={Boolean(openModal)}
        onClose={()=>setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <CardMedia
            component="img"
            height="600"
            image={openModal.url}
            alt={openModal.title}
          />
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
            {`Album ${openModal.albumId} / Item ${openModal.id}`}
          </Typography>
          <Typography id="modal-modal-description">
            {openModal.title}
          </Typography>
        </Box>
      </Modal>
    </>
  )
}
export default App