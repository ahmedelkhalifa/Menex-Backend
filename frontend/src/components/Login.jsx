import { Email, Lock } from '@mui/icons-material'
import { Box, Button, Card, CircularProgress, Divider, FormControl, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import api from "../api"
import Swal from 'sweetalert2'
import { useThemeMode } from '../main'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {mode, setMode} = useThemeMode();
    const navigate = useNavigate();
    const {t} = useTranslation();

    async function handleSubmit(e) {
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
                component= "label" onClick={() => navigate('/forgot-password')}
                sx={{textDecoration: "none", display: "block", cursor: "pointer"}} mt={3}>
                    {t("landing.account.forgotPassword")}
                </Typography>
                <Typography variant='body1' color='primary.main'
                component= "label" onClick={() => navigate('/signup')}
                sx={{textDecoration: "none", display: "block", cursor: "pointer"}} mt={1}>
                    {t("landing.account.dontHaveAccount")}
                </Typography>
                <Button type="sumbit" variant='contained' sx={{mt: 2, height: "50px"}} fullWidth
                disabled={loading ? true : false} startIcon={loading && <CircularProgress size={20}/>}>
                    {loading ? t("landing.account.loginLoading") : t("landing.account.login")}
                </Button>
            </form>
        </Card>
    </Box>
    </>
  )
}

export default Login