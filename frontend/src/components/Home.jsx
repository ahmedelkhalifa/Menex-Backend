import { Box, Button, Card, Container, Divider, Drawer, Grid, IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import {Analytics, ArrowForward, Bedtime, ChangeCircleOutlined, CheckCircle, Facebook, Instagram, Language, LightMode, MenuBook, PlayArrow, Restaurant, Star} from "@mui/icons-material"
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState } from 'react'
import background from "../assets/white-wall-textures.jpg"
import backgroundDark from "../assets/black-texture.jpg"
import logo from "../assets/logo-png.png"
import logoDark from "../assets/logo-dark-png.png"
import phone from "../assets/phone.jpg"
import phone2 from "../assets/phone2.jpg"
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from '../main'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import LandingSidebar from './LandingSideBar'
import api from '../api'


const Home = () => {

    const navigate = useNavigate();
    const {mode, setMode} = useThemeMode();
    const [anchorEl, setAnchorEl] = useState(null);
    const {t} = useTranslation();
    const [openDrawer, setOpenDrawer] = useState(false);

    const open = Boolean(anchorEl);

    const handleOpenLang = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseLang = () => {
        setAnchorEl(null);
    };

    function handleChange() {
        setMode((prev) => prev === "light" ? "dark" : "light");
    }

    function handleLangChange(lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        setAnchorEl(null);
        const isRTL = lang === "ar";
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
    }

    async function handleSubscription(priceId) {
        try {
            const response = await api.post("subscription", {
                priceId: priceId,
                successUrl: window.location.origin + "/success",
                cancelUrl: window.location.origin + "/cancel"
            });
            const paymentUrl = response.data;
            window.location.href = paymentUrl;
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <>
    {/* Hero */}
    <Box width={"100%"} height={"100vh"} position={"relative"} overflow={"hidden"}>
        <Box width={"100%"} height={"100px"} position={"absolute"} top={0} left={0} sx={{
            bgcolor: "background.paper", px: 10, py: 2
        }} zIndex={100} display={{xs: "flex", md: "flex"}} justifyContent={{xs: "center", md: "space-between"}} alignItems={'center'}>
            <Box component={'img'} src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
            sx={{objectFit: "contain"}}/>
            <IconButton sx={{display: {xs: 'block', md: "none"}, position: "absolute", top: "30%", left: "10%"}} onClick={() => setOpenDrawer(true)}>
                <MenuIcon/>
            </IconButton>
            <Box gap={7} alignItems={'center'} display={{xs: "none", md: "flex"}}>
                <Box display={'flex'} gap={3} alignItems={'center'}>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"a"} href='#features' sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }
                    }}>
                        {t("landing.featuresNav")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"a"} href='#howItWorks' sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }}}>
                        {t("landing.howItWorks")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"a"} href='#pricing' sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }}}>
                        {t("landing.pricingNav")}
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                    <IconButton onClick={handleChange} sx={{transition: "0.2s ease-in-out"}}>
                        {mode === "light" ? <Bedtime/> : <LightMode/>}
                    </IconButton>
                    <Box display={'flex'} alignItems={'center'} gap={0} onClick={handleOpenLang}
                    sx={{cursor: "pointer"}}>
                        <IconButton>
                            <Language/>
                        </IconButton>
                        <Typography variant='body1' fontWeight={700} color='text.primary'>
                            {localStorage.getItem("lang") === "en" && "EN"}
                            {localStorage.getItem("lang") === "tr" && "TR"}
                            {localStorage.getItem("lang") === "ar" && "AR"}
                        </Typography>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseLang}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        PaperProps={{
                            sx: {
                            minWidth: anchorEl?.clientWidth, // ✅ use clientWidth
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleLangChange("en")}>English</MenuItem>
                        <MenuItem onClick={() => handleLangChange("tr")}>Türkçe</MenuItem>
                        <MenuItem onClick={() => handleLangChange("ar")}>العربية</MenuItem>
                    </Menu>
                </Box>
                <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Button variant='outlined' 
                    color='success' sx={{height: "40px", width: "100px"}}
                    onClick={() => navigate("login")}>
                        {t("landing.login")}
                    </Button>
                    <Button variant='contained' sx={{bgcolor: "success.main", color: "#fff", height: "40px", width: "150px", fontWeight: 700}} onClick={() => navigate("signup")}>
                        {t("landing.register")}
                    </Button>
                </Box>
            </Box>
        </Box>
        <Box component={"img"} src={mode === "light" ? background : backgroundDark} width={"100%"} height={"100%"}
        sx={{objectFit: "cover"}} position={'absolute'} top={0} left={0} zIndex={1}/>
        <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            sx={{
            background: mode === "light" ? 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.3))' : 'linear-gradient(to bottom, rgba(22,37,33,1), rgba(22,37,33,0.5))',
            }}
            zIndex={3}
        />
        <Container maxWidth="lg">
            <Box display="flex"
                alignItems="center"
                justifyContent="space-between"
                minHeight="100vh"
                gap={4} zIndex={10} position={"relative"}
                flexDirection={{xs: "column", md: "row"}}>
                <Box flex={1.5} width={"100%"} display={"flex"} justifyContent={'center'}
                alignItems={"center"} pt={{xs: 15, md: 0}}>
                    <Box p={{xs: 5, md: 0}}>
                        <Typography variant='h2' fontWeight={700} color='text.primary'
                        fontSize={{xs: 32, md: 60}} textAlign={{xs: "center", md: "left"}}>
                            {t("landing.hero1")}
                        </Typography>
                        <Typography variant='h2' fontWeight={700} color='success.main'
                        fontSize={{xs: 32, md: 60}} textAlign={{xs: "center", md: "left"}}>
                            {t("landing.hero2")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary'mt={2}
                        fontSize={{xs: 16, md: 20}} lineHeight={1.6}
                        textAlign={{xs: "center", md: "left"}}>
                            {t("landing.hero-desc")}
                        </Typography>
                        <Box display={'flex'} gap={{xs: 2, md: 1}} alignItems={'center'} mt={3}
                        flexDirection={{xs: "column", sm: "row"}} justifyContent={{xs: "center", md: "left"}}>
                            <Button variant='contained' color='success' sx={{height: "60px", width: "250px", color: "#FFFFFF", fontSize: 20, fontWeight: 700}}
                            endIcon={<ArrowForward/>} onClick={() => navigate("get-started")}>
                                {t("landing.startFree")}
                            </Button>
                            <Button variant='contained' sx={{height: "60px", width: "200px", color: "text.primary", fontSize: 20, bgcolor: "background.default", fontWeight: 700}}
                            startIcon={<PlayArrow sx={{bgcolor: "success.main", borderRadius: "50%",
                                color: "#fff"
                            }}/>}>
                                {t("landing.watch-demo")}
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box flex={1} overflow={"hidden"} height={"100%"} width={"100%"}
                borderRadius={{xs: "0 50% 0 0", md: "50% 0 0 50%"}}>
                    <Box component={"img"} src={phone} width={"100%"} height={"100%"}
                    sx={{objectFit: "cover"}}/>
                </Box>
            </Box>
        </Container>
    </Box>
    <Drawer open={openDrawer} anchor={"left"} onClose={() => setOpenDrawer(false)} PaperProps={{
    sx: {
      borderRadius: 0,
    },
  }}>
        <Box bgcolor={"background.default"} gap={0} display={'flex'}>
            <Box flex={1} position={'sticky'} top={0} height={'100vh'} bgcolor={'background.sidebar'} p={3} borderRight={"1px solid #E0E8E4"} borderRadius={0}> 
                <Box display={'flex'} flexDirection={"column"} gap={4} mt={5}>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"a"} href='#features' sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }
                    }} onClick={() => setOpenDrawer(false)} textAlign={'center'}>
                        {t("landing.featuresNav")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"a"} href='#howItWorks' sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }
                    }} onClick={() => setOpenDrawer(false)} textAlign={'center'}>
                        {t("landing.howItWorks")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"a"} href='#pricing' sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }
                    }} onClick={() => setOpenDrawer(false)} textAlign={'center'}>
                        {t("landing.pricingNav")}
                    </Typography>
                    <Box display={'flex'} alignItems={'center'} gap={2} justifyContent={'center'}>
                        <IconButton onClick={handleChange} sx={{transition: "0.2s ease-in-out"}}>
                            {mode === "light" ? <Bedtime/> : <LightMode/>}
                        </IconButton>
                        <Box display={'flex'} alignItems={'center'} gap={0} onClick={handleOpenLang}
                        sx={{cursor: "pointer"}}>
                            <IconButton>
                                <Language/>
                            </IconButton>
                            <Typography variant='body1' fontWeight={700} color='text.primary'>
                                {localStorage.getItem("lang") === "en" && "EN"}
                                {localStorage.getItem("lang") === "tr" && "TR"}
                                {localStorage.getItem("lang") === "ar" && "AR"}
                            </Typography>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseLang}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            PaperProps={{
                                sx: {
                                minWidth: anchorEl?.clientWidth, // ✅ use clientWidth
                                },
                            }}
                        >
                            <MenuItem onClick={() => handleLangChange("en")}>English</MenuItem>
                            <MenuItem onClick={() => handleLangChange("tr")}>Türkçe</MenuItem>
                            <MenuItem onClick={() => handleLangChange("ar")}>العربية</MenuItem>
                        </Menu>
                    </Box>
                    <Box display={'flex'} gap={1} alignItems={'center'} flexDirection={'column'}>
                        <Button variant='outlined' 
                        color='success' sx={{height: "40px", width: "150px"}}
                        onClick={() => navigate("login")}>
                            {t("landing.login")}
                        </Button>
                        <Button variant='contained' sx={{bgcolor: "success.main", color: "#fff", height: "40px", width: "150px", fontWeight: 700}}>
                            {t("landing.register")}
                        </Button>
                    </Box>
                </Box>           
            </Box>
        </Box>
    </Drawer>
    {/* features */}
    <Box py={10} id="features">
        <Container maxWidth="lg">
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Box width={{xs: "100%", md: "60%"}}>
                    <Typography variant='h6' fontWeight={600} color='success.main'
                    textAlign={'center'}>
                        {t("landing.features.title")}
                    </Typography>
                    <Typography variant='h4' fontWeight={700} color='text.primary' mt={1}
                    textAlign={'center'}>
                        {t("landing.features.subtitle")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' mt={1}
                    textAlign={'center'} fontSize={18}>
                        {t("landing.features.desc")}
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={2} mt={5} alignItems={'stretch'}>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }}>
                    <Paper elevation={1} sx={{p: 4, "&:hover": {cursor: "pointer",
                        boxShadow: 5
                    }, flexGrow: 1 }}>
                        <Box sx={{bgcolor: "primary.light", color:"primary.main", width: "50px", height: "50px", borderRadius: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <Restaurant/>
                        </Box>
                        <Typography variant='h5' fontWeight={600} color='text.primary' mt={2}>
                            {t("landing.features.feature1.title")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' mt={2}>
                            {t("landing.features.feature1.desc")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }}>
                    <Paper elevation={1} sx={{p: 4, "&:hover": {cursor: "pointer",
                        boxShadow: 5
                    }, flexGrow: 1 }}>
                        <Box sx={{bgcolor: "rgb(219 234 254 / var(--tw-bg-opacity, 1));", color:"rgb(59 130 246 / var(--tw-text-opacity, 1));", width: "50px", height: "50px", borderRadius: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <ChangeCircleOutlined sx={{fontSize: 30}}/>
                        </Box>
                        <Typography variant='h5' fontWeight={600} color='text.primary' mt={2}>
                            {t("landing.features.feature2.title")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' mt={2}>
                            {t("landing.features.feature2.desc")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }}>
                    <Paper elevation={1} sx={{p: 4, "&:hover": {cursor: "pointer",
                        boxShadow: 5
                    }, flexGrow: 1 }}>
                        <Box sx={{bgcolor: "rgb(255 237 213 / var(--tw-bg-opacity, 1));", color:"rgb(249 115 22 / var(--tw-text-opacity, 1));", width: "50px", height: "50px", borderRadius: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <Analytics/>
                        </Box>
                        <Typography variant='h5' fontWeight={600} color='text.primary' mt={2}>
                            {t("landing.features.feature3.title")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' mt={2}>
                            {t("landing.features.feature3.desc")}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>

    {/* how it works */}
    <Box id="howItWorks" py={10} sx={{bgcolor: "background.sidebar"}}>
        <Container maxWidth="lg">
            <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                {t("landing.getStarted.title")}
            </Typography>
            <Grid container spacing={5} mt={5} alignItems={'stretch'} sx={{position: "relative"}}>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }} zIndex={5}>
                    <Paper elevation={1} sx={{p: 4, "&:hover": {cursor: "pointer",
                        boxShadow: 5
                    }, flexGrow: 1, bgcolor: "background.paper", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Box sx={{bgcolor: "primary.main", color:"#fff", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}90`}}>
                            <Typography variant='h4' fontWeight={700}>
                                1
                            </Typography>
                        </Box>
                        <Typography variant='h5' fontWeight={600} color='text.primary' mt={2}>
                            {t("landing.getStarted.step1.title")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' mt={2} textAlign={"center"}>
                            {t("landing.getStarted.step1.desc")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }} zIndex={5}>
                    <Paper elevation={1} sx={{p: 4, "&:hover": {cursor: "pointer",
                        boxShadow: 5
                    }, flexGrow: 1, bgcolor: "background.paper", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Box sx={{bgcolor: "primary.main", color:"#fff", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}90`}}>
                            <Typography variant='h4' fontWeight={700}>
                                2
                            </Typography>
                        </Box>
                        <Typography variant='h5' fontWeight={600} color='text.primary' mt={2}>
                            {t("landing.getStarted.step2.title")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' mt={2} textAlign={"center"}>
                            {t("landing.getStarted.step2.desc")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }} zIndex={5}>
                    <Paper elevation={1} sx={{p: 4, "&:hover": {cursor: "pointer",
                        boxShadow: 5
                    }, flexGrow: 1, bgcolor: "background.paper", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Box sx={{bgcolor: "primary.main", color:"#fff", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}90`}}>
                            <Typography variant='h4' fontWeight={700}>
                                3
                            </Typography>
                        </Box>
                        <Typography variant='h5' fontWeight={600} color='text.primary' mt={2}>
                            {t("landing.getStarted.step3.title")}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' mt={2} textAlign={"center"}>
                            {t("landing.getStarted.step3.desc")}
                        </Typography>
                    </Paper>
                </Grid>
                <Box
                    sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    }}
                >
                    {/* Vertical divider (sm/xs) */}
                    <Divider
                    orientation="vertical"
                    sx={{
                        display: { xs: "block", md: "none" },
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        transform: "translateX(-50%)",
                        height: "100%",
                        borderWidth: 3,
                    }}
                    />

                    {/* Horizontal divider (md+) */}
                    <Divider
                    orientation="horizontal"
                    sx={{
                        display: { xs: "none", md: "block" },
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        transform: "translateY(-50%)",
                        width: "100%",
                        borderWidth: 3,
                    }}
                    />
                </Box>
            </Grid>
        </Container>
    </Box>

    {/* pricing */}
    <Box id="pricing" py={10}>
        <Container maxWidth="lg">
            <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                {t("landing.pricing.title")}
            </Typography>
            <Stack flexDirection={{xs: "column", sm: "row"}} justifyContent={'center'} alignItems={'flex-start'} gap={4} mt={3}>
                <Card sx={{width: {xs: "100%", md: "400px"}, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                    boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}60`
                }}>
                    <Typography variant='h5' fontWeight={700} textAlign={'center'} mt={5}>
                        {t("landing.pricing.card.proPlan")}
                    </Typography>
                    <Typography variant='h3' fontWeight={700} textAlign={'center'}>
                        7$ 
                        <Typography display={'inline-block'} variant='body1' color='text.secondary'>
                            {t("landing.pricing.card.perMonth")}
                        </Typography>
                    </Typography>
                    <Box display={'flex'} alignItems={'center'} gap={1}
                    sx={{bgcolor: "primary.light", px: 2, py: 1, borderRadius: 2}}>
                        <Star fontSize='12' sx={{color: mode === "light" ? "primary.main" : "#fff"}}/>
                        <Typography variant='body1' sx={{color: mode === "light" ? "primary.main" : "#fff"}}>
                            {t("landing.pricing.card.free-trial")}
                        </Typography>
                    </Box>
                    <Typography variant='body1' color='text.secondary'>
                        {t("landing.pricing.card.cancellation")}
                    </Typography>
                    <Box width={"100%"} sx={{bgcolor: "background.default"}} mt={1} p={4}>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>
                                {t("landing.pricing.card.features.1")}
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>
                                {t("landing.pricing.card.features.2")}
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.3")}
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.4")}
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.5")}
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.6")}
                            </Typography>
                        </Box>
                        <Button variant='contained' sx={{height: "50px", bgcolor: "primary.main",
                            color: "#fff", width: "100%", fontSize: 18, fontWeight: 600,
                            boxShadow: (theme) =>
                            `0px 6px 20px ${theme.palette.primary.main}80`,
                            mt: 2
                        }} onClick={() => handleSubscription("price_1SzIOGRSGDklsSzW3S7Ie72I")}>
                            {t("landing.pricing.card.button")}
                        </Button>
                    </Box>
                </Card>
                <Card sx={{width: {xs: "100%", md: "400px"}, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                    boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}60`,
                    position: "relative"
                }}>
                    <Box position={'absolute'} top={0} right={0} width={"100px"} height={"40px"}
                    sx={{bgcolor: "primary.main", borderRadius: "0 0 0 30%"}} display={'flex'} justifyContent={'center'}
                    alignItems={'center'}>
                        <Typography variant='body2' fontSize={12} sx={{color: "#fff"}} fontWeight={700}>
                            {t("landing.pricing.card.badge")}
                        </Typography>
                    </Box>
                    <Typography variant='h5' fontWeight={700} textAlign={'center'} mt={5}>
                        {t("landing.pricing.card.proPlan")}
                    </Typography>
                    <Typography variant='h3' fontWeight={700} textAlign={'center'}>
                        70$ 
                        <Typography display={'inline-block'} variant='body1' color='text.secondary'>
                            {t("landing.pricing.card.perYear")}
                        </Typography>
                    </Typography>
                    <Box display={'flex'} alignItems={'center'} gap={1}
                    sx={{bgcolor: "primary.light", px: 2, py: 1, borderRadius: 2}}>
                        <Star fontSize='12' sx={{color: mode === "light" ? "primary.main" : "#fff"}}/>
                        <Typography variant='body1' sx={{color: mode === "light" ? "primary.main" : "#fff"}}>
                            {t("landing.pricing.card.perYearLabel")} 
                        </Typography>
                    </Box>
                    <Typography variant='body1' color='text.secondary'>
                        {t("landing.pricing.card.cancellation")} 
                    </Typography>
                    <Box width={"100%"} sx={{bgcolor: "background.default"}} mt={1} p={4}>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>
                                {t("landing.pricing.card.features.1")} 
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>
                                {t("landing.pricing.card.features.2")} 
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.3")} 
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.4")} 
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.5")} 
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
                            <CheckCircle sx={{color: "success.main"}}/>
                            <Typography variant='body1'>                               
                                {t("landing.pricing.card.features.6")} 
                            </Typography>
                        </Box>
                        <Button variant='contained' sx={{height: "50px", bgcolor: "primary.main",
                            color: "#fff", width: "100%", fontSize: 18, fontWeight: 600,
                            boxShadow: (theme) =>
                            `0px 6px 20px ${theme.palette.primary.main}80`,
                            mt: 2
                        }} onClick={() => handleSubscription("price_1SzIOGRSGDklsSzWwHehWPwv")}>
                            {t("landing.pricing.card.button")}
                        </Button>
                    </Box>
                </Card>
            </Stack>
        </Container>
    </Box>

    {/* CTA */}
    <Box id="cta" py={10} sx={{bgcolor: "primary.light"}}>
        <Container maxWidth="lg">
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
                <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                    Ready to digitize your menu? 
                </Typography>
                <Typography variant='body1' textAlign={'center'} color='text.secondary'>
                    Start saving time and money with MENEX. No credit card required for the free trial.
                </Typography>
                <Button variant='contained' sx={{height: "50px", color: "#fff",
                    boxShadow: (theme) =>
                            `0px 6px 20px ${theme.palette.primary.main}80`,
                    fontSize: 18, fontWeight: 600
                }} onClick={() => navigate("get-started")}>
                    {t("landing.startFree")}
                </Button>
            </Box>
        </Container>
    </Box>
    {/* footer */}
    <Box sx={{bgcolor: "background.paper"}} py={10}>
        <Container maxWidth="lg">
            <Stack flexDirection={{xs: "column", md:"row"}} gap={8} alignItems={{xs: "center", md: "flex-start"}} mb={3}
            justifyContent={'center'}>
                <Box flex={1.1} display={'flex'} flexDirection={'column'} gap={2}
                alignItems={{xs: 'center', md: "flex-start"}}>
                    <Box component={"img"} src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
                    sx={{objectFit: "contain"}}/>
                    <Typography variant='body1' color='text.secondary' textAlign={{xs: "center", md: "left"}} width={{xs: "70%", md: "100%"}}>
                        The smartest way to manage your restaurant menus. Digital, fast, and eco-friendly.
                    </Typography>
                    <Box display={'flex'} alignItems={"center"} gap={0}>
                        <IconButton>
                            <Facebook/>
                        </IconButton>
                        <IconButton>
                            <Instagram/>
                        </IconButton>
                    </Box>
                </Box>
                <Box flex={1} display={'flex'} flexDirection={{xs: "row", md: "column"}}
                alignItems={'center'}>
                    <Box>
                        <Typography variant='body1' fontWeight={700} fontSize={18}>
                            Product
                        </Typography>
                        <Box display={'flex'} flexDirection={{xs: "row", md: "column"}} gap={3}
                        mt={2}>
                            <Typography variant='body1' color='text.secondary'>
                                Features
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                Pricing
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                Our restaurants
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box flex={1} display={'flex'} flexDirection={{xs: "row", md: "column"}}
                alignItems={'center'}>
                    <Box>
                        <Typography variant='body1' fontWeight={700} fontSize={18}>
                            Legal
                        </Typography>
                        <Box display={'flex'} flexDirection={{xs: "row", md: "column"}} gap={3}
                        mt={2}>
                            <Typography variant='body1' color='text.secondary'>
                                Privacy Policy
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                Terms of Service
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Stack>
            <Divider/>
            <Typography variant='body1' color='text.secondary' mt={3}
            textAlign={{xs: "center", md: "left"}}>
                {new Date().getFullYear()} © MENEX. All rights reserved.
            </Typography>
        </Container>
    </Box>
    </>
  )
}

export default Home