import { Avatar, Box, Container, Paper, Typography, Grid, Chip, Button, Menu, MenuItem, IconButton, useTheme} from '@mui/material';
import React, { useEffect, useState } from 'react'
import api from '../api';
import { ArrowForward, Language, LocationOn, Phone } from '@mui/icons-material';
import menexLogo from "../assets/logo-png.png"
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
const apiUrl = import.meta.env.VITE_API_URL;

const PublicRestaurantLayout = ({restaurant}) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const {t, i18n} = useTranslation();
    const [arabicFonts, setArabicFonts] = useState(["Cairo", "Amiri", "Almarai"]);
    const theme = useTheme();
    
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

    const isArabic = i18n.language === "ar";
    const fontFamily = isArabic ? (arabicFonts.includes(theme.typography.fontFamily) ? theme.typography.fontFamily : "Cairo") : theme.typography.fontFamily;

  return (
    <>
    <Box sx={{bgcolor: "background.default", pt: 5, fontFamily}}>
    <Container maxWidth="lg" >
        <Box display={'flex'} alignItems={'center'} gap={0} onClick={handleOpenLang}
        sx={{cursor: "pointer"}}>
            <IconButton>
                <Language/>
            </IconButton>
            <Typography variant='body1' fontWeight={700} color='text.primary'>
                {i18n.language?.toUpperCase()}
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
        <Paper elevation={1} sx={{width: "100%", overflow: "hidden", justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box width={"100%"} height={"5px"} sx={{bgcolor: "primary.main", padding: 0}}/>
            <Box display={'flex'} justifyContent={'center'} mt={4}>
                <Box component={"img"}
                src={`${apiUrl}/images/${restaurant?.logoUrl}`}
                width={"100px"} height={"100px"}
                sx={{objectFit: "cover"}}/>
            </Box>
            <Box textAlign={'center'} mt={2} width={"80%"}>
                <Typography variant="h3" fontWeight={700} sx={{color: "text.primary", fontFamily}}
                fontSize={{xs: "32px", md: "42px"}}>
                    {restaurant?.name}
                </Typography>
                <Typography variant='body1' color='text.secondary' lineHeight={1.6} mt={2} sx={{fontFamily}}>
                    {restaurant?.description}
                </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} mt={2} mb={4} flexDirection={{xs: 'column', sm: "row"}} gap={2} p={4}>
                <Box px={2} py={1} sx={{bgcolor: "#fcfcfc"}} borderRadius={1} border={"1px solid #999"}
                display={'flex'} alignItems={'center'} gap={1}>
                    <LocationOn></LocationOn>
                    <Typography display={"inline-block"} sx={{fontFamily}}>
                        {restaurant?.address}
                    </Typography>
                </Box>
                <Box px={2} py={1} sx={{bgcolor: "#fcfcfc"}} borderRadius={1} border={"1px solid #999"} display={'flex'} alignItems={'center'} gap={1}>
                    <Phone></Phone>
                    <Typography display={"inline-block"} sx={{fontFamily}}>
                        {restaurant?.phone}
                    </Typography>
                </Box>
            </Box>
        </Paper>
        <Box mt={7}>
            <Typography variant='h5' fontSize={32} fontWeight={700} color='text.primary' sx={{fontFamily}}>
                {t("public.ourMenus")}
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{fontFamily}}>
                {t("public.ourMenusDescription")}
            </Typography>
            <Grid container spacing={2} my={3}>
                {restaurant?.menus?.map(menu => (
                    <Grid size={{xs: 12, sm: 6, md: 4}} key={menu.id}>
                        <Paper elevation={1} sx={{width: "100%", position: 'relative', overflow: 'hidden', cursor: 'pointer',transition: "transform 0.2s ease-in-out", "&:hover": {transform: "translateY(-5px)"}}}>
                            <Chip label={menu.active ? "Active" : "Inactive"}  sx={{position: 'absolute', top: "5%", right: "5%", fontWeight: 600,
                                bgcolor: "background.default",
                                color: menu.active ? "primary.main" : "error.main",
                                fontSize: "16px",
                                borderRadius: 1,
                                fontFamily
                            }}/>
                            <Box
                            component={"img"}
                            src={`${apiUrl}/images/${menu.imageUrl}`}
                            width={"100%"} height={"250px"}
                            sx={{objectFit: "cover"}}/>
                            <Box px={4} minHeight={"150px"} mt={2}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={"100%"}>
                                    <Typography variant='h5' fontWeight={600} textAlign={'center'} sx={{fontFamily}}>
                                        {menu.name}
                                    </Typography>
                                    <Chip label={`${menu.itemsCount} items`} sx={{fontFamily}}/>
                                </Box>
                                <Typography variant='body1' color={"text.secondary"} 
                                textAlign={{xs: 'center', md: 'left'}} mt={2}
                                  sx={{
                                      display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 4,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontFamily
                                }} fontSize={14}>
                                    {menu.description}
                                </Typography>
                            </Box>
                            <Box px={4} py={3}>
                                <Button endIcon={<ArrowForward/>} fullWidth variant='contained'
                                sx={{color: "background.default", height: "40px", bgcolor: "primary.main", fontFamily}} onClick={() => {
                                    navigate(`/${menu.restaurant.slug}/${menu.id}`) 
                                }}>
                                    {t("public.viewMenu")}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Container>
    <Box width={"100%"} sx={{bgcolor: "background.paper"}} display={'flex'} justifyContent={'center'} alignItems={'center'}
    flexDirection={'column'} p={4}>
        <Box component={'img'}
        src={menexLogo}
        width={"200px"} height={"100px"}
        sx={{objectFit: "contain"}}/>
        <Typography sx={{fontFamily}}>
                {new Date().getFullYear()} | Powered by Menex.
        </Typography>
    </Box>
    </Box>
    </>
  )
}

export default PublicRestaurantLayout