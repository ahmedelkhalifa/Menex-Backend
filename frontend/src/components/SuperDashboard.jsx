import { Category, Fastfood, Menu, MenuBook, Person, Restaurant, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../api';
import Swal from 'sweetalert2';

const SuperDashboard = () => {
  const [open, setOpen] = useState(false);
  const [usersCount, setUserCount] = useState(43);
  const [restaurantsCount, setRestaurantsCount] = useState(55);
  const [menusCount, setMenusCount] = useState(150);
  const [categoriesCount, setCategoriesCount] = useState(250);
  const [itemsCount, setItemsCount] = useState(783);
  const [adminsCount, setAdminsCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login"
  }

  useEffect(() => {
    async function getDashboard() {
      try {
        const response = await api.get("/admin/dashboard");
        setUserCount(response.data.usersCount);
        setRestaurantsCount(response.data.restaurantsCount);
        setMenusCount(response.data.menusCount);
        setCategoriesCount(response.data.categoriesCount);
        setItemsCount(response.data.menuItemsCount);
        setAdminsCount(response.data.adminsCount);
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Oops...",
          text: "Couldn't retrieve data!",
          icon: "error",
          showCloseButton: true,
          background: theme.palette.background.default,
          color: theme.palette.text.primary
        });
      } finally {
        setLoading(false);
      }
    };
    async function validateToken() {
      try {
        const response = await api.get("auth/validate");
        console.log(response.data);
      } catch (error) {
        localStorage.clear();
        window.location.href = "/login";
      }
    };
    validateToken();
    getDashboard();
  }, []);
  return (
    <>
    <Box>
      <Box position={'absolute'} top={'5%'} left={'8%'} display={{sm: "block", md: "none"}}>
        <IconButton onClick={() => setOpen(true)}>
          <Menu color=''/>
        </IconButton>
        <Drawer
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}>
          <Sidebar view={"phone"} subname={"Super Admin"}></Sidebar>
        </Drawer>
      </Box>
      <Box display={'flex'} bgcolor={"background.default"} gap={2}>
        <Sidebar subname={"Super Admin"}></Sidebar>
        <Box flex={4} p={5} mt={{xs: 8, md: 0}}>
          <Typography variant='h4' fontWeight={700} color='text.primary'>
            Admin Dashboard
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Overview of overall status.
          </Typography>
          <Stack direction={{xs: 'column', sm: "row"}} mt={3} justifyContent={"space-between"}
          alignItems={'center'} gap={4}>
            <Paper elevation={5} sx={{flex: 1, p: loading? 0 : 5, width: '100%', bgcolor: "background.paper"}}>
              {loading ? (<Skeleton variant='rectangular' sx={{
                height: "220px", borderRadius: 1
              }}/>) : (
                <>
                  <Typography variant='h5' fontWeight={600} display={'flex'} alignItems={'center'}
                  color='text.primary'>
                    <Person sx={{mr: 1.5}}/> Total Users:
                  </Typography>
                  <Typography color='primary.main' variant='h2' fontWeight={800}>
                    {usersCount}
                  </Typography>
                  <Typography color='text.secondary' mt={1}>
                    Total number of restaurant owners registered.
                  </Typography>
                </>
              )}
            </Paper>
            <Paper elevation={5} sx={{flex: 1, p: loading? 0 : 5, width: '100%', bgcolor: "secondary.main"}}>
              {loading ? (<Skeleton variant='rectangular' sx={{
                height: "220px", borderRadius: 1
              }}/>) : (
                <>
                  <Typography variant='h5' fontWeight={600} display={'flex'} alignItems={'center'}
                    color='background.paper'>
                      <Restaurant sx={{mr: 1.5}}/> Total Restaurants:
                    </Typography>
                    <Typography color='background.default' variant='h2' fontWeight={800}>
                      {restaurantsCount}
                    </Typography>
                    <Typography color='background.default' mt={1}>
                      Total number of restaurant created.
                  </Typography>
                </>
              )}
            </Paper>
          </Stack>
          <Stack direction={{xs: 'column', sm: "row"}} mt={3} justifyContent={"space-between"}
          alignItems={'center'} gap={4}>
            <Paper elevation={5} sx={{flex: 1, p: loading? 0 : 5, width: '100%', bgcolor: "background.paper"}}>
              {loading ? (<Skeleton variant='rectangular' sx={{
                height: "220px", borderRadius: 1
              }}/>) : (
                <>
                  <Typography variant='h5' fontWeight={600} display={'flex'} alignItems={'center'}
                    color='text.primary'>
                      <MenuBook sx={{mr: 1.5}}/> Total Menus:
                    </Typography>
                    <Typography color='primary.main' variant='h2' fontWeight={800}>
                      {menusCount}
                    </Typography>
                    <Typography color='text.secondary' mt={1}>
                      Total number of menus created.
                  </Typography>
                </>
              )}  
            </Paper>
          </Stack>
          <Stack direction={{xs: 'column', sm: "row"}} mt={3} justifyContent={"space-between"}
          alignItems={'flex-start'} gap={4}>
            <Paper elevation={5} sx={{flex: 1, p: loading? 0 : 5, width: '100%', bgcolor: "background.paper"}}>
              {loading ? (<Skeleton variant='rectangular' sx={{
                height: "220px", borderRadius: 1
              }}/>) : (
                <>
                  <Typography variant='h5' fontWeight={600} display={'flex'} alignItems={'center'}
                    color='text.primary'>
                      <Category sx={{mr: 1.5}}/> Total Categories:
                    </Typography>
                    <Typography color='primary.main' variant='h2' fontWeight={800}>
                      {categoriesCount}
                    </Typography>
                    <Typography color='text.secondary' mt={1}>
                      Total number of categories created.
                  </Typography>
                </>
              )}  
            </Paper>
            <Paper elevation={5} sx={{flex: 1, p: loading? 0 : 5, width: '100%', bgcolor: "background.paper"}}>
              {loading ? (<Skeleton variant='rectangular' sx={{
                height: "220px", borderRadius: 1
              }}/>) : (
                <>
                  <Typography variant='h5' fontWeight={600} display={'flex'} alignItems={'center'}
                    color='text.primary'>
                      <Fastfood sx={{mr: 1.5}}/> Total Menu Items:
                    </Typography>
                    <Typography color='primary.main' variant='h2' fontWeight={800}>
                      {itemsCount}
                    </Typography>
                    <Typography color='text.secondary' mt={1}>
                      Total number of menu items created.
                  </Typography>
                </>
              )}                
            </Paper>
            <Paper elevation={5} sx={{flex: 1, p: loading? 0 : 5, width: '100%', bgcolor: "primary.main"}}>
              {loading ? (<Skeleton variant='rectangular' sx={{
                height: "220px", borderRadius: 1
              }}/>) : (
                <>
                  <Typography variant='h5' fontWeight={600} display={'flex'} alignItems={'center'}
                    sx={{color: "background.paper"}}>
                      <SupervisorAccount sx={{mr: 1.5, color: "background.paper"}}/> Total Admins:
                    </Typography>
                    <Typography color='background.paper' variant='h2' fontWeight={800}>
                      {adminsCount}
                    </Typography>
                    <Typography color='background.default' mt={1}>
                      Total number of super admins.
                  </Typography>
                </>
              )}  
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
    </>
  )
}

export default SuperDashboard