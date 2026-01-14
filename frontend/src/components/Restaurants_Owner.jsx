import { Close, Delete, Edit, Info, Menu, SentimentDissatisfied, Translate, Warning } from '@mui/icons-material'
import { Alert, AppBar, Autocomplete, Box, Button, Card, CircularProgress, debounce, Dialog, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItemButton, ListItemText, Modal, OutlinedInput, Paper, Skeleton, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar'
import { SketchPicker } from 'react-color'
import api from '../api'
import Swal from 'sweetalert2'

const Restaurants_Owner = () => {
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [main, setMain] = useState("#ffffff");
  const [secondary, setSecondary] = useState("#333333");
  const [textMain, setTextMain] = useState("#000000");
  const [textSecondary, setTextSecondary] = useState("#777777");
  const [logo, setLogo] = useState(null);
  const [font, setFont] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [exceedSize, setExceedSize] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const fonts = ["poppins", "roboto", "montaserrat", "open sans", "oswald"];
  const theme = useTheme();

  const SkeletonRow = () => (
        <TableRow>
          <TableCell width={"40%"}><Skeleton width="100%" /></TableCell>
          <TableCell width={"40%"} sx={{display: {xs: "none", md: "table-cell"}}}><Skeleton width="100%" /></TableCell>
          <TableCell align='center'><Skeleton width="100%"/></TableCell>
        </TableRow>
      );
  const filteredRestauratns = restaurants.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(); 
      formData.append("name", name);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("primaryColor", main);
      formData.append("secondaryColor", secondary);
      formData.append("textPrimary", textMain);
      formData.append("textSecondary", textSecondary);
      formData.append("font", font);
      if (logo) formData.append("logo", logo);
      const response = await api.post("/restaurant", formData,{
        headers: {
          "Content-Type": "mutlipart/form-data"
        }
      });
      setRestaurants((r) => [...r, response.data]);
      Swal.fire({
        title: "Done!",
        text: "Your restaurant was created successfully",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Some error has occurred, try again";
      Swal.fire({
        title: "Oops!",
        text: message,
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
      setOpenCreate(false);
    }
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setExceedSize(true);
      e.target.value = "";
      return;
    }
    setExceedSize(false);
    setLogo(file);
  }

  function handleCloseCreate() {
    setOpenCreate(false);
    setName("");
    setAddress("");
    setPhone("");
    setMain("#ffffff");
    setSecondary("#333333");
    setTextMain("#000000");
    setTextSecondary("#777777");
    setFont("");
    setLogo(null);
    setExceedSize(false);
  };

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await api.get("restaurant");
        setRestaurants(response.data);
      } catch(error) {
        console.error(error);
        Swal.fire({
          title: "Oops...",
          text: "an error occurred, can't retrieve data.",
          icon: "error",
          showCloseButton: true,
          background: theme.palette.background.default,
          color: theme.palette.text.primary
        });
      } finally {
        setLoading(false);
      }
    }
    async function validateToken() {
      try {
        const response = await api.get("auth/validate");
      } catch (error) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    validateToken();
    loadRestaurants();
  }, []);

  return (
    <>
    <Box>
      <Box position={'absolute'} top={'5%'} left={'8%'} display={{sm: "block", md: "none"}}>
        <IconButton onClick={() => setOpen(true)}>
          <Menu sx={{color: "text.primary"}}/>
        </IconButton>
        <Drawer
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}>
          <OwnerSidebar view={"phone"} subname={"Restaurant Owner"}/>
        </Drawer>
      </Box>
      <Box display={'flex'} bgcolor={"background.default"} gap={2}>
        <OwnerSidebar subname={"Restaurant Owner"}/>
        <Box flex={4} p={5} mt={{xs: 8, md: 0}}>
          <Stack justifyContent={'space-between'} alignItems={'center'} direction={{xs: 'column', md:'row'}}>
            <Box>
              <Typography variant='h4' fontWeight={700} color='text.primary'>
                My Reastaurants
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Perform all operations on your restaurants.
              </Typography>
            </Box>
            <Button variant='contained' sx={{width: "300px", mt: {xs: 2, md: 0}}}
            onClick={() => setOpenCreate(true)}>
              Create new restaurant
            </Button>
          </Stack>
          <Box mt={3}>
            <TextField
            label="Search..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{bgcolor: "background.paper"}}/>
          </Box>
          <Box mt={3}>
            {filteredRestauratns.length !== 0 || loading ? (
              <TableContainer component={Paper} sx={{p: 2, overflowX: 'auto'}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}
                      align='center'>name</TableCell>
                      <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper", display: {xs: "none", md: "table-cell"}}} align='center'>slug (URL path)</TableCell>
                      <TableCell align='center' sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}>actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from(new Array(5)).map((_, i) => <SkeletonRow key={i} />)
                    ) : (
                      filteredRestauratns.map((r) => (
                        <TableRow key={r.id}>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary"}}
                        align='center'>{r.name}</TableCell>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary", display: {xs: "none", md: "table-cell"}}}
                        align='center'>{r.slug}</TableCell>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary"}}
                        align='center'>
                          <Tooltip title="Details">
                            <IconButton onClick={() => setSelectedRestaurant(r)}>
                              <Info sx={{color: "text.secondary"}}/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton>
                              <Edit sx={{color: "primary.dark"}}/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton>
                              <Delete sx={{color: "error.main"}}/>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <>
                <Typography variant='h5' color='text.secondary' mt={5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <SentimentDissatisfied sx={{color: 'text.secondary', mr: 2, fontSize: "40px"}} /> No elements Found!
                </Typography>
                <Button variant='contained' sx={{display: 'flex', alignSelf: 'center', justifySelf: 'center', mt: 1, bgcolor: "secondary.main"}}
                onClick={() => setOpenCreate(true)}>
                  Create new restaurant
                </Button>
              </>
            )}
          </Box>
        </Box>
          <Modal
          open={openCreate}
          onClose={handleCloseCreate}>
            <Box
            sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: "100vh"
          }} onClick={handleCloseCreate}>
              <Card
              sx={{
                p: 5,
                width: {xs: '80vw', md: '1000px'},
                maxHeight: '88vh',
                overflowY: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <Typography variant='h4' fontWeight={600} color='primary.main' textAlign={'center'}>
                  Create new Restaurant
                </Typography>
                <Box mt={3}>
                  <form action="#" onSubmit={handleCreate}>
                    <Box textAlign={'center'}>
                      <Stack direction={{xs: 'column', md: 'row'}} gap={{xs: 1, md: 2}}
                      divider={
                        <Divider flexItem sx={{borderWidth: 0.5, borderColor: "divider"}}/>
                      } justifyContent={'space-between'} alignItems={'flex-start'}>
                          <Box flex={1} p={3} px={{xs: 0, md: 3}}>
                            <Typography variant='h5' textAlign={'center'}>
                              Main info
                            </Typography>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='name'>Name</InputLabel>
                              <OutlinedInput id="name"
                              label="Name" fullWidth
                              autoComplete='off'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='address'>Address</InputLabel>
                              <OutlinedInput id="address"
                              label="Address" fullWidth type='address'
                              autoComplete='off'
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='phone'>Phone</InputLabel>
                              <OutlinedInput id="phone"
                              label="Phone" fullWidth type='tel'
                              value={phone}
                              autoComplete='off'
                              onChange={(e) => setPhone(e.target.value)}
                              inputProps={{ pattern: "[0-9+ ]*" }}
                              required/>
                            </FormControl>
                            <Button variant='contained' fullWidth sx={{mt: 2, bgcolor: "secondary.main", color: "background.default"}} component="label">
                              {logo ? logo.name : "Upload Logo (optional)"}
                              <input type="file"
                              hidden
                              accept='image/*'
                              onChange={handleLogoChange} />
                            </Button>
                            {exceedSize && <Alert icon={<Warning fontSize='inherit'/>} severity='error' sx={{width: '100%', mt: 2}}>
                              Maximum size for a logo is 2MB.</Alert>}
                          </Box>
                          <Box flex={1} p={3} px={{xs: 0, md: 3}} sx={{width: '100%'}}>
                            <Typography variant='h5' textAlign={'center'}>
                              Theme
                            </Typography>
                            <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                              <InputLabel htmlFor='primary'>Primary color</InputLabel>
                              <OutlinedInput
                              label="Primary color"
                              value={main}
                              id='primary' type='color'
                              onChange={(e) => setMain(e.target.value)}/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                              <InputLabel htmlFor='secondary'>Secondary color</InputLabel>
                              <OutlinedInput
                              label="Secondary color"
                              value={secondary}
                              id='secondary' type='color'
                              onChange={(e) => setSecondary(e.target.value)}/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                              <InputLabel htmlFor='textPrimary'>Text primary</InputLabel>
                              <OutlinedInput
                              label="Text primary"
                              value={textMain}
                              id='textPrimary' type='color'
                              onChange={(e) => setTextMain(e.target.value)}/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                              <InputLabel htmlFor='textSecondary'>Text secondary</InputLabel>
                              <OutlinedInput
                              label="Text secondary"
                              value={textSecondary}
                              id='textSecondary' type='color'
                              onChange={(e) => setTextSecondary(e.target.value)}/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                              <Autocomplete
                                disablePortal
                                options={fonts}
                                sx={{ width: "100%", flex:1 }}
                                value={font}
                                onChange={(event, newValue) => {
                                  setFont(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Font" />}
                              />
                            </FormControl>
                          </Box>
                      </Stack>
                      <Button variant='contained' sx={{mt: 3, width: '50%'}} type='submit'
                      startIcon={loading && <CircularProgress size={20}
                      sx={{color: "background.default"}}/>}>
                        {loading ? "Creating your restaurant..." : "Create"}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Card>
            </Box> 
          </Modal>
          <Modal
          open={Boolean(selectedRestaurant)}
          onClose={() => setSelectedRestaurant(null)}>
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: 300, md: 800}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
            maxHeight: '80vh', overflowY: 'auto', borderRadius: 2}}
            onClose={() => setSelectedRestaurant(null)}>
              <Typography variant='h5' color='primary.main' fontWeight={600} textAlign={'center'}>
                Restaurant Details
              </Typography>
              <Box mt={2} display={'flex'} flexDirection={{xs: 'column', md: 'row'}} gap={2}
              justifyContent={"space-around"} alignItems={'flex-start'}>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={600} mb={1} textAlign={'center'}>
                    Main info:
                  </Typography>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='name'>Name</InputLabel>
                    <OutlinedInput readOnly
                    label="Name"
                    value={selectedRestaurant?.name}
                    id='name'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='slug'>SlugName</InputLabel>
                    <OutlinedInput readOnly
                    label="SlugName"
                    value={selectedRestaurant?.slug}
                    id='slug'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='address'>Address</InputLabel>
                    <OutlinedInput readOnly
                    label="Address"
                    value={selectedRestaurant?.address}
                    id='address'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='phone'>Phone</InputLabel>
                    <OutlinedInput readOnly
                    label="Phone"
                    value={selectedRestaurant?.phone}
                    id='phone'/>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={600} mb={1} textAlign={'center'}>
                    Theme info:
                  </Typography>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='primaryColor'>Primary color</InputLabel>
                    <OutlinedInput readOnly
                    label="Primary color"
                    value={selectedRestaurant?.theme.primaryColor}
                    id='primaryColor' type='color'
                    disabled/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='secondaryColor'>Secondary color</InputLabel>
                    <OutlinedInput readOnly
                    label="Secondary color"
                    value={selectedRestaurant?.theme.secondaryColor}
                    id='secondaryColor' type='color'
                    disabled/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='textPrimary'>Text primary</InputLabel>
                    <OutlinedInput readOnly
                    label="Text primary"
                    value={selectedRestaurant?.themetextPrimary}
                    id='textPrimary' type='color'
                    disabled/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='textSecondary'>Text secondary</InputLabel>
                    <OutlinedInput readOnly
                    label="Text secondary"
                    value={selectedRestaurant?.theme.textSecondary}
                    id='textSecondary' type='color'
                    disabled/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='font'>Font</InputLabel>
                    <OutlinedInput readOnly
                    label="Font"
                    value={selectedRestaurant?.theme.font}
                    id='font'/>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Modal>
      </Box>
    </Box>
    </>
  )
}

export default Restaurants_Owner