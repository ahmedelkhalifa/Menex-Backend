import { AccountCircle, AdminPanelSettings, Bedtime, Category, Fastfood, Language, LightMode, MenuBook, NoAccounts, Person, Restaurant, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Box, Button, Divider, Drawer, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Switch, Typography, Menu } from '@mui/material'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../main';
import Logo from '../assets/logo-png.png';
import LogoDark from '../assets/logo-dark-png.png';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';


const Sidebar = ({view, subname, userId}) => {
    function handleLogout() {
        localStorage.clear();
        window.location.href = "/"
    }
    const navigate = useNavigate();
    const location = useLocation();
    const {mode, setMode} = useThemeMode();
    const {t} = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

    function handleChange() {
        setMode((prev) => prev === "light" ? "dark" : "light");
    }
    const handleOpenLang = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseLang = () => {
        setAnchorEl(null);
    };
    async function handleLangChange(lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        setAnchorEl(null);
        const isRTL = lang === "ar";
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        if (userId) {
          try {
            const response = await api.put(`users/${userId}/updateLanguage?language=${lang}`);
          } catch (error) {
            console.log(error);
          }
        }
    }
  return (
    <>
          <Box flex={1} position={'sticky'} top={0} height={'100vh'} bgcolor={'background.sidebar'} p={3} display={{xs: view === "phone" ? "block" : "none", md: view === "phone" ? "none" : "block"}} borderRight={"1px solid #E0E8E4"}> 
                    <Box
                    component="img"
                    src={mode === "light" ? Logo : LogoDark}
                    width={200}            // same as 300px
                    sx={{
                        display: "block",    // removes inline spacing
                        objectFit: "contain",// keeps image proportions
                    }}
                    alt="Logo"
                    />
                    <Typography variant='h5' color='text.primary' fontWeight={700} mt={2}>
                        {t('sidebar.adminDashboard')}
                    </Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3, borderColor: 'text.primary'}}></Divider>
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton
                        selected={location.pathname === "/admin-dashboard"}
                        sx={{  
                            color: "text.primary"
                          }}
                          onClick={() => navigate("/admin-dashboard")}
                          >
                          <ListItemIcon>
                            <SpaceDashboard ></SpaceDashboard>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.dashboard')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton sx={{color: "text.primary"}}
                        selected={location.pathname === "/admin-dashboard/restaurants"}
                        onClick={() => navigate("/admin-dashboard/restaurants")}>
                          <ListItemIcon>
                            <Restaurant></Restaurant>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.restaurants')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/admin-dashboard/restaurant-owners")}
                          sx={{color: "text.primary"}}
                          selected={location.pathname === "/admin-dashboard/restaurant-owners"}>
                          <ListItemIcon>
                            <Person></Person>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.restaurantOwners')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/admin-dashboard/unsubscribers")}
                          sx={{color: "text.primary"}}
                          selected={location.pathname === "/admin-dashboard/unsubscribers"}>
                          <ListItemIcon>
                            <NoAccounts/>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.unsubscribers')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/admin-dashboard/admins")}
                          sx={{color: "text.primary"}}
                          selected={location.pathname === "/admin-dashboard/admins"}>
                          <ListItemIcon>
                            <AdminPanelSettings/>
                          </ListItemIcon>
                          <ListItemText primary={t('sidebar.admins')}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/admin-dashboard/profile")}
                          sx={{color: "text.primary"}}
                          selected={location.pathname === "/admin-dashboard/profile"}>
                          <ListItemIcon>
                            <AccountCircle/>
                          </ListItemIcon>
                          <ListItemText primary={t("sidebar.profile")}/>
                        </ListItemButton>
                      </ListItem>
                      <Box display={'flex'} alignItems={'center'} gap={2} mt={10}>
                          <IconButton onClick={handleChange} sx={{transition: "0.2s ease-in-out"}}>
                              {mode === "light" ? <Bedtime/> : <LightMode/>}
                          </IconButton>
                          <Box display="flex" alignItems="center" gap={0}>
                            <IconButton onClick={handleOpenLang}>
                              <Language />
                            </IconButton>

                            <Typography variant="body1" fontWeight={700}>
                              {i18n.language?.toUpperCase()}
                            </Typography>

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleCloseLang}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <MenuItem onClick={() => handleLangChange("en")}>English</MenuItem>
                              <MenuItem onClick={() => handleLangChange("tr")}>Türkçe</MenuItem>
                              <MenuItem onClick={() => handleLangChange("ar")}>العربية</MenuItem>
                            </Menu>
                          </Box>
                      </Box>
                      <Button variant='contained' sx={{mt: 10, bgcolor: 'error.main', height: "40px"}} onClick={handleLogout} fullWidth>
                        {t("sidebar.logout")}
                      </Button>
                    </List>
                  </Box>
    </>
  )
}

export default Sidebar