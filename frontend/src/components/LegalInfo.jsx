import { 
  Box, Button, IconButton, Menu, MenuItem, Typography, 
  Container, Paper, Divider, Drawer, Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import { Bedtime, Facebook, Instagram, Language, LightMode, Login, Start } from '@mui/icons-material';
import i18n from '../i18n';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../main';
import logo from "../assets/logo-png.png";
import logoDark from "../assets/logo-dark-png.png";
import { useTranslation } from 'react-i18next';

// --- HELPER COMPONENT FOR SECTIONS ---
const PolicySection = ({ title, contentKeys, t }) => {
  return (
    <Box mb={4}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight={700} color="primary.main">
        {t(title)}
      </Typography>
      <Box sx={{
        '& ul': { pl: 3, mb: 2 }, 
        '& li': { mb: 1 },        
        '& strong': { fontWeight: 600, color: 'text.primary' } 
      }}>
        {contentKeys.map((key) => (
          <Typography 
            key={key} 
            variant="body1" 
            color="text.secondary" 
            paragraph
            dangerouslySetInnerHTML={{ __html: t(key) }} 
          />
        ))}
      </Box>
    </Box>
  );
};

const LegalInfo = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, setMode } = useThemeMode();
  const [openDrawer, setOpenDrawer] = useState(false); 
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleFooterClick = (section) => {
    navigate("/", { state: { scrollTo: section } });
  };
  
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
      
      {/* --- NAVBAR --- */}
      <Box width={"100%"} height={"100px"} position={"fixed"} top={0} left={0} sx={{
          bgcolor: "background.paper", px: {xs: 2, md: 10}, py: 2, borderBottom: 1, borderColor: "divider"
      }} zIndex={100} display="flex" justifyContent="space-between" alignItems={'center'}>
          <Box component={'img'} src={mode === "light" ? logo : logoDark} width={"150px"} height={"50px"}
          sx={{objectFit: "contain", cursor: "pointer"}} onClick={() =>
                        navigate("/")
        }   />
          
          {/* Mobile Menu Icon */}
          <IconButton sx={{display: {xs: 'block', lg: "none"}}} onClick={() => setOpenDrawer(true)}>
              <MenuIcon/>
          </IconButton>

          <Box gap={7} alignItems={'center'} display={{xs: "none", lg: "flex"}}>
                <Box display={'flex'} gap={3} alignItems={'center'}>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }
                    }} onClick={() => handleFooterClick("features")}>
                        {t("landing.featuresNav")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' fontWeight={600} sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }}} onClick={() => handleFooterClick("howItWorks")}>
                        {t("landing.howItWorks")}
                    </Typography>
                    <Typography variant='body1' color='text.secondary' fontWeight={600}
                    sx={{textDecoration: 'none', cursor: 'pointer',
                        transition: "0.2s ease-in-out",
                        '&:hover': {
                            color: "primary.main"
                        }}} onClick={() => handleFooterClick("pricing")}>
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
                            minWidth: anchorEl?.clientWidth,
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
                    onClick={() => navigate("/login")} startIcon={<Login/>}>
                        {t("landing.login")}
                    </Button>
                    <Button variant='contained' sx={{bgcolor: "success.main", color: "#fff", height: "40px", width: "150px", fontWeight: 700}} onClick={() => navigate("/signup")} startIcon={<Start/>}>
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
                      }} onClick={() => {
                        setOpenDrawer(false);
                        handleFooterClick("features");
                      }} textAlign={'center'}>
                          {t("landing.featuresNav")}
                      </Typography>
                      <Typography variant='body1' color='text.secondary' fontWeight={600}
                      component={"a"} href='#howItWorks' sx={{textDecoration: 'none', cursor: 'pointer',
                          transition: "0.2s ease-in-out",
                          '&:hover': {
                              color: "primary.main"
                          }
                      }} onClick={() => {
                        setOpenDrawer(false);
                        handleFooterClick("howItWorks");
                      }} textAlign={'center'}>
                          {t("landing.howItWorks")}
                      </Typography>
                      <Typography variant='body1' color='text.secondary' fontWeight={600}
                      component={"a"} href='#pricing' sx={{textDecoration: 'none', cursor: 'pointer',
                          transition: "0.2s ease-in-out",
                          '&:hover': {
                              color: "primary.main"
                          }
                      }} onClick={() => {
                        setOpenDrawer(false);
                        handleFooterClick("pricing");
                      }} textAlign={'center'}>
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
                                  minWidth: anchorEl?.clientWidth,
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

      {/* --- PRIVACY POLICY CONTENT START --- */}
      <Container maxWidth="md" sx={{ mt: 18, pb: 10 }}> 
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4 }}>
          
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
              {t('privacyPolicy.pageTitle')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {t('privacyPolicy.lastUpdated')}
            </Typography>
          </Box>

          {/* Intro */}
          <Box mb={4}>
            <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: t('privacyPolicy.intro.welcome') }} />
            <Box sx={{ 
              bgcolor: 'primary.light', 
              color: 'primary.dark', 
              p: 2, 
              borderRadius: 2, 
              borderLeft: '4px solid', 
              borderColor: 'primary.main' 
            }}>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('privacyPolicy.intro.warning') }} />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Sections mapped to the JSON keys */}
          <PolicySection t={t} title="privacyPolicy.section1.title" 
            contentKeys={['privacyPolicy.section1.owners', 'privacyPolicy.section1.endUsers', 'privacyPolicy.section1.analytics']} />
            
          <PolicySection t={t} title="privacyPolicy.section2.title" 
            contentKeys={['privacyPolicy.section2.purpose', 'privacyPolicy.section2.communications', 'privacyPolicy.section2.payments']} />
            
          <PolicySection t={t} title="privacyPolicy.section3.title" 
            contentKeys={['privacyPolicy.section3.hosting', 'privacyPolicy.section3.sharing', 'privacyPolicy.section3.cookies']} />
            
          <PolicySection t={t} title="privacyPolicy.section4.title" 
            contentKeys={['privacyPolicy.section4.retention', 'privacyPolicy.section4.deletion']} />
            
          <PolicySection t={t} title="privacyPolicy.section5.title" 
            contentKeys={['privacyPolicy.section5.rights', 'privacyPolicy.section5.removal']} />

          <Divider sx={{ my: 4 }} />

          {/* Content Footer */}
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('privacyPolicy.footer.changes')}
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
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: t('privacyPolicy.footer.contact') }} />
            </Box>
          </Box>

        </Paper>
      </Container>

      {/* --- FOOTER --- */}
      <Box sx={{bgcolor: "background.paper"}} py={10}>
          <Container maxWidth={"lg"}>
              <Stack flexDirection={{xs: "column", md:"row"}} gap={10} alignItems={{xs: "flex-start", md: "flex-start", p: {xs: 5, md: 0}}} mb={3}
              justifyContent={'center'}>
                  <Box flex={1.1} display={'flex'} flexDirection={'column'} gap={2}
                  alignItems={{xs: 'center', md: "flex-start"}}>
                      <Box component={"img"} src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
                      sx={{objectFit: "contain", cursor: "pointer"}} onClick={() =>
                        navigate("/")
                      }/>
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
                                  component={"a"} href="#features" sx={{textDecoration: 'none'}}
                                  onClick={() => handleFooterClick("features")}>
                                      {t("landing.footer.features")}
                                  </Typography>
                                  <Typography variant='body1' color='text.secondary'
                                  component={"a"} href="#pricing" sx={{textDecoration: 'none'}}
                                  onClick={() => handleFooterClick("pricing")}>
                                      {t("landing.footer.pricing")}
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
                                  {/* Privacy is highlighted here since we are on the Privacy page */}
                                  <Typography variant='body1' color='primary.main' fontWeight={700}>
                                      {t("landing.footer.privacy")}
                                  </Typography>
                                  {/* Terms is now clickable to go back */}
                                  <Typography 
                                    component={Link}
                                    to="/terms"
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ cursor: "pointer", textDecoration: "none" }}
                                    onClick={() => window.scrollTo(0, 0)}>
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

export default LegalInfo