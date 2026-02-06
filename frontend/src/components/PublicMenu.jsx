import { Box, Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../api';
import { useParams } from 'react-router-dom';

const PublicMenu = () => {

  const [menu, setMenu] = useState(null);
  const {restaurantSlug, menuId} = useParams();

  useEffect(() => {
    async function getMenu() {
      try {
        const response = await api.get(`public/restaurants/${restaurantSlug}/menus/${menuId}`);
        setMenu(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getMenu();
  }, []);
  return (
    <>
    <Box width={"100%"} height={"350px"} position={'relative'}>
      <Box component={"img"} src={`http://localhost:8080/api/images/${menu?.imageUrl}`}
      width={"100%"} height={"100%"} sx={{objectFit: "cover"}}/>
      <Box position={"absolute"} top={0} left={0} width={"100%"} height={"100%"}
      sx={{bgcolor: "primary.main"}}/>
    </Box>
    <Container maxWidth="lg">
      <Typography>
        Hello
      </Typography>
    </Container>
    </>
  )
}

export default PublicMenu