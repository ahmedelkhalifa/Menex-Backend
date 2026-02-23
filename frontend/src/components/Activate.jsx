import { Box, Button, Card, CircularProgress, Container, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import logo from "../assets/logo-png.png"
import logoDark from "../assets/logo-dark-png.png"
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from '../main'
import { Bedtime, Email, Language, LightMode, Send, SupportAgent } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import api from '../api'
import i18n from '../i18n'


const Activate = () => {
  const {mode, setMode} = useThemeMode();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

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

  async function resendEmail() {
    try {
      setLoading(true);
      const response = await api.post("/auth/resend-email", {
        email: sessionStorage.getItem("email")
      });
      Swal.fire({
        title: "Success",
        text: "Email sent, check your inbox",
        icon: "success",
        showCloseButton: true
      })
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Can't resend email, try again";
      Swal.fire({
        title: "Oops...",
        text: message,
        icon: "error",
        showCloseButton: true
      })
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
    <Box>
      <Box width={"100%"} height={"100px"} display={'flex'} alignItems={'center'}>
        <Container maxWidth="lg" sx={{display: "flex", justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Box component={"img"}
          src={mode === "light" ? logo : logoDark} width={"200px"} height={"60px"}
          sx={{objectFit: "contain", cursor: "pointer"}} onClick={() => navigate("/")}/>
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
          boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}50`
        }}>
          <Box width={"100px"} height={"100px"} borderRadius={"50%"}
          sx={{
            bgcolor: "primary.main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Email fontSize='large' sx={{color: "background.default"}}/>
          </Box>
          <Typography variant='h4' fontWeight={800} textAlign={"center"} mt={2}
          color='primary.dark'>
            {t("activate.title")}
          </Typography>
          <Typography variant='body1' color='text.secondary' textAlign={'center'}>
            {t("activate.desc1")} <br/>
            <b>{sessionStorage.getItem("email")}</b><br/>
            {t("activate.desc2")}
          </Typography>
          <Button variant='contained' sx={{
            bgcolor: "primary.main",
            color: "background.default",
            height: "50px",
            py: 2,
            px: 4,
            width: "fit-content",
            mt: 2,
            fontSize: {xs: "14px", md: "18px"}
          }} startIcon={loading ? <CircularProgress size={20}/> : <Send/>}
          onClick={resendEmail} disabled={loading}>
            {t("activate.btn")}
          </Button>
          <Typography variant='body1' color='text.secondary' mt={2} textAlign={'center'}>
            {t("activate.emailNotRecieved")} <b>{t("activate.checkSpam")}</b>
          </Typography>
        </Card>
      </Box>
    </Box>
    </>
  )
}

export default Activate