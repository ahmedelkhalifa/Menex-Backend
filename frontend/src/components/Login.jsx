import { ArrowBack, Email, Lock } from '@mui/icons-material'
import { Box, Button, Card, CircularProgress, Container, Divider, FormControl, InputLabel, Modal, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import api from "../api"
import Swal from 'sweetalert2'
import { useThemeMode } from '../main'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import logo from "../assets/logo-png.png"
import logoDark from "../assets/logo-dark-png.png"

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {mode, setMode} = useThemeMode();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);

    async function handleReset(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.put("reset-password", {
                email
            });
            sessionStorage.setItem("email", email);
            window.location.href = "/forgot-password";
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: t("forgotPassword.errorAlert.title"),
                text: t("forgotPassword.errorAlert.message"),
                icon: "error",
                showCloseButton: true
            })
        } finally {
            setLoading(false);
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            sessionStorage.setItem("email", email);
            setLoading(true);
            e.preventDefault();
            const response = await api.post("/auth/login", {
                email,
                password
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("lang", response.data.language);
            i18n.changeLanguage(response.data.language);
            console.log(response.data.language)
            if (response.data.role === "SUPER_ADMIN") {
                window.location.href = "/admin-dashboard";
            }
            else if (response.data.role === "RESTAURANT_OWNER") {
                window.location.href = "/owner-dashboard";
            }
            else if (response.data.role === "UNSUBSCRIBER") {
                window.location.href = "/subscription";
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) {
                window.location.href = "/activate";
                return;
            }
            const message = error.response?.data?.message || "Can't login, try again";
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
    <Box height={'100vh'} sx={{bgcolor: "background.default"}} display={'flex'}
    alignItems={'center'} justifyContent={'center'}>
        <Box width={"100%"} height={"100px"} sx={{bgcolor: "background.paper", flexShrink: 0}} display={'flex'}
        alignItems={"center"} position={"absolute"} top={0} left={0}>
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
                        {t("contact.backToHome")}
                    </Typography>
                </Box>
            </Container>
        </Box>
        <Card sx={{py: 7, px: 3, width: {xs: "300px", sm: "600px"}, textAlign: "center",
    bgcolor: "background.card"}}>
            <Typography variant='h4' color='primary.main' fontWeight={700}>
                {t("landing.account.login")}
            </Typography>

            <Divider sx={{my: 3, borderColor: "divider"}}></Divider>

            <form action="#" onSubmit={handleSubmit}>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <Email sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="email">{t("landing.account.email")}</InputLabel>
                            <OutlinedInput
                            id="email"
                            label={t("landing.account.email")}
                            autoFocus
                            fullWidth
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{color: "text.primary"}}
                            autoComplete='off' required/>
                        </FormControl>
                    </Box>
                </Stack>
                <Stack direction={'row'} gap={2} alignItems={'center'} mt={3}>
                    <Lock sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="password">{t("landing.account.password")}</InputLabel>
                            <OutlinedInput
                            id="password"
                            label={t("landing.account.password")}
                            fullWidth
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                </Stack>
                <Typography variant='body1' color='primary.main'
                component= "label" onClick={() => setOpen(true)}
                sx={{textDecoration: "none", display: "block", cursor: "pointer"}} mt={3}>
                    {t("landing.account.forgotPassword")}
                </Typography>
                <Typography variant='body1' color='primary.main'
                component= "label" onClick={() => navigate('/signup')}
                sx={{textDecoration: "none", display: "block", cursor: "pointer"}} mt={1}>
                    {t("landing.account.dontHaveAccount")}
                </Typography>
                <Button type="submit" variant='contained' sx={{mt: 2, height: "50px"}} fullWidth
                disabled={loading ? true : false} startIcon={loading && <CircularProgress size={20}/>}>
                    {loading ? t("landing.account.loginLoading") : t("landing.account.login")}
                </Button>
            </form>
        </Card>
    </Box>
    <Modal 
    open={open} onClose={() => setOpen(false)}
    sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Card sx={{p: 4, width: {xs: "80%", md: "500px", bgcolor: "background.paper"}}}>
            <Typography variant='h5' fontWeight={700} color='primary.main'>
                {t("forgotPassword.title")}
            </Typography>
            <TextField value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth label={t("forgotPassword.emailLabel")} sx={{mt: 3}}
            type='email'/>
            <Button variant='contained' fullWidth sx={{mt: 2, height: "50px"}} onClick={handleReset}
            disabled={loading} startIcon={loading && <CircularProgress size={20}/>}>
                {t("forgotPassword.submitButton")}
            </Button>
        </Card>
    </Modal>
    </>
  )
}

export default Login