import { AccountCircle, AdminPanelSettings, Bedtime, Category, Fastfood, Language, LightMode, MenuBook, Person, Restaurant, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Box, Button, Divider, Drawer, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Switch,Menu, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../main';
import Logo from '../assets/logo-png.png';
import LogoDark from '../assets/logo-dark-png.png';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const OwnerSidebar = ({view, subname}) => {
    function handleLogout() {
        localStorage.clear();
        window.location.href = "/login"
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
    function handleLangChange(lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        setAnchorEl(null);
        const isRTL = lang === "ar";
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
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
                      <Box display={'flex'} alignItems={'center'} gap={2} mt={20} mb={8}>
                          <IconButton onClick={handleChange} sx={{transition: "0.2s ease-in-out"}}>
                              {mode === "light" ? <Bedtime/> : <LightMode/>}
                          </IconButton>
                          <Box display="flex" alignItems="center" gap={0}>
                            <IconButton onClick={handleOpenLang}>
                              <Language />
                            </IconButton>

                            <Typography variant="body1" fontWeight={700}>
                              {localStorage.getItem("lang")?.toUpperCase()}
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
                      <Button variant='contained' sx={{mt: 2, bgcolor: 'error.main', color: '#FFFFFF', width: "100%", height: "50px"}} onClick={handleLogout}>
                        {t('sidebar.logout')}
                      </Button>
                    </List>
                  </Box>
    </>
  )
}

export default OwnerSidebar;