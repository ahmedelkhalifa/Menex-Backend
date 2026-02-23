import { Badge, Box, Button, Chip, Container, Grid, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowForward, Language, Numbers } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
const apiUrl = import.meta.env.VITE_API_URL;

import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';

const BigMenuDivider = ({ variant = "flourish", color }) => {
  const theme = useTheme();

  // Use the theme's primary color by default, but make it much softer.
  // A solid red line across the screen is too aggressive; a 30% opacity feels elegant.
  const baseColor = color || theme.palette.primary.main;
  const subtleFill = alpha(baseColor, 0.15);
  const subtleStroke = alpha(baseColor, 0.4);

  const dividerStyles = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Much larger vertical spacing to make it a prominent design element
    my: 8, 
    overflow: 'hidden' // Ensures SVG doesn't cause horizontal scrollbar
  };

  // Ensure SVGs stretch the full width and maintain aspect ratio nicely
  const commonSvgProps = {
    width: "100%",
    height: "auto",
    style: { maxHeight: '60px', minHeight: '30px' } // Limits height so it doesn't get absurdly tall on huge screens
  };

  return (
    <Box sx={dividerStyles}>
      {/* VARIANT 1: Flourish - Classic, high-end restaurant feel. A central element with tapering lines. */}
      {variant === "flourish" && (
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" {...commonSvgProps}>
          <path d="M0,30 C300,30 450,10 600,10 C750,10 900,30 1200,30" stroke={subtleStroke} strokeWidth="1" fill="none"/>
          <path d="M0,30 C300,30 450,50 600,50 C750,50 900,30 1200,30" stroke={subtleStroke} strokeWidth="1" fill="none"/>
          {/* Central Diamond/Leaf Motif */}
          <path d="M580,30 L600,10 L620,30 L600,50 Z" fill={subtleFill} stroke={subtleStroke} />
          <circle cx="560" cy="30" r="4" fill={subtleFill} />
          <circle cx="640" cy="30" r="4" fill={subtleFill} />
        </svg>
      )}

      {/* VARIANT 2: Organic - A repeating natural vine/leaf pattern. Feels fresh. */}
      {variant === "organic" && (
       <svg viewBox="0 0 1200 40" preserveAspectRatio="xMidYMid slice" {...commonSvgProps}>
         <pattern id="leafPattern" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
           <path d="M0 20 Q 25 0, 50 20 Q 75 40, 100 20" stroke={subtleStroke} fill="none" strokeWidth="1.5"/>
           <path d="M25 20 C 25 10, 40 10, 40 20 C 40 30, 25 30, 25 20" fill={subtleFill}/>
           <path d="M75 20 C 75 10, 60 10, 60 20 C 60 30, 75 30, 75 20" fill={subtleFill}/>
         </pattern>
         <rect x="0" y="0" width="100%" height="40" fill="url(#leafPattern)" />
       </svg>
      )}

      {/* VARIANT 3: Geometric - A traditional, repeating arabesque/tile pattern. Good for regional cuisine. */}
      {variant === "geometric" && (
        <svg viewBox="0 0 1200 40" preserveAspectRatio="xMidYMid slice" {...commonSvgProps}>
           <pattern id="geoPattern" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
             <path d="M0 20 L 10 10 L 30 10 L 40 20 L 30 30 L 10 30 Z" fill="none" stroke={subtleStroke} strokeWidth="1.5" />
             <path d="M40 20 L 50 10 L 70 10 L 80 20 L 70 30 L 50 30 Z" fill={subtleFill} stroke="none" />
             <circle cx="40" cy="20" r="3" fill={subtleStroke}/>
           </pattern>
           <rect x="0" y="0" width="100%" height="40" fill="url(#geoPattern)" opacity="0.8"/>
           <line x1="0" y1="1" x2="100%" y2="1" stroke={subtleStroke} strokeWidth="0.5"/>
           <line x1="0" y1="39" x2="100%" y2="39" stroke={subtleStroke} strokeWidth="0.5"/>
        </svg>
      )}

      {/* VARIANT 4: Minimal fade - Modern and clean. Two lines fading out towards the edges. */}
      {variant === "minimal" && (
        <Box sx={{ width: '100%', height: '20px', position: 'relative' }}>
            <Box sx={{
                position: 'absolute', top: '4px', left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent 0%, ${subtleStroke} 50%, transparent 100%)`
            }}/>
             <Box sx={{
                position: 'absolute', bottom: '4px', left: 0, right: 0, height: '1px',
                background: `linear-gradient(90deg, transparent 10%, ${alpha(baseColor, 0.2)} 50%, transparent 90%)`
            }}/>
        </Box>
      )}
    </Box>
  );
};

BigMenuDivider.propTypes = {
    variant: PropTypes.oneOf(['flourish', 'organic', 'geometric', 'minimal']),
    color: PropTypes.string,
};

const MenuBackground = ({ variant = "layered-waves", color }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  // Uses your primary color (red) but makes it extremely faint (3% to 8% opacity).
  // This ensures your text remains 100% readable.
  const baseColor = color || theme.palette.primary.main;

  return (
    <Box 
      sx={{ 
        position: 'fixed', // Stays in place while the user scrolls
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 0, // Puts it behind all your content
        overflow: 'hidden',
        pointerEvents: 'none', // Crucial: ensures it doesn't block clicks on your buttons!
        bgcolor: 'background.default' // Keeps your cream background color
      }}
    >
      {/* VARIANT 1: LAYERED WAVES - Smooth, overlapping shapes on the top-right and bottom-left */}
      {variant === "layered-waves" && (
        <>
          {/* Top Right Wave */}
          <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: { xs: '80%', md: '50%' }, opacity: 0.8, transform: isRTL ? 'scaleX(-1)' : 'none' }}>
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
              <path 
                d="M500 0H0C150 50 200 200 350 300C450 366.667 500 450 500 500V0Z" 
                fill={`url(#gradient-tr)`} 
              />
              <defs>
                <linearGradient id="gradient-tr" x1="250" y1="0" x2="250" y2="500" gradientUnits="userSpaceOnUse">
                  <stop stopColor={alpha(baseColor, 0.08)} />
                  <stop offset="1" stopColor={alpha(baseColor, 0.01)} />
                </linearGradient>
              </defs>
            </svg>
          </Box>

          {/* Bottom Left Wave */}
          <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: { xs: '100%', md: '43%' }, opacity: 0.8, transform: isRTL ? 'scaleX(-1)' : 'none' }}>
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
              <path 
                d="M0 500H500C350 450 250 300 150 200C50 133.333 0 50 0 0V500Z" 
                fill={`url(#gradient-bl)`} 
              />
              <defs>
                <linearGradient id="gradient-bl" x1="250" y1="500" x2="250" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor={alpha(baseColor, 0.06)} />
                  <stop offset="1" stopColor={alpha(baseColor, 0.0)} />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </>
      )}

      {/* VARIANT 2: FLUID EDGES - Continuous vertical waves hugging the sides of the screen */}
      {variant === "fluid-edges" && (
        <>
          <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '30vw', opacity: 0.5, transform: isRTL ? 'scaleX(-1)' : 'none' }}>
            <svg viewBox="0 0 200 1000" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path 
                d="M0 0 H50 C 150 250, -50 750, 100 1000 H0 Z" 
                fill={alpha(baseColor, 0.04)} 
              />
              <path 
                d="M0 0 H20 C 100 300, -80 700, 60 1000 H0 Z" 
                fill={alpha(baseColor, 0.06)} 
              />
            </svg>
          </Box>
          <Box sx={{ position: 'absolute', top: 0, right: 0, height: '100vh', width: '30vw', opacity: 0.5, transform: isRTL ? 'scaleX(-1)' : 'none' }}>
            <svg viewBox="0 0 200 1000" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path 
                d="M200 0 H150 C 50 250, 250 750, 100 1000 H200 Z" 
                fill={alpha(baseColor, 0.04)} 
              />
            </svg>
          </Box>
        </>
      )}
    </Box>
  );
};



