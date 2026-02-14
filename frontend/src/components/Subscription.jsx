import { Bedtime, CheckCircle, Language, LightMode, Star, SupportAgent } from '@mui/icons-material'
import { Box, Button, Card, Container, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeMode } from '../main'
import api from '../api'
import logo from "../assets/logo-png.png"
import logoDark from "../assets/logo-dark-png.png"
import i18n from '../i18n'

const Subscription = () => {

    const {t} = useTranslation();
    const {mode, setMode} = useThemeMode();
    const [anchorEl, setAnchorEl] = useState(null);

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
    <Box>
        <Box width={"100%"} height={"100px"} display={'flex'} alignItems={'center'}
        sx={{bgcolor: "background.paper"}}>
            <Container maxWidth="lg" sx={{display: "flex", justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Box component={"img"}
                src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
                sx={{objectFit: "contain"}}/>
                <Box display={'flex'} alignItems={"center"} gap={5}>
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
                <Button sx={{
                    height: "40px",
                    display: {xs: "none", md: "flex"}
                }} variant='outlined' startIcon={<SupportAgent/>}>
                    Contact Us
                </Button>
                </Box>
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
    </Box>
    </>
  )
}

export default Subscription