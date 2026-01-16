import { Avatar, Box, Button, Divider, Drawer, FormControl, Grid, IconButton, MenuItem, Paper, Select, Skeleton, Stack, TextField, Tooltip, Typography, useTheme} from '@mui/material'
import React, { useState, useEffect } from 'react'
import OwnerSidebar from './OwnerSidebar'
import { Cancel, Edit, Menu, Save } from '@mui/icons-material';
import { useThemeMode } from '../main';
import api from '../api';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';


const Profile = () => {
    const theme = useTheme();
    const {mode, setMode} = useThemeMode();
    function handleChange() {
        setMode((prev) => prev === "light" ? "dark" : "light");
    }
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({
        id: 1,
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    });
    const [fixedName, setFixedName] = useState({
        firstName: "",
        lastName: ""
    });
    const firstname = fixedName.firstName;
    const lastname = fixedName.lastName;
    const [editMode, setEditMode] = useState(false);
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);

    async function handleUpdate() {
        try {
            const response = await api.put(`users/${user.id}`, {
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                role: user.role
            });
            setFixedName(user);
            const userData = {
                id: response.data.id,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                role: localStorage.getItem("role")
            };
            setUser(userData);
            setEditMode(false);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile updated successfully.',
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to update profile data.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        }
        console.log("Updated user data:", user);
    };

    useEffect(() => {
        async function getProfile() {
            try {
                const response = await api.get("users/profile");
                const userData = {
                    id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    role: localStorage.getItem("role")
                };
                setUser(userData);
                setFixedName(userData);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch profile data.',
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                });
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    },[])
  return (
    <>
    <Box>
      <Box position={'absolute'} top={'5%'} left={'8%'} display={{sm: "block", md: "none"}}>
        <IconButton onClick={() => setOpen(true)}>
          <Menu sx={{color: "text.primary"}}/>
        </IconButton>
        <Drawer
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}>
          {user.role === "RESTAURANT_OWNER" ? (
            <OwnerSidebar view={"phone"} subname={"Restaurant Owner"}/>
          ) : (
            <Sidebar view={"phone"} subname={"Super Admin"}/>
          )}
        </Drawer>
      </Box>
      <Box display={'flex'} bgcolor={"background.default"} gap={2}>
        {user.role === "RESTAURANT_OWNER" ? (
            <OwnerSidebar view={"desktop"} subname={"Restaurant Owner"}/>
          ) : (
            <Sidebar view={"desktop"} subname={"Super Admin"}/>
          )}
        <Box flex={4} p={5} mt={{xs: 8, md: 0}}>
            <Box>
                <Stack direction={'row'} alignItems={'center'} gap={2} mb={3}>
                    <Avatar sx={{width: 70, height: 70, bgcolor: theme.palette.primary.main, fontSize: 40}}></Avatar>
                    <Box display={'flex'} flexDirection={{xs: 'column', md: 'row'}} alignItems={{xs: 'flex-start', md: 'center'}} gap={{xs: 0, md: 2}}>
                        {loading ? (
                            <Skeleton variant="text" width={200} height={40} />
                        ) : (
                            <>
                            <Typography variant='h4' color='text.primary' fontWeight={700} sx={{textTransform: 'capitalize'}}>
                                {firstname + " " + lastname}
                            </Typography>
                            <Typography variant='h6' color='text.secondary' fontWeight={500}>
                                ({user.role === 'RESTAURANT_OWNER' ? 'Restaurant Owner' : "Super Admin"})
                            </Typography>
                            </>
                        )}
                    </Box>
                </Stack>
            </Box>
            <Paper elevation={3} sx={{p: loading ? 0 : 3, bgcolor: 'background.paper'}}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={"315px"} />
                ) : (
                <>
                <Typography variant='h5' color='text.primary' fontWeight={600} mb={2}>
                    Basic Info
                </Typography>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Grid container spacing={2}>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label="First name" fullWidth
                        inputProps={{readOnly: !editMode}} 
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        autoFocus={editMode}/>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label="Last name" fullWidth inputProps={{readOnly: !editMode}}
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}/>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label="Email" fullWidth inputProps={{readOnly: !editMode}}
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}/>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label="Role" fullWidth inputProps={{readOnly: true}} 
                        value={user.role}/>
                    </Grid>
                </Grid>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mt: 2}}></Divider>
                <Box mt={2} display={'flex'} justifyContent={'flex-start'} gap={2}>
                    <Tooltip title="Edit Profile">
                        <IconButton onClick={() => setEditMode(true)} sx={{bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'}}}>
                            <Edit sx={{color: 'background.default'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Update">
                        <IconButton onClick={handleUpdate} sx={{bgcolor: 'success.main', '&:hover': {bgcolor: 'success.dark'}}} disabled={!editMode}>
                            <Save sx={{color: 'background.default'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                        <IconButton onClick={() => setEditMode(false)} sx={{bgcolor: 'error.main', '&:hover': {bgcolor: 'error.dark'}}} disabled={!editMode}>
                            <Cancel sx={{color: 'background.default'}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
                </>
                )}
            </Paper>
            <Paper elevation={3} sx={{p: loading ? 0 : 3, bgcolor: 'background.paper', mt: 3}}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={"150px"} />
                ) : (
                <>
                <Typography variant='h5' color='text.primary' fontWeight={600} mb={2}>
                    Security
                </Typography>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Grid container spacing={2}>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <Button variant='contained' sx={{bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'}}} fullWidth>
                            Change Password
                        </Button>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <Button variant='contained' sx={{bgcolor: 'error.main', '&:hover': {bgcolor: 'error.dark'}, color: '#FFF'}} fullWidth>
                            Logout
                        </Button>
                    </Grid>
                </Grid>
                </>
                )}  
            </Paper>
            <Paper elevation={3} sx={{p: loading ? 0 : 3, bgcolor: 'background.paper', mt: 3}}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={"315px"} />
                ) : (
                <>
                <Typography variant='h5' color='text.primary' fontWeight={600} mb={2}>
                    Prefrences
                </Typography>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <Typography variant='h6' color='text.secondary' fontWeight={600}>
                            Language
                        </Typography>
                        <FormControl fullWidth sx={{mt: 1}}>
                            <Select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                displayEmpty
                                fullWidth
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="tr">Türkçe</MenuItem>
                                <MenuItem value="ar">العربية</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item size={12}>
                        <Typography variant='h6' color='text.secondary' fontWeight={600}>
                            Dark mode
                        </Typography>
                        <FormControl fullWidth sx={{mt: 1}}>
                            <Select
                                value={theme.palette.mode}
                                displayEmpty
                                fullWidth
                                onChange={handleChange}
                            >
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                </>
                )}
            </Paper>
        </Box>
      </Box>
    </Box>
    </>
  )
}

export default Profile