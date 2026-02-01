import { Box, Divider, Drawer, Grid, IconButton, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar';
import { Add, Class, Fastfood, Menu, MenuBook, Storefront, Visibility } from '@mui/icons-material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import api from '../api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const OwnerDashboard = () => {
  const [open, setOpen] = useState(false);
  const [restaurantsCount, setRestaurantsCount] = useState(3);
  const [menusCount, setMenusCount] = useState(12);
  const [categoriesCount, setCategoriesCount] = useState(24);
  const [itemsCount, setItemsCount] = useState(125);
  const theme = useTheme();
  const [data, setData] = useState([
    {name: "Ates kebab", menus: 4},
    {name: "Fornello pizza", menus: 6},
    {name: "FoodCourt", menus: 2},
  ]);
  const [loading, setLoading] = useState(true);

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

          <Grid container spacing={2} mt={3}>
            <Grid size={{xs: 12, md: 6}}>
              <Paper elevation={5} sx={{bgcolor: "background.paper",
                p: 3, height: '100%'
              }}>
                <Typography variant='h5' textAlign={'center'}>
                  Restaurants VS Menus
                </Typography>
                <Box sx={{ width: '100%', height: 300 }} mt={5}>
                  <LineChart
                    xAxis={[{ 
                      scaleType: 'band',
                      data: data.map(d => d.name) }]}
                    series={[
                      { data: data.map(d => d.menus),
                        color: theme.palette.text.primary
                      },
                    ]}
                    yAxis={[{
                      scaleType: 'linear',
                      min: 0
                    }]}
                    height={300}
                  >
                  </LineChart>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <Paper elevation={5} sx={{bgcolor: "background.paper",
                p: 3, height: '100%'
              }}>
                <Typography variant='h5' textAlign={'center'}>
                  Restaurants VS Menus
                </Typography>
                <Box sx={{ width: '100%', height: 300 }} mt={5}>
                  <LineChart
                    xAxis={[{ 
                      scaleType: 'band',
                      data: data.map(d => d.name) }]}
                    series={[
                      { data: data.map(d => d.menus),
                        color: theme.palette.text.primary
                      },
                    ]}
                    yAxis={[{
                      scaleType: 'linear',
                      min: 0
                    }]}
                    height={300}
                  >
                  </LineChart>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
    </>
  )
}

export default OwnerDashboard