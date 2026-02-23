import { Email, Lock } from '@mui/icons-material'
import { Alert, Box, Button, Card, CircularProgress, Divider, FormControl, InputLabel, Modal, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from "../api"
import Swal from 'sweetalert2'
import { useThemeMode } from '../main'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const ResetPassword = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {mode, setMode} = useThemeMode();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState("");

    async function handleReset(e) {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: t("profile.security.errorAlert.title"),
                    text: t("profile.security.passwordMismatchMessage"),
                    icon: "error",
                    showCloseButton: true
                })
                return;
            } if (password.length < 8) {
                Swal.fire({
                    title: t("profile.security.errorAlert.title"),
                    text: t("profile.security.passwordLengthMessage"),
                    icon: "error",
                    showCloseButton: true
                })
                return;
            }
            setLoading(true);
            const response = await api.put("auth/reset-password", {
                token,
                password
            });
            Swal.fire({
                title: t("forgotPassword.successAlert.title"),
                text: t("forgotPassword.successAlert.reset"),
                icon: "success",
                showCloseButton: true
            })
            navigate("/");
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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        i18n.changeLanguage(localStorage.getItem("lang") || "en");
        if (token) {
            setToken(token);
        } else {
            Swal.fire({
                title: t("forgotPassword.errorAlert.invalidLink"),
                text: t("forgotPassword.errorAlert.invalidLinkDesc"),
                icon: "error",
                showCloseButton: true
            })
            navigate("/");
        }
    }, [])

  return (
    <>
    <Box height={'100vh'} sx={{bgcolor: "background.default"}} display={'flex'}
    alignItems={'center'} justifyContent={'center'}>
        <Card sx={{py: 7, px: 3, width: {xs: "300px", sm: "600px"}, textAlign: "center",
    bgcolor: "background.card"}}>
            <Typography variant='h4' color='primary.main' fontWeight={700}>
                {t("profile.security.resetPassword")}
            </Typography>

            <Divider sx={{my: 3, borderColor: "divider"}}></Divider>

            <form action="#" onSubmit={handleReset}>
                <Stack direction={'row'} gap={2} alignItems={'center'} mt={3}>
                    <Lock sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="password">{t("profile.security.newPasswordLabel")}</InputLabel>
                            <OutlinedInput
                            id="password"
                            label={t("profile.security.newPasswordLabel")}
                            fullWidth
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                </Stack>
                <Stack direction={'row'} gap={2} alignItems={'center'} mt={3}>
                    <Lock sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="confirmPassword">{t("profile.security.confirmNewPasswordLabel")}</InputLabel>
                            <OutlinedInput
                            id="confirmPassword"
                            label={t("profile.security.confirmNewPasswordLabel")}
                            fullWidth
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                </Stack>
                {(password !== confirmPassword && confirmPassword !== "") && (
                    <Alert severity="error" sx={{ my: 2,
                            bgcolor: "error.light",
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350',
                            '& .MuiAlert-icon': {
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350', // Keeps the icon the bright red you like
                            }
                            }}>{t("profile.security.passwordMismatchMessage")}</Alert>
                )}
                <Button type="submit" variant='contained' sx={{mt: 2, height: "50px"}} fullWidth
                disabled={loading || password !== confirmPassword || !password || !confirmPassword} startIcon={loading && <CircularProgress size={20}/>}>
                    {loading ? t("profile.security.resetPasswordLoading") : t("profile.security.resetPassword")}
                </Button>
            </form>
        </Card>
    </Box>
    </>
  )
}

export default ResetPassword