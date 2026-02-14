import { Email, Lock, Person } from '@mui/icons-material'
import { Alert, Box, Button, Card, CircularProgress, Divider, FormControl, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import api from "../api"
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { useThemeMode } from '../main'

const Signup = () => {
    
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("RESTAURANT_OWNER");
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();
    const {mode, setMode} = useThemeMode();

    async function handleSubmit(e) {
        try {
            sessionStorage.setItem("email", email);
            setLoading(true);
            e.preventDefault();
            if (password !== confirmPassword) {
                Swal.fire({
                    title: "Oops...",
                    text: "Passwords do not match",
                    icon: "error",
                    showCloseButton: true
                })
                return;
            }
            if (password.length < 8) {
                Swal.fire({
                    title: "Oops...",
                    text: "Password must be at least 8 characters",
                    icon: "error",
                    showCloseButton: true
                })
                return;
            }
            const response = await api.post("/auth/signup", {
                email,
                password,
                firstname,
                lastname,
                role
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("lang", response.data.language);
            window.location.href = "/activate"
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Can't signup, try again";
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
                Signup
            </Typography>

            <Divider sx={{my: 3, borderColor: "divider"}}></Divider>

            <form action="#" onSubmit={handleSubmit}>
                <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'} sx={{width: "100%"}}>
                    <Person sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="firstname">First name</InputLabel>
                            <OutlinedInput
                            id="firstname"
                            label="First name"
                            autoFocus
                            fullWidth
                            type='text'
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="lastname">Last name</InputLabel>
                            <OutlinedInput
                            id="lastname"
                            label="Last name"
                            fullWidth
                            type='text'
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                </Stack>
                <Stack direction={'row'} gap={2} alignItems={'center'} mt={3}>
                    <Email sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <OutlinedInput
                            id="email"
                            label="Email"
                            fullWidth
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                </Stack>
                <Stack direction={'row'} gap={2} alignItems={'center'} mt={3}>
                    <Lock sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                            id="password"
                            label="Password"
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
                            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                            <OutlinedInput
                            id="confirmPassword"
                            label="Confirm Password"
                            fullWidth
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            sx={{color: "text.primary"}} required/>
                        </FormControl>
                    </Box>
                </Stack>
                <Typography variant='body1' color='primary.main'
                component= "a" href='/login'
                sx={{textDecoration: "none", display: "inline-block"}} mt={3}>
                    Already have an account? Login
                </Typography>
                {(password !== confirmPassword && confirmPassword !== "") && (
                    <Alert severity="error" sx={{ my: 2,
                            bgcolor: "error.light",
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350',
                            '& .MuiAlert-icon': {
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350', // Keeps the icon the bright red you like
                            }
                         }}>{t("profile.security.passwordMismatchMessage")}</Alert>
                )}
                <Button type="sumbit" variant='contained' sx={{mt: 2, height: "50px"}} fullWidth
                disabled={loading || password !== confirmPassword || !password || !confirmPassword} startIcon={loading && <CircularProgress size={20}/>}>
                    {loading ? "Signing up..." : "Signup"}
                </Button>
            </form>
        </Card>
    </Box>
    </>
  )
}

export default Signup