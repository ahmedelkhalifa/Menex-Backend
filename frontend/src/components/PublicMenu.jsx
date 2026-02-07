import { Box, Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../api';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import PublicMenuLayout from './PublicMenuLayout';
import { buildTheme } from '../theme/buildTheme';

const PublicMenu = () => {

  const [menu, setMenu] = useState(null);
  const [theme, setTheme] = useState(null);
  const {restaurantSlug, menuId} = useParams();

  useEffect(() => {
    async function getMenu() {
      try {
        const response = await api.get(`public/restaurants/${restaurantSlug}/menus/${menuId}`);
        setMenu(response.data);
        setTheme(buildTheme(response.data.theme));
      } catch (error) {
        console.error(error);
        if (error.response.status === 404) {
          window.location.href = "/not-found";
        } 
        if (error.response.status === 400) {
          window.location.href = "/inactive";
        } 
      }
    }
    getMenu();
  }, []);
  if (!menu || !theme) return null;
  return (
    <ThemeProvider theme={theme}>
      <PublicMenuLayout menu={menu}/>
    </ThemeProvider>
  )
}

export default PublicMenu