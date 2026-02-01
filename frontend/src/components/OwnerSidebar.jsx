import { AccountCircle, AdminPanelSettings, Category, Fastfood, Menu, MenuBook, Person, Restaurant, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Box, Button, Divider, Drawer, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Switch, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../main';
import Logo from '../assets/logo-png.png';
import LogoDark from '../assets/logo-dark-png.png';
import { useTranslation } from 'react-i18next';

const OwnerSidebar = ({view, subname}) => {
    function handleLogout() {
        localStorage.clear();
        window.location.href = "/login"
    }
    const navigate = useNavigate();
    const location = useLocation();
    const {mode, setMode} = useThemeMode();
    const {t} = useTranslation();
    function handleChange() {
        setMode((prev) => prev === "light" ? "dark" : "light");
    }
  return (
    <>
          <Box flex={1} position={'sticky'} top={0} height={'100vh'} bgcolor={'background.sidebar'} p={3} display={{xs: view === "phone" ? "block" : "none", md: view === "phone" ? "none" : "block"}} borderRight={"1px solid #E0E8E4"}> 
                    <Box
                    component="img"
                    src={mode === "light" ? Logo : LogoDark}
                    width={170}            // same as 200px
                    sx={{
                        display: "block",    // removes inline spacing
                        objectFit: "contain",// keeps image proportions
                    }}
                    alt="Logo"
                    />
                    <Typography variant='h5' color='text.primary' fontWeight={700} mt={2}>
                        {t('sidebar.ownerDashboard')}
                    </Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3, borderColor: 'divider'}}></Divider>
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton
                        selected={location.pathname === "/owner-dashboard"}
                        sx={{  
                            color: "text.primary"
                          }}
                          onClick={() => navigate("/owner-dashboard")}
                          >
                          <ListItemIcon>
                            <SpaceDashboard ></SpaceDashboard>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.dashboard')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton sx={{color: "text.primary"}}
                        selected={location.pathname === "/owner-dashboard/restaurants"}
                        onClick={() => navigate("/owner-dashboard/restaurants")}>
                          <ListItemIcon>
                            <Restaurant></Restaurant>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.restaurants')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/owner-dashboard/menus-builder")}
                          sx={{color: "text.primary"}}
                          selected={location.pathname === "/owner-dashboard/menus-builder"}>
                          <ListItemIcon>
                            <MenuBook/>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.menus')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/owner-dashboard/profile")}
                          sx={{color: "text.primary"}}
                          selected={location.pathname === "/owner-dashboard/profile"}>
                          <ListItemIcon>
                            <AccountCircle/>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.profile')}/>
                        </ListItemButton>
                      </ListItem>
                      <FormGroup sx={{mt: 27}}>
                        <FormControlLabel control={<Switch
                        checked={mode === "dark"}
                        onChange={handleChange}/>}
                        label={t('sidebar.darkMode')}/>
                      </FormGroup>
                      <Button variant='contained' sx={{mt: 2, bgcolor: 'error.main', color: '#FFFFFF', width: "100%", height: "50px"}} onClick={handleLogout}>
                        {t('sidebar.logout')}
                      </Button>
                    </List>
                  </Box>
    </>
  )
}

export default OwnerSidebar;