import { Email, Lock } from '@mui/icons-material'
import { Box, Button, Card, CircularProgress, Divider, FormControl, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import api from "../api"
import Swal from 'sweetalert2'

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        try {
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
        } catch (error) {
            console.error(error);
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
    <Box height={'100vh'} bgcolor={"#eee"} display={'flex'}
    alignItems={'center'} justifyContent={'center'}>
        <Card sx={{py: 7, px: 3, width: {xs: "300px", sm: "600px"}, textAlign: "center"}}>
            <Typography variant='h4' color='primary' fontWeight={700}>
                Login
            </Typography>

            <Divider sx={{my: 3}}></Divider>

            <form action="#" onSubmit={handleSubmit}>
                <Stack direction={'row'} gap={2} alignItems={'center'}>
                    <Email color='primary' sx={{display: {xs: "none", sm: "block"}}}/>
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
                            onChange={(e) => setEmail(e.target.value)}/>
                        </FormControl>
                    </Box>
                </Stack>
                <Stack direction={'row'} gap={2} alignItems={'center'} mt={3}>
                    <Lock color='primary' sx={{display: {xs: "none", sm: "block"}}}/>
                    <Box sx={{width: '100%'}}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                            id="password"
                            label="Password"
                            fullWidth
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                        </FormControl>
                    </Box>
                </Stack>
                <Typography variant='body1' color='primary'
                component= "a" href='/forgot-password'
                sx={{textDecoration: "none", display: "inline-block"}} mt={3}>
                    Forgot your password?
                </Typography>
                <Button type="sumbit" variant='contained' sx={{mt: 2}} fullWidth
                disabled={loading ? true : false} startIcon={loading && <CircularProgress/>}>
                    {loading ? "logging you in..." : "Login"}
                </Button>
            </form>
        </Card>
    </Box>
    </>
  )
}

export default Login