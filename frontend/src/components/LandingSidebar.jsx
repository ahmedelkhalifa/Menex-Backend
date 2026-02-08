import { AccountCircle, AdminPanelSettings, Category, Fastfood, Menu, MenuBook, Person, Restaurant, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Box, Button, Divider, Drawer, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Switch, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../main';
import Logo from '../assets/logo-png.png';
import LogoDark from '../assets/logo-dark-png.png';
import { useTranslation } from 'react-i18next';

const LandingSidebar = ({view, subname}) => {
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
        
    </>
  )
}

export default LandingSidebar