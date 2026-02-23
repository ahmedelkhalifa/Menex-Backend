import { Alert, Autocomplete, Box, Button, Card, Chip, CircularProgress, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, Modal, OutlinedInput, Paper, Skeleton, Stack, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar';
import { Add, ArrowForward, Class, Fastfood, Menu, MenuBook, Storefront, Visibility, Warning } from '@mui/icons-material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import api from '../api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import donerImage from "../assets/Beef-Doner-wrap-min-1024x683.jpg"

const OwnerDashboard = () => {
  const [open, setOpen] = useState(false);
  const [restaurantsCount, setRestaurantsCount] = useState(3);
  const [menusCount, setMenusCount] = useState(12);
  const [categoriesCount, setCategoriesCount] = useState(24);
  const [itemsCount, setItemsCount] = useState(125);
  const [views, setViews] = useState(25);
  const theme = useTheme();
  const [menusName, setMenusName] = useState([]);
  const [menusViews, setMenusViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantViews, setRestaurantViews] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
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
  const [exceedSize, setExceedSize] = useState(false);
    const fonts = [
      { name: 'Roboto', category: 'English & Türkçe' },
      { name: 'Open Sans', category: 'English & Türkçe' },
      { name: 'Montserrat', category: 'English & Türkçe' },
      { name: 'Poppins', category: 'English & Türkçe' },
      { name: 'Oswald', category: 'English & Türkçe' },
      { name: 'Amiri', category: 'Arabic' },
      { name: 'Cairo', category: 'Arabic' },
      { name: 'Almarai', category: 'Arabic' },
    ];
    const [font, setFont] = useState(fonts[0].name);
    const [fontBox, setFontBox] = useState(fonts[0]);
  
    // MUI requires the options to be sorted by the groupBy property
    const sortedFonts = fonts.sort((a, b) => -b.category.localeCompare(a.category));

  const {t} = useTranslation();

  const navigate = useNavigate();

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
            description: description
        };
        const jsonBlob = new Blob([JSON.stringify(restaurantData)], { type: "application/json" });
        formData.append("data", jsonBlob);
        if (logo){formData.append("logo", logo)};
        const response = await api.post("/restaurants", formData);
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
        setFont("Roboto");
        setFontBox(fonts.find(f => f.name === "Roboto"))
        setLogo(null);
        setExceedSize(false);
      }
    }

    function handleCloseCreate() {
    setOpenCreate(false);
    setName("");
    setAddress("");
    setPhone("");
    setMain("#6FBF73");
    setSecondary("#2E3A3A");
    setTextMain("#2E3A3A");
    setTextSecondary("#5F6F6F");
    setBackground("#F6F8F7");
    setBackgroundCard("#FFFFFF");
    setFont("Roboto");
    setFontBox(fonts.find(f => f.name === "Roboto"))
    setLogo(null);
    setExceedSize(false);
    setDescription("");
  };

  useEffect(() => {
      async function validateToken() {
        try {
          const response = await api.get("auth/validate");
        } catch (error) {
          console.error(error);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
      async function getData() {
        try {
          const response = await api.get("admin/owner-dashboard");
          setRestaurantsCount(response.data.restaurantsCount);
          setMenusCount(response.data.menusCount);
          setCategoriesCount(response.data.categoriesCount);
          setItemsCount(response.data.menuItemsCount);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: t("restaurants.errorAlert.title"),
            text: t("restaurants.errorAlert.message"),
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          })
        } finally {
          setLoading(false);
        }
      }
      validateToken();
      getData();
    }, []);

    useEffect(() => {
      async function getRestaurants() {
        try {
          const response = await api.get("admin/owner-dashboard/restaurants");
          setRestaurants(response.data);
          setSelectedRestaurant(Object.values(response.data)[0]);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: t("restaurants.errorAlert.title"),
            text: t("restaurants.errorAlert.message"),
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          })
        }
      }
      getRestaurants();
    }, []);

    useEffect(() => {
      async function getViews() {
        setLoading(true);
        try {
          const response = await api.get("admin/owner-dashboard/views");
          setViews(response.data);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: t("restaurants.errorAlert.title"),
            text: t("restaurants.errorAlert.message"),
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          })
        } finally {
          setLoading(false);
        }
      }
      getViews();
    }, []);
    useEffect(() => {
      if (!selectedRestaurant) return;
      async function getDetailedViews() {
        setLoading(true);
        try {
          const response = await api.get(`admin/owner-dashboard/views/${selectedRestaurant}`);
          setMenusName(Object.keys(response.data.perMenuViews));
          setMenusViews(Object.values(response.data.perMenuViews));
          setRestaurantViews(response.data.restaurantViews);
          setTotalViews(response.data.totalViews);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: t("restaurants.errorAlert.title"),
            text: t("restaurants.errorAlert.message"),
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          })
        } finally {
          setLoading(false);
        }
      }
      getDetailedViews();
    }, [selectedRestaurant]);

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
        <Box flex={5} p={5} mt={{xs: 8, md: 0}}>
          <Typography variant='h4' fontWeight={700} color='text.primary'
          textAlign={{xs: "center", md: "left"}}>
            {t('ownerDashboard.title')}
          </Typography>
          <Typography variant='body1' color='text.secondary'
          textAlign={{xs: "center", md: "left"}}>
            {t('ownerDashboard.description')}
          </Typography>
          <Divider sx={{borderWidth: 1, borderColor: "divider", mt: 2}}></Divider>
          <Grid container spacing={2} mt={3}>
            <Grid item size={{xs: 12, sm: 6, lg: 3}}>
              <Paper sx={{p: 3, width: '100%', height: '100%', border: 0, cursor: 'pointer',
                '&:hover': { transform: "translateY(-5px)",
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}55`},
                  transition: "0.3s ease"
              }}
              elevation={1} component={"button"} onClick={() => navigate("/owner-dashboard/restaurants")}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                  <Storefront sx={{color: theme.palette.background.default, fontSize: 50,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    p: 1
                  }}/>
                  <Typography variant='h4' fontWeight={700} color='text.primary'>
                    {loading ? (
                      <Skeleton width={"100%"} variant='text' />
                    ) :
                    restaurantsCount}
                  </Typography>
                </Box>
                <Typography variant='h6' color='text.secondary' mt={1} >
                  {t('ownerDashboard.restaurantsCountLabel')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 12, sm: 6, lg: 3}}>
              <Paper sx={{p: 3, width: '100%', height: '100%', border: 0, cursor: 'pointer',
                '&:hover': { transform: "translateY(-5px)",
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}55`},
                  transition: "0.3s ease"
              }}
              elevation={1} component={"button"} onClick={() => navigate("/owner-dashboard/menus-builder")}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                  <MenuBook sx={{color: theme.palette.background.default, fontSize: 50,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    p: 1
                  }}/>
                  <Typography variant='h4' fontWeight={700} color='text.primary'>
                    {loading ? (
                      <Skeleton width={"100%"} variant='text' />
                    ) :
                    menusCount}
                  </Typography>
                </Box>
                <Typography variant='h6' color='text.secondary' mt={1}>
                  {t('ownerDashboard.menusCountLabel')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 12, sm: 6, lg: 3}}>
              <Paper sx={{p: 3, width: '100%', height: '100%', border: 0, cursor: 'pointer',
                '&:hover': { transform: "translateY(-5px)",
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}55`},
                  transition: "0.3s ease"
              }}
              elevation={1} component={"button"} onClick={() => navigate("/owner-dashboard/menus-builder")}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                  <Class sx={{color: theme.palette.background.default, fontSize: 50,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    p: 1
                  }}/>
                  <Typography variant='h4' fontWeight={700} color='text.primary'>
                    {loading ? (
                      <Skeleton width={"100%"} variant='text' />
                    ) :
                    categoriesCount}
                  </Typography>
                </Box>
                <Typography variant='h6' color='text.secondary' mt={1}>
                  {t('ownerDashboard.categoriesCountLabel')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 12, sm: 6, lg: 3}}>
              <Paper sx={{p: 3, width: '100%', height: '100%', border: 0, cursor: 'pointer',
                '&:hover': { transform: "translateY(-5px)",
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}55`},
                  transition: "0.3s ease"
              }}
              elevation={1} component={"button"} onClick={() => navigate("/owner-dashboard/menus-builder")}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                  <Fastfood sx={{color: theme.palette.background.default, fontSize: 50,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    p: 1
                  }}/>
                  <Typography variant='h4' fontWeight={700} color='text.primary'>
                    {loading ? (
                      <Skeleton width={"100%"} variant='text' />
                    ) :
                    itemsCount}
                  </Typography>
                </Box>
                <Typography variant='h6' color='text.secondary' mt={1}>
                  {t('ownerDashboard.itemsCountLabel')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant='h4' fontWeight={700} color='text.primary' mt={5} 
          textAlign={{xs: 'center', md: 'left'}}>
            {t('ownerDashboard.quickActions')}
          </Typography>
          
          <Grid container spacing={2} mt={3}>
            <Grid item size={{xs: 6, lg: 3}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'center', height: '100%',
                bgcolor: "background.paper",
                '&:hover': { cursor: 'pointer',
                  boxShadow: theme.shadows[6],
                  bgcolor: theme.palette.background.paper
                }, border: 0, width: "100%"
              }} component={"button"} onClick={() => setOpenCreate(true)}> 
                <Add sx={{fontSize: 40, color: theme.palette.primary.main}}/>
                <Typography variant='h6' mt={1} color='text.primary'>
                  {t('ownerDashboard.createRestaurant')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 6, lg: 3}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'center', height: '100%', width: "100%",
                bgcolor: "background.paper",
                '&:hover': { cursor: 'pointer',
                  boxShadow: theme.shadows[6],
                  bgcolor: theme.palette.background.paper
                }, border: 0
              }} component={"button"} onClick={() => navigate("/owner-dashboard/restaurants")}>
                <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                <Typography variant='h6' mt={1} color='text.primary'>
                  {t('ownerDashboard.viewRestaurants')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 6, lg: 3}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'center', height: '100%',
                bgcolor: "background.paper",
                '&:hover': { cursor: 'pointer',
                  boxShadow: theme.shadows[6],
                  bgcolor: theme.palette.background.paper
                }, border: 0, width: "100%"
              }} component={"button"} onClick={() => navigate('menus-builder', { state: { openAdd: true } })}> 
                <Add sx={{fontSize: 40, color: theme.palette.primary.main}}/>
                <Typography variant='h6' mt={1} color='text.primary'>
                  {t('ownerDashboard.createMenu')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 6, lg: 3}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'center', height: '100%', width: "100%",
                bgcolor: "background.paper",
                '&:hover': { cursor: 'pointer',
                  boxShadow: theme.shadows[6],
                  bgcolor: theme.palette.background.paper
                }, border: 0
              }} component={"button"} onClick={() => navigate("/owner-dashboard/menus-builder")}> 
                <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                <Typography variant='h6' mt={1} color='text.primary'>
                  {t('ownerDashboard.viewMenus')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant='h4' fontWeight={700} color='text.primary' mt={5} 
          textAlign={{xs: 'center', md: 'left'}}>
            {t('ownerDashboard.views')}
          </Typography>

          <Grid container spacing={2} mt={3}>
            <Grid size={{xs: 12, md: 4}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'left',
                bgcolor: "background.paper", display: 'flex', gap: 2,
                alignItems: 'center'
              }}> 
                  <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                  <Box>
                    <Typography variant='h6' color='text.primary' display={"block"}>
                      {t('ownerDashboard.totalViewsLabel')} 
                    </Typography>
                    <Typography variant='h4' fontWeight={800} display={'block'}>
                      {views.totalViews}
                    </Typography>
                  </Box>
              </Paper>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'left',
                bgcolor: "background.paper", display: 'flex', gap: 2,
                alignItems: 'center'
              }}> 
                  <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                  <Box>
                    <Typography variant='h6' color='text.primary'>
                      {t('ownerDashboard.menusViews')} 
                    </Typography>
                    <Typography variant='h4' fontWeight={800} >
                      {views.menusViews}
                    </Typography>
                  </Box>
              </Paper>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'left',
                bgcolor: "background.paper", display: 'flex', gap: 2,
                alignItems: 'center'
              }}> 
                  <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                  <Box>
                    <Typography variant='h6' color='text.primary'>
                      {t('ownerDashboard.restaurantsViews')} 
                    </Typography>
                    <Typography variant='h4' fontWeight={800} >
                      {views.restaurantViews}
                    </Typography>
                  </Box>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant='h4' fontWeight={700} color='text.primary' mt={5} 
          textAlign={{xs: 'center', md: 'left'}}>
            {t('ownerDashboard.viewsDetails')}
          </Typography>

          <Autocomplete
            disablePortal
            options={Object.keys(restaurants)}
            value={
              Object.keys(restaurants).find(
                (name) => restaurants[name] === selectedRestaurant
              ) || null
            }
            onChange={(e, v) => {
              console.log(selectedRestaurant)
              setSelectedRestaurant(restaurants[v]);
            }}
            sx={{ mt: 3, bgcolor: "background.paper"}}
            renderInput={(params) => <TextField {...params} label={t('ownerDashboard.restaurant')} />}
            fullWidth
          />

          <Grid container spacing={2} mt={3}>
            <Grid size={{xs: 12, sm: 6}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'left',
                bgcolor: "background.paper", display: 'flex', gap: 2,
                alignItems: 'center'
              }}> 
                  <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                  <Box>
                    <Typography variant='h6' color='text.primary' display={"block"}>
                      {t('ownerDashboard.totalViewsLabel')} 
                    </Typography>
                    <Typography variant='h4' fontWeight={800} display={'block'}>
                      {totalViews}
                    </Typography>
                  </Box>
              </Paper>
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'left',
                bgcolor: "background.paper", display: 'flex', gap: 2,
                alignItems: 'center'
              }}> 
                  <Visibility sx={{fontSize: 40, color: theme.palette.warning.main}}/>
                  <Box>
                    <Typography variant='h6' color='text.primary'>
                      {t('ownerDashboard.restaurantViews')} 
                    </Typography>
                    <Typography variant='h4' fontWeight={800} >
                      {restaurantViews}
                    </Typography>
                  </Box>
              </Paper>
            </Grid>
          </Grid>

              <Paper elevation={1} sx={{bgcolor: "background.paper",
                p: 3, mt: 3
              }}>
                <Typography variant='h5' textAlign={'center'}>
                  {t("ownerDashboard.chartTitle")}
                </Typography>
                <Box display={{ xs: "none", sm: "block" }}>
                  <BarChart
                    xAxis={[
                      {
                        data: menusName ?? [],
                        scaleType: "band",
                        categoryGapRatio: 0.8,
                      },
                    ]}
                    series={[
                      {
                        data: menusViews ?? [],
                        color: theme.palette.primary.main,
                      },
                    ]}
                    height={350}
                  />
                </Box>

                {/* Mobile: horizontal bars */}
                <Box display={{ xs: "block", sm: "none" }}>
                  <BarChart
                    yAxis={[
                      {
                        data: menusName ?? [],
                        scaleType: "band",
                        categoryGapRatio: 0.8,
                      },
                    ]}
                    xAxis={[
                      {
                        min: 0,
                      },
                    ]}
                    series={[
                      {
                        data: menusViews ?? [],
                        color: theme.palette.primary.main,
                      },
                    ]}
                    layout="horizontal"
                    height={350}
                  />
                </Box>
              </Paper>
        </Box>
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
                          multiline rows={4}
                          value={description}
                          autoComplete='off'
                          onChange={(e) => setDescription(e.target.value)}
                          />
                        </FormControl>
                        <Button variant='contained' fullWidth sx={{mt: 2, bgcolor: "secondary.main", color: "background.default", height: "50px"}} component="label">
                          {logo ? logo.name : t('restaurants.create.logoLabel')}
                          <input type="file"
                          hidden
                          accept='image/*'
                          onChange={handleLogoChange} />
                        </Button>
                        {exceedSize && <Alert icon={<Warning fontSize='inherit'/>} severity="error" sx={{ my: 2,
                        bgcolor: "error.light",
                        color: mode === "dark" ? "#2c0b0a" : '#EF5350',
                        '& .MuiAlert-icon': {
                        color: mode === "dark" ? "#2c0b0a" : '#EF5350', // Keeps the icon the bright red you like
                        }}}>
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
                                sx={{ width: "100%", flex: 1 }}
                                options={sortedFonts}
                                
                                // 1. Tell MUI what to display in the list
                                getOptionLabel={(option) => option.name} 
                                
                                // 2. Tell MUI how to group the sections
                                groupBy={(option) => option.category} 
                                
                                value={fontBox}
                                onChange={(event, newValue) => {
                                  setFontBox(newValue);
                                  setFont(newValue.name); 
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
    </>
  )
}

export default OwnerDashboard