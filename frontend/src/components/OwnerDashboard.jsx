import { Autocomplete, Box, Divider, Drawer, Grid, IconButton, Paper, Skeleton, Stack, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar';
import { Add, Class, Fastfood, Menu, MenuBook, Storefront, Visibility } from '@mui/icons-material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import api from '../api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Swal from 'sweetalert2';

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

  const {t} = useTranslation();

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
              <Paper sx={{p: 3, width: '100%', height: '100%'}}
              elevation={1}>
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
              <Paper sx={{p: 3, width: '100%', height: '100%'}}
              elevation={1}>
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
              <Paper sx={{p: 3, width: '100%', height: '100%'}}
              elevation={1}>
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
              <Paper sx={{p: 3, width: '100%', height: '100%'}}
              elevation={1}>
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
                }
              }}> 
                <Add sx={{fontSize: 40, color: theme.palette.primary.main}}/>
                <Typography variant='h6' mt={1} color='text.primary'>
                  {t('ownerDashboard.createRestaurant')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 6, lg: 3}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'center', height: '100%',
                bgcolor: "background.paper",
                '&:hover': { cursor: 'pointer',
                  boxShadow: theme.shadows[6],
                  bgcolor: theme.palette.background.paper
                }
              }}> 
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
                }
              }}> 
                <Add sx={{fontSize: 40, color: theme.palette.primary.main}}/>
                <Typography variant='h6' mt={1} color='text.primary'>
                  {t('ownerDashboard.createMenu')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{xs: 6, lg: 3}}>
              <Paper elevation={1} sx={{p: 3, textAlign: 'center', height: '100%',
                bgcolor: "background.paper",
                '&:hover': { cursor: 'pointer',
                  boxShadow: theme.shadows[6],
                  bgcolor: theme.palette.background.paper
                }
              }}> 
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
            renderInput={(params) => <TextField {...params} label="Restaurant" />}
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
    </>
  )
}

export default OwnerDashboard