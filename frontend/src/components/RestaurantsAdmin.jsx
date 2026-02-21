import { Add, ArrowForward, Close, Delete, Edit, Info, Menu, SentimentDissatisfied, Translate, Update, Warning } from '@mui/icons-material'
import { Alert, AppBar, Autocomplete, Box, Button, Card, Chip, CircularProgress, debounce, Dialog, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, List, ListItemButton, ListItemText, Modal, OutlinedInput, Paper, Select, Skeleton, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar'
import { SketchPicker } from 'react-color'
import api from '../api'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import donerImage from "../assets/Beef-Doner-wrap-min-1024x683.jpg"
import Sidebar from './Sidebar'

const Restaurants_Owner = () => {
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [main, setMain] = useState("#6FBF73");
  const [secondary, setSecondary] = useState("#2E3A3A");
  const [textMain, setTextMain] = useState("#2E3A3A");
  const [textSecondary, setTextSecondary] = useState("#5F6F6F");
  const [background, setBackground] = useState("#F6F8F7");
  const [backgroundCard, setBackgroundCard] = useState("#FFFFFF");
  const [logo, setLogo] = useState(null);
  const [font, setFont] = useState("roboto");
  const [restaurants, setRestaurants] = useState([]);
  const [exceedSize, setExceedSize] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const fonts = ["poppins", "roboto", "montserrat", "open sans", "oswald"];
  const theme = useTheme();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const SkeletonRow = () => (
        <TableRow>
          <TableCell width={"40%"}><Skeleton width="100%" /></TableCell>
          <TableCell width={"40%"} sx={{display: {xs: "none", md: "table-cell"}}}><Skeleton width="100%" /></TableCell>
          <TableCell align='center'><Skeleton width="100%"/></TableCell>
        </TableRow>
      );
  const filteredRestauratns = restaurants.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || r.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(); 
      const restaurantData = {
          name: name,
          address: address,
          phone: phone,
          primaryColor: main,
          secondaryColor: secondary,
          textPrimary: textMain,
          textSecondary: textSecondary,
          background: background,
          backgroundCard: backgroundCard,
          font: font,
          userId: selectedUserId,
          description: description
      };
      const jsonBlob = new Blob([JSON.stringify(restaurantData)], { type: "application/json" });
      formData.append("data", jsonBlob);
      if (logo){formData.append("logo", logo)};
      const response = await api.post("/restaurants", formData);
      setRestaurants((r) => [...r, response.data]);
      Swal.fire({
        title: t("restaurants.create.successTitle"),
        text: t("restaurants.create.createSuccessMessage"),
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || t("restaurants.errorAlert.createErrorMessage");
      Swal.fire({
        title: t("restaurants.errorAlert.title"),
        text: message,
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
      setOpenCreate(false);
      setSelectedRestaurant(null);
      setName("");
      setAddress("");
      setPhone("");
      setMain("#6FBF73");
      setSecondary("#2E3A3A");
      setTextMain("#2E3A3A");
      setTextSecondary("#5F6F6F");
      setBackground("#F6F8F7");
      setBackgroundCard("#FFFFFF");
      setFont("roboto");
      setLogo(null);
      setExceedSize(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(); 
      const restaurantData = {
          name: name,
          address: address,
          phone: phone,
          primaryColor: main,
          secondaryColor: secondary,
          textPrimary: textMain,
          textSecondary: textSecondary,
          background: background,
          backgroundCard: backgroundCard,
          font: font,
          description: description
      };
      const jsonBlob = new Blob([JSON.stringify(restaurantData)], { type: "application/json" });
      formData.append("data", jsonBlob);
      if (logo) formData.append("logo", logo);
      const response = await api.put(`/restaurants/${selectedRestaurant.id}`, formData);
      setRestaurants(prev => prev.map(
        r => r.id === selectedRestaurant.id ? response.data : r
      ));
      Swal.fire({
        title: t("restaurants.create.successTitle"),
        text: t("restaurants.create.updateSuccessMessage"),
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || t("restaurants.errorAlert.updateErrorMessage");
      Swal.fire({
        title: t("restaurants.errorAlert.title"),
        text: message,
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
      setOpenUpdate(false);
      setSelectedRestaurant(null);
      setName("");
      setAddress("");
      setPhone("");
      setMain("#6FBF73");
      setSecondary("#2E3A3A");
      setTextMain("#2E3A3A");
      setTextSecondary("#5F6F6F");
      setBackground("#F6F8F7");
      setBackgroundCard("#FFFFFF");
      setFont("roboto");
      setLogo(null);
      setExceedSize(false);
    }
  }

  async function handleDelete(id) {
    Swal.fire({
      title: t('restaurants.deleteAlert.title'),
      text: t('restaurants.deleteAlert.message'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      confirmButtonText: t('restaurants.deleteAlert.confirmButtonText'),
      cancelButtonText: t('restaurants.deleteAlert.cancelButtonText'),
      background: theme.palette.background.default,
      color: theme.palette.text.primary
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/restaurants/${id}`);
          setRestaurants(prev => prev.filter(r => r.id !== id));
          Swal.fire({
            title: t('restaurants.deleteAlert.deletedTitle'),
            text: t('restaurants.deleteAlert.deletedMessage'),
            icon: "success",
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          });
        } catch (error) {
          console.error(error);
          const message = error.response?.data?.message || t('restaurants.deleteAlert.errorMessage');
          Swal.fire({
            title: t('restaurants.deleteAlert.errorTitle'),
            text: message,
            icon: "error",
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          });
        }
      }
    });
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
    setSelectedRestaurant(null);
    setName("");
    setAddress("");
    setPhone("");
    setMain("#6FBF73");
    setSecondary("#2E3A3A");
    setTextMain("#2E3A3A");
    setTextSecondary("#5F6F6F");
    setBackground("#F6F8F7");
    setBackgroundCard("#FFFFFF");
    setFont("roboto");
    setLogo(null);
    setExceedSize(false);
    setDescription("");
  };

  function handleCloseUpdate() {
    setOpenUpdate(false);
    setSelectedRestaurant(null);
    setName("");
    setAddress("");
    setPhone("");
    setMain("#6FBF73");
    setSecondary("#2E3A3A");
    setTextMain("#2E3A3A");
    setTextSecondary("#5F6F6F");
    setBackground("#F6F8F7");
    setBackgroundCard("#FFFFFF");
    setFont("roboto");
    setLogo(null);
    setExceedSize(false);
    setDescription("");
  }

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await api.get("restaurants/admin");
        setRestaurants(response.data);
      } catch(error) {
        console.error(error);
        Swal.fire({
          title: t('restaurants.errorAlert.title'),
          text: t('restaurants.errorAlert.message'),
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
    async function loadUsers() {
      try {
        setLoading(true);
        const response = await api.get("users/owners");
        setUsers(response.data);
      } catch (error) {
        console.error(error.response?.message)
      } finally {
        setLoading(false);
      }
    }
    validateToken();
    loadRestaurants();
    loadUsers();
  }, []);

  const {t} = useTranslation();

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
          <Sidebar view={"phone"} subname={"Super Admin"}/>
        </Drawer>
      </Box>
      <Box display={'flex'} bgcolor={"background.default"} gap={2}>
        <Sidebar subname={"Super Admin"}/>
        <Box flex={5} p={5} mt={{xs: 8, md: 0}}>
          <Stack justifyContent={'space-between'} alignItems={'center'} direction={{xs: 'column', md:'row'}}>
            <Box>
              <Typography variant='h4' fontWeight={700} color='text.primary'>
                All Restaurants
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Perform all the operations on all the restaurants in the system.
              </Typography>
            </Box>
            <Button variant='contained' sx={{width: "300px", mt: {xs: 2, md: 0}, height: "40px"}}
            onClick={() => setOpenCreate(true)} startIcon={<Add/>}>
              {t('restaurants.createButton')}
            </Button>
          </Stack>
          <Box mt={3}>
            <TextField
            label={t('restaurants.search')}
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
                      align='center'>owner email</TableCell>
                      <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}
                      align='center'>{t('restaurants.table.name')}</TableCell>
                      <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper", display: {xs: "none", md: "table-cell"}}} align='center'>{t('restaurants.table.slug')}</TableCell>
                      <TableCell align='center' sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}>{t('restaurants.table.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      Array.from(new Array(5)).map((_, i) => <SkeletonRow key={i} />)
                    ) : (
                      filteredRestauratns.map((r) => (
                        <TableRow key={r.id}>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary"}}
                        align='center'>{r.ownerEmail}</TableCell>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary"}}
                        align='center'>{r.name}</TableCell>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary", display: {xs: "none", md: "table-cell"}}}
                        align='center'>{r.slug}</TableCell>
                        <TableCell sx={{fontWeight: 500, bgcolor: "background.default", color: "text.secondary"}}
                        align='center'>
                          <Tooltip title={t('restaurants.table.details')}>
                            <IconButton onClick={() => {
                              setSelectedRestaurant(r);
                              setOpenDetails(true);
                            }}>
                              <Info sx={{color: "text.secondary"}}/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('restaurants.table.edit')}>
                            <IconButton onClick={() => {
                              setSelectedRestaurant(r);
                              setOpenUpdate(true);
                              setName(r.name);
                              setAddress(r.address);
                              setPhone(r.phone);
                              setMain(r.theme.primaryColor);
                              setSecondary(r.theme.secondaryColor);
                              setTextMain(r.theme.textPrimary);
                              setTextSecondary(r.theme.textSecondary);
                              setBackground(r.theme.background);
                              setBackgroundCard(r.theme.backgroundCard);
                              setFont(r.theme.font);
                              setDescription(r.description);
                            }}>
                              <Edit sx={{color: "primary.dark"}}/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('restaurants.table.delete')}>
                            <IconButton onClick={() => {
                              handleDelete(r.id);
                            }}>
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
                  <SentimentDissatisfied sx={{color: 'text.secondary', mr: 2, fontSize: "40px"}} /> {t('restaurants.noData')}
                </Typography>
                <Button variant='contained' sx={{display: 'flex', alignSelf: 'center', justifySelf: 'center', mt: 1, bgcolor: "secondary.main", height: "40px"}}
                onClick={() => setOpenCreate(true)} startIcon={<Add/>}>
                  {t('restaurants.createButton')}
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
                width: {xs: '80vw', md: '1000px', lg: "1400px"},
                maxHeight: '88vh',
                overflowY: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <Typography variant='h4' fontWeight={600} color='primary.main' textAlign={'center'}>
                  {t('restaurants.create.title')}
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
                              {t('restaurants.create.mainLabel')}
                            </Typography>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='name'>{t('restaurants.create.nameLabel')}</InputLabel>
                              <OutlinedInput id="name"
                              label={t('restaurants.create.nameLabel')} fullWidth
                              autoComplete='off'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='address'>{t('restaurants.create.addressLabel')}</InputLabel>
                              <OutlinedInput id="address"
                              label={t('restaurants.create.addressLabel')} fullWidth type='address'
                              autoComplete='off'
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='phone'>{t('restaurants.create.phoneLabel')}</InputLabel>
                              <OutlinedInput id="phone"
                              label={t('restaurants.create.phoneLabel')} fullWidth type='tel'
                              value={phone}
                              autoComplete='off'
                              onChange={(e) => setPhone(e.target.value)}
                              inputProps={{ pattern: "[0-9+ ]*" }}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='desc'>{t('restaurants.create.description')}</InputLabel>
                              <OutlinedInput id="desc"
                              label={t('restaurants.create.description')} fullWidth type='text'
                              value={description}
                              autoComplete='off'
                              onChange={(e) => setDescription(e.target.value)}
                              multiline rows={4}/>
                            </FormControl>
                            {/* <Select sx={{mt: 2}} fullWidth value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}>
                              {users.map(u => (
                                <MenuItem key={u.id} value={u.id}>{u.email}</MenuItem>
                              ))}
                            </Select> */}
                            <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                <Autocomplete
                                disablePortal
                                options={users}
                                getOptionLabel={(option) => option.email}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                
                                value={users.find(user => user.id === selectedUserId) || null} 
                                
                                onChange={(event, newValue) => {
                                  setSelectedUserId(newValue ? newValue.id : null);
                                }}
                                
                                renderInput={(params) => <TextField {...params} label="owner email" />}
                              />
                            </FormControl>
                            <Button variant='contained' fullWidth sx={{mt: 2, bgcolor: "secondary.main", color: "background.default", height: "50px"}} component="label">
                              {logo ? logo.name : t('restaurants.create.logoLabel')}
                              <input type="file"
                              hidden
                              accept='image/*'
                              onChange={handleLogoChange} />
                            </Button>
                            {exceedSize && <Alert icon={<Warning fontSize='inherit'/>} severity='error' sx={{width: '100%', mt: 2}}>
                              {t('restaurants.create.alert')}</Alert>}
                          </Box>
                          <Stack flexDirection={{xs: "column", md: "row"}} gap={2} alignItems={'flex-start'} flex={2}>
                          <Box flex={1} p={3} px={{xs: 0, md: 3}} sx={{width: '100%'}}>
                            <Typography variant='h5' textAlign={'center'}>
                              {t('restaurants.create.themeLabel')}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='primary'>{t('restaurants.create.primaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.primaryColorLabel')}
                                  value={main}
                                  id='primary' type='color'
                                  onChange={(e) => setMain(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='secondary'>{t('restaurants.create.secondaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.secondaryColorLabel')}
                                  value={secondary}
                                  id='secondary' type='color'
                                  onChange={(e) => setSecondary(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='textPrimary'>{t('restaurants.create.textPrimaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.textPrimaryColorLabel')}
                                  value={textMain}
                                  id='textPrimary' type='color'
                                  onChange={(e) => setTextMain(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='textSecondary'>{t('restaurants.create.textSecondaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.textSecondaryColorLabel')}
                                  value={textSecondary}
                                  id='textSecondary' type='color'
                                  onChange={(e) => setTextSecondary(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='background'>{t('restaurants.create.backgroundLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.backgroundLabel')}
                                  value={background}
                                  id='background' type='color'
                                  onChange={(e) => setBackground(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='background'>{t('restaurants.create.backgroundCardLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.backgroundCardLabel')}
                                  value={backgroundCard}
                                  id='backgroundCard' type='color'
                                  onChange={(e) => setBackgroundCard(e.target.value)}/>
                                </FormControl>
                              </Grid>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <Autocomplete
                                    disablePortal
                                    options={fonts}
                                    sx={{ width: "100%", flex:1 }}
                                    value={font}
                                    onChange={(event, newValue) => {
                                      setFont(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label={t('restaurants.create.fontLabel')} />}
                                  />
                                </FormControl>
                            </Grid>
                          </Box>
                          <Box flex={1}>
                          <Typography variant='h5' textAlign={'center'} mt={3}>
                              {t('restaurants.create.previewLabel')}
                            </Typography>
                            <Paper elevation={1} sx={{width: "100%", position: 'relative', overflow: 'hidden', cursor: 'pointer', mt: 2, bgcolor: backgroundCard,
                            }}>
                                <Chip label={t('restaurants.create.active')}  sx={{position: 'absolute', top: "5%", right: "5%", fontWeight: 600,
                                    bgcolor: background,
                                    color: main,
                                    fontSize: "16px",
                                    borderRadius: 1,
                                    fontFamily: font
                                }}/>
                                <Box
                                component={"img"}
                                src={donerImage}
                                width={"100%"} height={"250px"}
                                sx={{objectFit: "cover"}}/>
                                <Box px={4} minHeight={{xs: "75px", md: "150px"}} mt={2}>
                                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"}>
                                        <Typography variant='h5' fontWeight={600} color={textMain} textAlign={'center'} fontSize={{xs: 18, md: 24}} fontFamily={font}>
                                            {t('restaurants.create.menuName')}
                                        </Typography>
                                        <Chip label={t('restaurants.create.menuItems')} sx={{fontFamily: font}}/>
                                    </Box>
                                    <Typography variant='body1' color={textSecondary} 
                                    textAlign={{xs: 'center', md: 'left'}} mt={2}
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 4,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }} fontSize={{xs: 12, md: 14}} fontFamily={font}>
                                        {t('restaurants.create.menuDescription')}
                                    </Typography>
                                </Box>
                                <Box px={4} py={3}>
                                    <Button endIcon={<ArrowForward/>} fullWidth variant='contained'
                                    sx={{color: background, height: "40px", bgcolor: main, fontFamily: font}}>
                                        {t('restaurants.create.menuViewButton')}
                                    </Button>
                                </Box>
                            </Paper>
                          </Box>
                          </Stack>
                      </Stack>
                      <Button variant='contained' sx={{mt: 3, width: '50%', height: "50px"}} type='submit'
                      startIcon={loading ? <CircularProgress size={20}
                      sx={{color: background}}/> : <Add/>} disabled={loading}>
                        {loading ? t('restaurants.create.submitButtonLoading') : t('restaurants.create.submitButton')}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Card>
            </Box> 
          </Modal>
          <Modal
          open={openUpdate}
          onClose={handleCloseUpdate}>
            <Box
            sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: "100vh"
          }} onClick={handleCloseUpdate}>
              <Card
              sx={{
                p: 5,
                width: {xs: '80vw', md: '1000px', lg: "1400px"},
                maxHeight: '88vh',
                overflowY: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <Typography variant='h4' fontWeight={600} color='primary.main' textAlign={'center'}>
                  {t('restaurants.create.update')}
                </Typography>
                <Box mt={3}>
                  <form action="#" onSubmit={handleUpdate}>
                    <Box textAlign={'center'}>
                      <Stack direction={{xs: 'column', md: 'row'}} gap={{xs: 1, md: 2}}
                      divider={
                        <Divider flexItem sx={{borderWidth: 0.5, borderColor: "divider"}}/>
                      } justifyContent={'space-between'} alignItems={'flex-start'}>
                          <Box flex={1} p={3} px={{xs: 0, md: 3}}>
                            <Typography variant='h5' textAlign={'center'}>
                              {t('restaurants.create.mainLabel')}
                            </Typography>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='name'>{t('restaurants.create.nameLabel')}</InputLabel>
                              <OutlinedInput id="name"
                              label={t('restaurants.create.nameLabel')} fullWidth
                              autoComplete='off'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='address'>{t('restaurants.create.addressLabel')}</InputLabel>
                              <OutlinedInput id="address"
                              label={t('restaurants.create.addressLabel')} fullWidth type='address'
                              autoComplete='off'
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='phone'>{t('restaurants.create.phoneLabel')}</InputLabel>
                              <OutlinedInput id="phone"
                              label={t('restaurants.create.phoneLabel')} fullWidth type='tel'
                              value={phone}
                              autoComplete='off'
                              onChange={(e) => setPhone(e.target.value)}
                              inputProps={{ pattern: "[0-9+ ]*" }}
                              required/>
                            </FormControl>
                            <FormControl fullWidth sx={{mt: 2}}>
                              <InputLabel htmlFor='desc'>{t('restaurants.create.description')}</InputLabel>
                              <OutlinedInput id="desc"
                              label={t('restaurants.create.description')} fullWidth type='text'
                              value={description}
                              autoComplete='off'
                              onChange={(e) => setDescription(e.target.value)}
                              multiline rows={4}
                              />
                            </FormControl>
                            <Button variant='contained' fullWidth sx={{mt: 2, bgcolor: "secondary.main", color: "background.default", height: "50px"}} component="label">
                              {logo ? logo.name : t('restaurants.create.logoLabel')}
                              <input type="file"
                              hidden
                              accept='image/*'
                              onChange={handleLogoChange} />
                            </Button>
                            {exceedSize && <Alert icon={<Warning fontSize='inherit'/>} severity='error' sx={{width: '100%', mt: 2}}>
                              {t('restaurants.create.alert')}</Alert>}
                          </Box>
                          <Stack flexDirection={{xs: "column", md: "row"}} gap={2} alignItems={'flex-start'} flex={2}>
                          <Box flex={1} p={3} px={{xs: 0, md: 3}} sx={{width: '100%'}}>
                            <Typography variant='h5' textAlign={'center'}>
                              {t('restaurants.create.themeLabel')}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='primary'>{t('restaurants.create.primaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.primaryColorLabel')}
                                  value={main}
                                  id='primary' type='color'
                                  onChange={(e) => setMain(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='secondary'>{t('restaurants.create.secondaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.secondaryColorLabel')}
                                  value={secondary}
                                  id='secondary' type='color'
                                  onChange={(e) => setSecondary(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='textPrimary'>{t('restaurants.create.textPrimaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.textPrimaryColorLabel')}
                                  value={textMain}
                                  id='textPrimary' type='color'
                                  onChange={(e) => setTextMain(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='textSecondary'>{t('restaurants.create.textSecondaryColorLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.textSecondaryColorLabel')}
                                  value={textSecondary}
                                  id='textSecondary' type='color'
                                  onChange={(e) => setTextSecondary(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='background'>{t('restaurants.create.backgroundLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.backgroundLabel')}
                                  value={background}
                                  id='background' type='color'
                                  onChange={(e) => setBackground(e.target.value)}/>
                                </FormControl>
                              </Grid>
                              <Grid size={4}>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <InputLabel htmlFor='background'>{t('restaurants.create.backgroundCardLabel')}</InputLabel>
                                  <OutlinedInput
                                  label={t('restaurants.create.backgroundCardLabel')}
                                  value={backgroundCard}
                                  id='backgroundCard' type='color'
                                  onChange={(e) => setBackgroundCard(e.target.value)}/>
                                </FormControl>
                              </Grid>
                                <FormControl fullWidth sx={{mt: {xs: 3, md: 2}}}>
                                  <Autocomplete
                                    disablePortal
                                    options={fonts}
                                    sx={{ width: "100%", flex:1 }}
                                    value={font}
                                    onChange={(event, newValue) => {
                                      setFont(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label={t('restaurants.create.fontLabel')} />}
                                  />
                                </FormControl>
                            </Grid>
                          </Box>
                          <Box flex={1}>
                          <Typography variant='h5' textAlign={'center'} mt={3}>
                              {t('restaurants.create.previewLabel')}
                            </Typography>
                            <Paper elevation={1} sx={{width: "100%", position: 'relative', overflow: 'hidden', cursor: 'pointer', mt: 2, bgcolor: backgroundCard,
                            }}>
                                <Chip label={t('restaurants.create.active')}  sx={{position: 'absolute', top: "5%", right: "5%", fontWeight: 600,
                                    bgcolor: background,
                                    color: main,
                                    fontSize: "16px",
                                    borderRadius: 1,
                                    fontFamily: font
                                }}/>
                                <Box
                                component={"img"}
                                src={donerImage}
                                width={"100%"} height={"250px"}
                                sx={{objectFit: "cover"}}/>
                                <Box px={4} minHeight={{xs: "75px", md: "150px"}} mt={2}>
                                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"}>
                                        <Typography variant='h5' fontWeight={600} color={textMain} textAlign={'center'} fontSize={{xs: 18, md: 24}} fontFamily={font}
                                        sx={{color: textMain}}>
                                            {t('restaurants.create.menuName')}
                                        </Typography>
                                        <Chip label={t('restaurants.create.menuItems')} sx={{fontFamily: font}}/>
                                    </Box>
                                    <Typography variant='body1' color={textSecondary} 
                                    textAlign={{xs: 'center', md: 'left'}} mt={2}
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 4,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }} fontSize={{xs: 12, md: 14}} fontFamily={font}>
                                        {t('restaurants.create.menuDescription')}
                                    </Typography>
                                </Box>
                                <Box px={4} py={3}>
                                    <Button endIcon={<ArrowForward/>} fullWidth variant='contained'
                                    sx={{color: background, height: "40px", bgcolor: main, fontFamily: font}}>
                                        {t('restaurants.create.menuViewButton')}
                                    </Button>
                                </Box>
                            </Paper>
                          </Box>
                          </Stack>
                      </Stack>
                      <Button variant='contained' sx={{mt: 3, width: '50%', height: "50px"}} type='submit'
                      startIcon={loading ? <CircularProgress size={20}
                      sx={{color: "background.default"}}/> : <Update/>} disabled={loading}>
                        {loading ? t('restaurants.create.updateButtonLoading') : t('restaurants.create.updateButton')}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Card>
            </Box> 
          </Modal>
          <Modal
          open={openDetails}
          onClose={() => {
            handleCloseUpdate();
            setOpenDetails(false);
          }}>
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: 300, md: 800}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
            maxHeight: '80vh', overflowY: 'auto', borderRadius: 2}}
            onClose={() => setSelectedRestaurant(null)}>
              <Typography variant='h5' color='primary.main' fontWeight={600} textAlign={'center'}>
                {t('restaurants.details.title')}
              </Typography>
              <Box mt={2} display={'flex'} flexDirection={{xs: 'column', md: 'row'}} gap={2}
              justifyContent={"space-around"} alignItems={'flex-start'}>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={600} mb={1} textAlign={'center'}>
                    {t('restaurants.details.mainInfo')}
                  </Typography>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='name'>{t('restaurants.details.nameLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.nameLabel')}
                    value={selectedRestaurant?.name}
                    id='name'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='slug'>{t('restaurants.details.slugLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.slugLabel')}
                    value={selectedRestaurant?.slug}
                    id='slug'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='address'>{t('restaurants.details.addressLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.addressLabel')}
                    value={selectedRestaurant?.address}
                    id='address'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='phone'>{t('restaurants.details.phoneLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.phoneLabel')}
                    value={selectedRestaurant?.phone}
                    id='phone'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='ownermail'>Owner Email</InputLabel>
                    <OutlinedInput readOnly
                    label="Owner Email"
                    value={selectedRestaurant?.ownerEmail}
                    id='ownermail'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='desc'>Description</InputLabel>
                    <OutlinedInput readOnly
                    label="Description"
                    value={selectedRestaurant?.description}
                    id='desc'
                    multiline rows={4}/>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={600} mb={1} textAlign={'center'}>
                    {t('restaurants.details.menusInfo')}
                  </Typography>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='menusCount'>{t('restaurants.details.menusCountLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.menusCountLabel')}
                    value={selectedRestaurant?.menusCount}
                    id='menusCount'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='categoriesCount'>{t('restaurants.details.categoriesCountLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.categoriesCountLabel')}
                    value={selectedRestaurant?.categoriesCount}
                    id='categoriesCount'/>
                  </FormControl>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='itemsCount'>{t('restaurants.details.itemsCountLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.itemsCountLabel')}
                    value={selectedRestaurant?.menuItemsCount}
                    id='itemsCount'/>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={600} mb={1} textAlign={'center'}>
                    {t('restaurants.details.themeInfo')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor='primaryColor'>{t('restaurants.details.primaryColorLabel')}</InputLabel>
                        <OutlinedInput readOnly
                        label={t('restaurants.details.primaryColorLabel')}
                        value={selectedRestaurant?.theme.primaryColor}
                        id='primaryColor' type='color'
                        disabled/>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor='secondaryColor'>{t('restaurants.details.secondaryColorLabel')}</InputLabel>
                        <OutlinedInput readOnly
                        label={t('restaurants.details.secondaryColorLabel')}
                        value={selectedRestaurant?.theme.secondaryColor}
                        id='secondaryColor' type='color'
                        disabled/>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor='textPrimary'>{t('restaurants.details.textPrimaryColorLabel')}</InputLabel>
                        <OutlinedInput readOnly
                        label={t('restaurants.details.textPrimaryColorLabel')}
                        value={selectedRestaurant?.theme.textPrimary}
                        id='textPrimary' type='color'
                        disabled/>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor='textSecondary'>{t('restaurants.details.textSecondaryColorLabel')}</InputLabel>
                        <OutlinedInput readOnly
                        label={t('restaurants.details.textSecondaryColorLabel')}
                        value={selectedRestaurant?.theme.textSecondary}
                        id='textSecondary' type='color'
                        disabled/>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor='background'>{t('restaurants.create.backgroundLabel')}</InputLabel>
                        <OutlinedInput readOnly
                        label={t('restaurants.create.backgroundLabel')}
                        value={selectedRestaurant?.theme.background}
                        id='background' type='color'
                        disabled/>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor='backgroundCard'>{t('restaurants.create.backgroundCardLabel')}</InputLabel>
                        <OutlinedInput readOnly
                        label={t('restaurants.create.backgroundCardLabel')}
                        value={selectedRestaurant?.theme.backgroundCard}
                        id='backgroundCard' type='color'
                        disabled/>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel htmlFor='font'>{t('restaurants.details.fontLabel')}</InputLabel>
                    <OutlinedInput readOnly
                    label={t('restaurants.details.fontLabel')}
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