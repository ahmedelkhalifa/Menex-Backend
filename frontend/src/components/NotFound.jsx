import React from 'react'
import notFound from "../assets/404.png"
import { Box, Button, Container, Typography } from '@mui/material'
import { SupportAgent } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
    <Box>
      <Container maxWidth="sm">
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'flex-start'} height={'100vh'} gap={0}>
          <Box component={"img"} src={notFound} width={"300px"} height={"300px"}/>
          <Box>
            <Typography variant='h3' fontWeight={800} color={"primary.main"} textAlign={'center'}>
              Menu Not Found
            </Typography>
            <Typography variant='body1' fontSize={20} color={"text.secondary"} textAlign={'center'} mt={2}>
              The menu you are looking for might have been moved or is no longer available. Please check the QR code and try scanning it again.
            </Typography>
          </Box>
          <Button variant='outlined' color='primary' sx={{mt: 4, height: 50, width: 200,
            fontSize: 18
          }} onClick={() => navigate("/contact-us")}
          startIcon={<SupportAgent/>}>
            Contact Support
          </Button>
          <Typography variant='body1' color={"text.secondary"} textAlign={'center'} mt={4}>
            Are you a restaurant owner?&nbsp;
            <Typography variant='body1' component={'label'} sx={{cursor: 'pointer'}}
            color='primary.main' onClick={() => navigate("/login")}>
              Log in to your dashboard&nbsp;
            </Typography>
            to fix this link 
          </Typography>
      </Box>
      </Container>
    </Box>
    </>
  )
}

export default NotFound