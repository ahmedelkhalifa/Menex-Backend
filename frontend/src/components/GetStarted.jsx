import { Box, Button, Card, Container, Typography } from '@mui/material'
import React from 'react'
import { useThemeMode } from '../main';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo-png.png"
import logoDark from "../assets/logo-dark-png.png"
import link from "../assets/wa-link-qr.png"
import { ArrowBack, CheckCircle, Circle, RocketLaunch, WhatsApp } from '@mui/icons-material';

const GetStarted = () => {
    const {mode, setMode} = useThemeMode();
    const {t} = useTranslation();
    const navigate = useNavigate();
  return (
    <>
    <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
    }}>
        <Box width={"100%"} height={"100px"} sx={{bgcolor: "background.paper", flexShrink: 0}} display={'flex'}
        alignItems={"center"}>
            <Container maxWidth="lg" sx={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                <Box component={"img"} src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
                sx={{objectFit: "contain"}}/>
                <Box display={'flex'} alignItems={'center'} gap={1} sx={{cursor: "pointer",
                    color: "text.primary", transition: "0.2s ease",
                    "&:hover": {
                        color: "primary.main"
                    }
                }}
                component={"label"} onClick={() => navigate("/")}>
                    <ArrowBack/>
                    <Typography>
                        Back to Home
                    </Typography>
                </Box>
            </Container>
        </Box>
        <Box sx={{flex: 1, px: 2, my: {xs: 5, md: 0}}} display={'flex'} justifyContent={'center'}
        alignItems={'center'}>
            <Card sx={{width: "800px"}}>
                <Box display={'flex'} flexDirection={{xs: "column", md:"row"}}>
                    <Box p={4} display={'flex'} flexDirection={'column'} gap={2} flex={1}>
                        <Box sx={{width: "50px", height: "50px", borderRadius:1, 
                            bgcolor: "primary.light", display: 'flex', justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <RocketLaunch sx={{color: "primary.main"}}/>
                        </Box>
                        <Typography variant='h4' fontWeight={900} color='text.primary'>
                            Start Your Digital Transformation
                        </Typography>
                        <Typography variant='body1' color='text.secondary' lineHeight={1.6}>
                            To ensure the best setup for your restaurant, our account managers handle the registration personally. We provide a white-glove onboarding service to get your menu perfect from day one.
                        </Typography>
                        <Box my={2}>
                            <Box display={'flex'} alignItems={'center'} gap={1} sx={{
                                color: "success.main"
                            }}>
                                <CheckCircle/>
                                <Typography>
                                    Create Account
                                </Typography>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} gap={1} sx={{
                                color: "success.main"
                            }} mt={1}>
                                <CheckCircle/>
                                <Typography>
                                    Customize your first restaurant
                                </Typography>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} gap={1} sx={{
                                color: "success.main"
                            }} mt={1}>
                                <CheckCircle/>
                                <Typography>
                                    24/7 Priority Support
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box p={4} display={'flex'} flexDirection={'column'} gap={2} flex={1}
                    sx={{bgcolor: "background.sidebar"}}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Box component={"img"} src={link} width={"200px"} height={"200px"}
                            sx={{objectFit: "contain"}} mt={3}/>
                        </Box>
                        <Typography variant='body1' color='text.secondary' textAlign={'center'}>
                            Scan the code above or click the button below to start instantly.
                        </Typography>
                        <Button onClick={() => navigate("https://wa.link/vxvfu4")}
                            variant='contained' sx={{height: "50px", fontWeight: 600,
                                fontSize: 17, boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}80`
                            }} startIcon={<WhatsApp/>}>
                            Chat On WhatsApp
                        </Button>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}
                        gap={1}>
                            <Circle sx={{color: "primary.main", fontSize: 12}}/>
                            <Typography variant='body2' color='text.secondary'>
                                Fast response
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
        <Box sx={{bgcolor: "background.paper", flexShrink: 0}} height={"100px"}
        display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}
        gap={2}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={1}>
                <Typography variant='body1' color='text.secondary'>
                    Already have an account?
                </Typography>
                <Typography variant='body1' fontWeight={800} color='primary.main'
                component={"a"} href='/login' sx={{textDecoration: 'none'}}>
                    Login
                </Typography>
            </Box>
            <Typography variant='body2' color='text.secondary'>
                {new Date().getFullYear()} © MENEX. All rights reserved.
            </Typography>
        </Box>
    </Box>
    </>
  )
}

export default GetStarted