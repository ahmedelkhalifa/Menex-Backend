import { Box, Button, Card, CircularProgress, Container, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import logo from "../assets/logo-png.png"
import logoDark from "../assets/logo-dark-png.png"
import { Navigate, useNavigate } from 'react-router-dom'
import { useThemeMode } from '../main'
import { Bedtime, Check, Clear, Email, LabelImportant, Language, LightMode, Send, SupportAgent } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import api from '../api'
import i18n from '../i18n'


const Verification = () => {
  const {mode, setMode} = useThemeMode();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");


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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('verified') === 'true') {
        setVerified(true);
    } 
    else {
        setVerified(false);
        setError(params.get('error'))
    }
  }, []);

  return (
    <>
    <Box>
      <Box width={"100%"} height={"100px"} display={'flex'} alignItems={'center'}>
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
            <Button sx={{
              height: "40px",
              display: {xs: "none", md: "flex"}
            }} variant='outlined' startIcon={<SupportAgent/>}>
              {t("landing.support")}
            </Button>
          </Box>
        </Container>
      </Box>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={5}>
        <Card sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          p: 4,
          width: {xs: "80vw", md: "600px"},
          boxShadow: verified ? (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}50` : (theme) =>
                        `0px 6px 20px ${theme.palette.error.main}50`
        }}>
          <Box width={"100px"} height={"100px"} borderRadius={"50%"}
          sx={{
            bgcolor: verified ? "primary.main" : "error.main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {verified ? <Check fontSize='large' sx={{color: "background.default"}}/> :
            <Clear fontSize='large' sx={{color: "background.default"}}/>}
          </Box>
          <Typography variant='h4' fontWeight={800} textAlign={"center"} mt={2}
          color={verified ? "primary.dark" : "error.main"}>
            {verified ? "Your account is verified" : (
                error === "expired" ? "Token is expired" : "Invalid token"
            )}
          </Typography>
          <Typography variant='body1' color='text.secondary' textAlign={'center'}>
            {verified ? "Your account has been verified successfully.\nYou are one step away from degitizing your menus" : (
                error === "expired" ? "The token is now expired, To have new verification token please try to login again and click \"Resend Email\" button." : 
                "The token is invalid, For security reasons you will need to create your account again."
            )}
          </Typography>
          {verified && (
            <Button variant='contained' sx={{
                bgcolor: "primary.main",
                color: "background.default",
                height: "50px",
                py: 2,
                px: 4,
                width: "fit-content",
                mt: 2,
                fontSize: "18px"
            }} startIcon={<LabelImportant/>}
            onClick={() => navigate("/subscription")}>
                SUBSCRIBE NOW
            </Button>
          )}
        </Card>
      </Box>
    </Box>
    </>
  )
}

export default Verification