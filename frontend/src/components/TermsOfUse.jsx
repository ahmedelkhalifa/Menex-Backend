import { 
  Box, Button, IconButton, Menu, MenuItem, Typography, 
  Container, Paper, Divider, useTheme, 
  Drawer,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import { Bedtime, Facebook, Instagram, Language, LightMode, Login, Start } from '@mui/icons-material';
import i18n from '../i18n';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../main';
import logo from "../assets/logo-png.png";
import logoDark from "../assets/logo-dark-png.png";
import { useTranslation } from 'react-i18next';

// --- HELPER COMPONENT FOR SECTIONS ---
const TermSection = ({ title, contentKeys, t }) => {
  return (
    <Box mb={4}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight={700} color="primary.main">
        {t(title)}
      </Typography>
      <Box sx={{
        '& ul': { pl: 3, mb: 2 }, // Style the HTML <ul>
        '& li': { mb: 1 },        // Style the HTML <li>
        '& strong': { fontWeight: 600, color: 'text.primary' } // Ensure bold text uses theme color
      }}>
        {contentKeys.map((key) => (
          <Typography 
            key={key} 
            variant="body1" 
            color="text.secondary" 
            paragraph
            dangerouslySetInnerHTML={{ __html: t(key) }} // <--- This renders your HTML tags
          />
        ))}
      </Box>
    </Box>
  );
};

const TermsOfUse = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, setMode } = useThemeMode();
  const [openDrawer, setOpenDrawer] = useState(false); // Added missing state for mobile menu
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  
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

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      
      {/* --- NAVBAR (Your Existing Code) --- */}
      <Box width={"100%"} height={"100px"} position={"fixed"} top={0} left={0} sx={{
          bgcolor: "background.paper", px: {xs: 2, md: 10}, py: 2, borderBottom: 1, borderColor: "divider"
      }} zIndex={100} display="flex" justifyContent="space-between" alignItems={'center'}>
          <Box component={'img'} src={mode === "light" ? logo : logoDark} width={"150px"} height={"50px"}
          sx={{objectFit: "contain"}}/>
          
          {/* Mobile Menu Icon */}
          <IconButton sx={{display: {xs: 'block', lg: "none"}}} onClick={() => setOpenDrawer(true)}>
              <MenuIcon/>
          </IconButton>

          <Box gap={7} alignItems={'center'} display={{xs: "none", lg: "flex"}}>
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
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    component={"label"} onClick={() => navigate("/contact-us")} sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }}}>
                        {t("landing.support")}
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
                </Box>
                <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Button variant='outlined' 
                    color='success' sx={{height: "40px", width: "fit-content", px: 4}}
                    onClick={() => navigate("login")} startIcon={<Login/>}>
                        {t("landing.login")}
                    </Button>
                    <Button variant='contained' sx={{bgcolor: "success.main", color: "#fff", height: "40px", width: "150px", fontWeight: 700}} onClick={() => navigate("signup")} startIcon={<Start/>}>
                        {t("landing.register")}
                    </Button>
                </Box>
            </Box>
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
                      <Typography variant='body1' color='text.secondary' fontWeight={600}
                      component={"label"} onClick={() => navigate("/contact-us")} textAlign={'center'} sx={{textDecoration: 'none', cursor: 'pointer',
                          transition: "0.2s ease-in-out",
                          '&:hover': {
                              color: "primary.main"
                          }}}>
                          {t("landing.support")}
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
                                  {i18n.language === "en" && "EN"}
                                  {i18n.language === "tr" && "TR"}
                                  {i18n.language === "ar" && "AR"}
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

      {/* --- TERMS OF USE CONTENT START --- */}
      <Container maxWidth="md" sx={{ mt: 18, pb: 10 }}> 
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4 }}>
          
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
              {t('termsOfUse.pageTitle')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {t('termsOfUse.lastUpdated')}
            </Typography>
          </Box>

          {/* Intro */}
          <Box mb={4}>
            <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: t('termsOfUse.intro.welcome') }} />
            <Box sx={{ 
              bgcolor: 'error.light', 
              color: 'error.dark', 
              p: 2, 
              borderRadius: 2, 
              borderLeft: '4px solid', 
              borderColor: 'error.main' 
            }}>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('termsOfUse.intro.warning') }} />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Sections */}
          <TermSection t={t} title="termsOfUse.section1.title" 
            contentKeys={['termsOfUse.section1.entity', 'termsOfUse.section1.eligibility', 'termsOfUse.section1.jurisdiction']} />
            
          <TermSection t={t} title="termsOfUse.section2.title" 
            contentKeys={['termsOfUse.section2.creation', 'termsOfUse.section2.privacy', 'termsOfUse.section2.security']} />
            
          <TermSection t={t} title="termsOfUse.section3.title" 
            contentKeys={['termsOfUse.section3.nature', 'termsOfUse.section3.ip', 'termsOfUse.section3.maintenance', 'termsOfUse.section3.pricing']} />
            
          <TermSection t={t} title="termsOfUse.section4.title" 
            contentKeys={['termsOfUse.section4.method', 'termsOfUse.section4.noRefund', 'termsOfUse.section4.cancellation']} />
            
          <TermSection t={t} title="termsOfUse.section5.title" 
            contentKeys={['termsOfUse.section5.ownership', 'termsOfUse.section5.monitoring', 'termsOfUse.section5.prohibited']} />
            
          <TermSection t={t} title="termsOfUse.section6.title" 
            contentKeys={['termsOfUse.section6.accuracy', 'termsOfUse.section6.limitation', 'termsOfUse.section6.indemnification']} />
            
          <TermSection t={t} title="termsOfUse.section7.title" 
            contentKeys={['termsOfUse.section7.rights', 'termsOfUse.section7.consequences']} />

          <TermSection t={t} title="termsOfUse.section8.title" 
            contentKeys={['termsOfUse.section8.amicable', 'termsOfUse.section8.jurisdiction']} />

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('termsOfUse.footer.changes')}
            </Typography>
            <Box sx={{ 
              display: 'inline-block', 
              bgcolor: 'action.hover', 
              p: 3, 
              borderRadius: 2, 
              mt: 2, 
              textAlign: 'left' ,
              width: {xs: '100%', sm: '80%', md: '60%'}
            }}>
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: t('termsOfUse.footer.contact') }} />
            </Box>
          </Box>

        </Paper>
      </Container>
      {/* footer */}
      <Box sx={{bgcolor: "background.paper"}} py={10}>
          <Container maxWidth={"lg"}>
              <Stack flexDirection={{xs: "column", md:"row"}} gap={10} alignItems={{xs: "flex-start", md: "flex-start", p: {xs: 5, md: 0}}} mb={3}
              justifyContent={'center'}>
                  <Box flex={1.1} display={'flex'} flexDirection={'column'} gap={2}
                  alignItems={{xs: 'center', md: "flex-start"}}>
                      <Box component={"img"} src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
                      sx={{objectFit: "contain"}}/>
                      <Typography variant='body1' color='text.secondary' textAlign={{xs: "center", md: "left"}} width={{xs: "70%", md: "100%"}}>
                          {t("landing.footer.desc")}
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
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}
                  flex={1.5} flexDirection={{xs: "column", md: "row"}} gap={2}>
                      <Box flex={1} display={'flex'} flexDirection={{xs: "row", md: "column"}}
                      alignItems={'center'}>
                          <Box>
                              <Typography variant='body1' fontWeight={700} fontSize={18}>
                                  {t("landing.footer.product")}
                              </Typography>
                              <Box display={'flex'} flexDirection={{xs: "row", md: "column"}} gap={3}
                              mt={2}>
                                  <Typography variant='body1' color='text.secondary'
                                  component={"a"} href="#features" sx={{textDecoration: 'none'}}>
                                      {t("landing.footer.features")}
                                  </Typography>
                                  <Typography variant='body1' color='text.secondary'
                                  component={"a"} href="#pricing" sx={{textDecoration: 'none'}}>
                                      {t("landing.footer.pricing")}
                                  </Typography>
                                  <Typography variant='body1' color='text.secondary'>
                                      {t("landing.footer.blog")}
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                      <Box flex={1} display={'flex'} flexDirection={{xs: "row", md: "column"}}
                      alignItems={'center'}>
                          <Box>
                              <Typography variant='body1' fontWeight={700} fontSize={18}>
                                  {t("landing.footer.support")}
                              </Typography>
                              <Box display={'flex'} flexDirection={{xs: "row", md: "column"}} gap={3}
                              mt={2}>
                                  <Typography variant='body1' color='text.secondary'
                              component={"label"} onClick={() => navigate("/contact-us")}
                              sx={{cursor: "pointer"}}>
                                      {t("landing.footer.contact")}
                                  </Typography>
                                  <Typography variant='body1' color='text.secondary'>
                                      {t("landing.footer.FAQ")}
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                      <Box flex={1} display={'flex'} flexDirection={{xs: "row", md: "column"}}
                      alignItems={'center'}>
                          <Box>
                              <Typography variant='body1' fontWeight={700} fontSize={18}>
                                  {t("landing.footer.legal")}
                              </Typography>
                              <Box display={'flex'} flexDirection={{xs: "row", md: "column"}} gap={3}
                              mt={2}>
                                  <Typography variant='body1' color='text.secondary'>
                                      {t("landing.footer.privacy")}
                                  </Typography>
                                  <Typography variant='body1' color='text.secondary'>
                                      {t("landing.footer.terms")}
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
              </Stack>
              <Divider/>
              <Typography variant='body1' color='text.secondary' mt={3}
              textAlign={{xs: "center", md: "left"}}>
                  {new Date().getFullYear()} © MENEX. {t("landing.footer.copyright")}.
              </Typography>
          </Container>
      </Box>
    </Box>
  );
};

export default TermsOfUse;