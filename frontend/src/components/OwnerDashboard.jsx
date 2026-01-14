import { Box, Divider, Drawer, Grid, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar';
import { Class, Menu, MenuBook, Storefront } from '@mui/icons-material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import api from '../api';

const OwnerDashboard = () => {
  const [open, setOpen] = useState(false);
  const [restaurantsCount, setRestaurantsCount] = useState(3);
  const [menusCount, setMenusCount] = useState(12);
  const [categoriesCount, setCategoriesCount] = useState(24);
  const theme = useTheme();
  const [data, setData] = useState([
    {name: "Ates kebab", menus: 4},
    {name: "Fornello pizza", menus: 6},
    {name: "FoodCourt", menus: 2},
  ]);

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
      validateToken();
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
          <Typography variant='h4' fontWeight={700} color='text.primary'>
            Owner Dashboard
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Overview of overall status.
          </Typography>
          <Paper sx={{p: 3, width: '100%', mt: 3}}
           elevation={5}>
            <Stack direction={{xs: "column", md: "row"}} gap={{xs: 2, md: 4}} alignItems={'center'}
            divider={
              <Divider flexItem sx={{borderWidth: 1, borderColor: "text.primary"}}/>
            }>
              <Box display={'flex'} gap={{xs: 1, md: 4}} alignItems={'center'} sx={{width: '100%'}}
              flexDirection={{xs: 'column', md: 'row'}}>
                <Box width={"40px"} height={"40px"} bgcolor={"warning.main"}
                  display={'flex'} justifyContent={"center"} alignItems={'center'} 
                  borderRadius={'8px'}>
                  <Storefront sx={{color: "background.default"}}/>
                </Box>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={700} color='text.primary'>
                    My Restaurants
                  </Typography>
                  <Typography variant='h4' color='secondary.main' fontWeight={700}
                  textAlign={{xs: 'center', md: "left"}}>
                    {restaurantsCount}
                  </Typography>
                </Box>
              </Box>

              <Box display={'flex'} gap={{xs: 1, md: 4}} alignItems={'center'} sx={{width: '100%'}}
              flexDirection={{xs: 'column', md: 'row'}}>
                <Box width={"40px"} height={"40px"} bgcolor={"warning.main"}
                  display={'flex'} justifyContent={"center"} alignItems={'center'} 
                  borderRadius={'8px'}>
                  <MenuBook sx={{color: "background.default"}}/>
                </Box>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={700} color='text.primary'>
                    Menus
                  </Typography>
                  <Typography variant='h4' color='secondary.main' fontWeight={700}
                  textAlign={{xs: 'center', md: "left"}}>
                    {menusCount}
                  </Typography>
                </Box>
              </Box>

              <Box display={'flex'} gap={{xs: 1, md: 4}} alignItems={'center'} sx={{width: '100%'}}
              flexDirection={{xs: 'column', md: 'row'}}>
                <Box width={"40px"} height={"40px"} bgcolor={"warning.main"}
                  display={'flex'} justifyContent={"center"} alignItems={'center'} 
                  borderRadius={'8px'}>
                  <Class sx={{color: "background.default"}}/>
                </Box>
                <Box flex={1}>
                  <Typography variant='h6' fontWeight={700} color='text.primary'>
                    Categories
                  </Typography>
                  <Typography variant='h4' color='secondary.main' fontWeight={700}
                  textAlign={{xs: 'center', md: "left"}}>
                    {categoriesCount}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
          <Grid container spacing={2} mt={3}>
            <Grid size={{xs: 12, md: 6}}>
              <Paper elevation={5} sx={{bgcolor: "background.paper",
                p: 3
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
                p: 3
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