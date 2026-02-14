import { Email, Lock } from '@mui/icons-material'
import { Box, Button, Card, CircularProgress, Divider, FormControl, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import api from "../api"
import Swal from 'sweetalert2'
import { useThemeMode } from '../main'

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {mode, setMode} = useThemeMode();

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
                Login
            </Typography>

            <Divider sx={{my: 3, borderColor: "divider"}}></Divider>

            <form action="#" onSubmit={handleSubmit}>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <Email sx={{display: {xs: "none", sm: "block"}, color:'primary.main'}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <OutlinedInput
                            id="email"
                            label="Email"
                            autoFocus
                            fullWidth
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{color: "text.primary"}}/>
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
                            sx={{color: "text.primary"}}/>
                        </FormControl>
                    </Box>
                </Stack>
                <Typography variant='body1' color='primary.main'
                component= "a" href='/forgot-password'
                sx={{textDecoration: "none", display: "inline-block"}} mt={3}>
                    Forgot your password?
                </Typography>
                <Button type="sumbit" variant='contained' sx={{mt: 2, height: "50px"}} fullWidth
                disabled={loading ? true : false} startIcon={loading && <CircularProgress size={20}/>}>
                    {loading ? "logging you in..." : "Login"}
                </Button>
            </form>
        </Card>
    </Box>
    </>
  )
}

export default Login