import { Avatar, Box, Container, Paper, Typography, Grid, Chip, Button, ThemeProvider} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../api';
import { ArrowForward, LocationOn, Phone } from '@mui/icons-material';
import menexLogo from "../assets/logo-png.png"
import { buildTheme } from '../theme/buildTheme';
import PublicRestaurantLayout from './PublicRestaurantLayout';
import PublicMenu from './PublicMenu';

const PublicRestaurant = () => {
    const {restaurantSlug} = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [theme, setTheme] = useState(null)
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('public/restaurants/' + restaurantSlug);
                setRestaurant(response.data);
                setTheme(buildTheme(response.data.theme))
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                if (error.response.status === 404) {
                    window.location.href = "/not-found";
                }            
            }
        }
        fetchData();
    }, []);
    if (!restaurant || !theme) return null;
  return (
    <ThemeProvider theme={theme}>
        <PublicRestaurantLayout restaurant={restaurant}/>
    </ThemeProvider>
  )
}

export default PublicRestaurant