const PublicMenuLayout = ({menu}) => {

    const [tabValue, setTabValue] = useState(0);
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
    <Box sx={{bgcolor: "background.default", pb: 10, fontFamily}} minHeight={"100vh"} zIndex={1}>
    <Box display={'flex'} alignItems={'center'} gap={0} onClick={handleOpenLang}
    sx={{cursor: "pointer"}} position={'absolute'} top={"5%"} right={"5%"} zIndex={100}>
        <IconButton>
            <Language sx={{color: "background.default"}}/>
        </IconButton>
        <Typography variant='body1' fontWeight={700} color='background.default' sx={{fontFamily}}>
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
    <Box width={"100%"} height={"350px"} position={'relative'} zIndex={1}>
        <Box component={"img"} src={`${apiUrl}/images/${menu?.imageUrl}`}
        width={"100%"} height={"100%"} sx={{objectFit: "cover", borderRadius: "0 0 20% 20%"}}/>
        <Box position={"absolute"} top={0} left={0} width={"100%"} height={"100%"}
        sx={{bgcolor: "primary.main", opacity: "0.6", borderRadius: "0 0 20% 20%"}}/>
        <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            zIndex: 1,
            textAlign: "center"
            }}>
            <Typography variant='h1' fontSize={{xs: "32px", md: "96px"}} fontWeight={600} sx={{color: "background.default", fontFamily}}>
                {menu.name}
            </Typography>
            <Typography variant='body1' fontSize={{xs: 12, md: 16}} sx={{color: "background.default", fontFamily}} mt={1}>
                {menu.description}
            </Typography>
        </Box>
    </Box>
    <MenuBackground variant="layered-waves"/>
    <Container maxWidth="lg" sx={{zIndex: 20, position: "relative"}}>
      <Typography variant='h5' fontWeight={600} color='text.primary' mt={5} mb={1} sx={{fontFamily}}>
        {t("public.categories")}
      </Typography>
      <Tabs variant='scrollable' scrollButtons="auto" value={tabValue}
      onChange={(e, v) => setTabValue(v)} sx={{ "& .MuiTab-root": { fontFamily } }}>
            <Tab label={t("public.allCategories")}/>
            {menu.categories.map(category => (
                <Tab label={`${category.name} (${category.menuItemsCount})`} key={category.id}/>
            ))}
      </Tabs>
      <Box mt={5}>
        {tabValue === 0 ? (
            menu.categories.map((category, index) => (
                <React.Fragment key={category.id}>
                <Box display="flex" gap={2} alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight={600} sx={{fontFamily}}>
                        {category.name}
                    </Typography>
                    <Chip label={`${category.menuItemsCount} ${t("public.items")}`} sx={{fontFamily}} />
                </Box>
                <Grid container spacing={2} mb={3}>
                    {menu.menuItems
                    .filter(item => item.categoryId === category.id)
                    .map(item => (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={item.id}>
                        <Paper
                            elevation={1}
                            sx={{
                                width: "100%",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-5px)" }
                        }}
                        >
                            <Chip
                            label={item.available ? t("public.available") : t("public.unavailable")}
                            sx={{
                                position: "absolute",
                                top: "5%",
                                right: "5%",
                                fontWeight: 600,
                                bgcolor: "background.default",
                                color: item.available ? "primary.main" : "error.main",
                                fontSize: "16px",
                                borderRadius: 1,
                                fontFamily
                            }}
                            />
                            <Box
                            component="img"
                            src={`${apiUrl}/images/${item.imageUrl}`}
                            width="100%"
                            height="250px"
                            sx={{ objectFit: "contained" }}
                            />
                            <Box px={4} minHeight="160px" mt={2}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                width="100%"
                                gap={2}
                            >
                                <Typography
                                variant="h5"
                                fontWeight={600}
                                textAlign="left"
                                flex={2.5}
                                sx={{fontFamily}}
                                >
                                {item.name}
                                </Typography>
                                <Box flex={1} width={"100%"} textAlign={'center'}>
                                    <Typography variant='h6' fontWeight={700} display={'inline-block'} color='primary.main' sx={{fontFamily}}>
                                        {item.price}
                                        <Typography variant='h6' fontWeight={700} display={'inline-block'} sx={{fontFamily}}>
                                            {item.currency === "USD" && "$"}
                                            {item.currency === "TL" && "₺"}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign={{ xs: "left", md: "left" }}
                                mt={2}
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontFamily
                                }}
                                fontSize={14}
                            >
                                {item.description}
                            </Typography>
                            </Box>
                            <Box px={4} py={3}>
                            <Button
                                endIcon={<ArrowForward />}
                                fullWidth
                                variant="contained"
                                sx={{
                                color: "background.default",
                                height: "40px",
                                bgcolor: "primary.main",
                                fontFamily
                            }}
                            onClick={() => {
                                navigate(`/${menu.restaurant.slug}/${item.id}`);
                            }}
                            >
                                {t("public.viewItem")}
                            </Button>
                            </Box>
                        </Paper>
                        </Grid>
                    ))}
                </Grid>
                {(() => {
                    // Don't show a divider after the very last category
                    if (index < menu.categories.length - 1) {
                        // Cycle through the divider variants for a nice visual variety
                        const variantCycle = ['geometric', 'organic', 'flourish', 'minimal'];
                        const variant = variantCycle[index % variantCycle.length];
                        return <BigMenuDivider variant={variant} />;
                    }
                    return null;
                })()}
                </React.Fragment>
            ))
        ) : (
            <>
            <Box display={'flex'} gap={2} alignItems={'center'}>
                <Typography variant='h5' fontWeight={600} color='text.primary' sx={{fontFamily}}>
                    {menu.categories[tabValue - 1]?.name}
                </Typography>
                <Chip label={`${menu.categories[tabValue - 1]?.menuItemsCount} items`} sx={{fontFamily}}/>
            </Box>
            <Grid container spacing={2} mt={3}>
                {menu.menuItems
                    .filter(item => item.categoryId === menu.categories[tabValue - 1]?.id)
                    .map(item => (
                        <Grid size={{xs: 12, md: 4}} key={item.id} mb={3}>
                        <Paper
                            elevation={1}
                            sx={{
                                width: "100%",
                                position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-5px)" }
                            }}
                        >
                            <Chip
                            label={item.available ? "Available" : "Unavailable"}
                            sx={{
                                position: "absolute",
                                top: "5%",
                                right: "5%",
                                fontWeight: 600,
                                bgcolor: "background.default",
                                color: item.available ? "primary.main" : "error.main",
                                fontSize: "16px",
                                borderRadius: 1,
                                fontFamily
                            }}
                            />
                            <Box
                            component="img"
                            src={`${apiUrl}/images/${item.imageUrl}`}
                            width="100%"
                            height="250px"
                            sx={{ objectFit: "contained" }}
                            />
                            <Box px={4} minHeight="160px" mt={2}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                width="100%"
                                gap={2}
                                >
                                <Typography
                                variant="h5"
                                fontWeight={600}
                                textAlign="left"
                                flex={2.5}
                                sx={{fontFamily}}
                                >
                                {item.name}
                                </Typography>
                                <Box flex={1} width={"100%"} textAlign={'center'}>
                                    <Typography variant='h6' fontWeight={700} display={'inline-block'} color='primary.main' sx={{fontFamily}}>
                                        {item.price}
                                        <Typography variant='h6' fontWeight={700} display={'inline-block'} sx={{fontFamily}}>
                                            {item.currency === "USD" && "$"}
                                            {item.currency === "TL" && "₺"}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign={{ xs: "left", md: "left" }}
                                mt={2}
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontFamily
                                }}
                                fontSize={14}
                            >
                                {item.description}
                            </Typography>
                            </Box>
                            <Box px={4} py={3}>
                            <Button
                                endIcon={<ArrowForward />}
                                fullWidth
                                variant="contained"
                                sx={{
                                    color: "background.default",
                                    height: "40px",
                                    bgcolor: "primary.main",
                                    fontFamily
                                }}
                                onClick={() => {
                                    navigate(`/${menu.restaurant.slug}/${item.id}`);
                                }}
                                >
                                View Item
                            </Button>
                            </Box>
                        </Paper>
                        </Grid>
                    ))}
            </Grid>
            </>
            )}

      </Box>
    </Container>
    </Box>
    </>
  )
}

export default PublicMenuLayout