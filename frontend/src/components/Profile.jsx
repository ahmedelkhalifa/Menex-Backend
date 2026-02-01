import { Alert, Avatar, Box, Button, CircularProgress, Divider, Drawer, FormControl, Grid, IconButton, MenuItem, Modal, Paper, Select, Skeleton, Stack, TextField, Tooltip, Typography, useTheme} from '@mui/material'
import React, { useState, useEffect } from 'react'
import OwnerSidebar from './OwnerSidebar'
import { Cancel, Edit, LockReset, Menu, Save } from '@mui/icons-material';
import { useThemeMode } from '../main';
import api from '../api';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';


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
        role: "",
        language: "en"
    });
    const [fixedName, setFixedName] = useState({
        firstName: "",
        lastName: ""
    });
    const firstname = fixedName.firstName;
    const lastname = fixedName.lastName;
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    

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
                title: t("profile.successAlert.title"),
                text: t("profile.successAlert.message"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || t("profile.errorAlert.updateMessage");
            Swal.fire({
                icon: 'error',
                title: t("profile.errorAlert.title"),
                text: message,
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        }
        console.log("Updated user data:", user);
    };

    async function handleLanguageChange(e) {
        const language = e.target.value;
        setUser({ ...user, language: language });
        try {
            const response = await api.put(`users/${user.id}/updateLanguage?language=${language}`);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update language preference.',
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } finally {
            i18n.changeLanguage(language);
            localStorage.setItem("lang", language);
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        try {
            setLoading(true);
            if (newPassword !== confirmNewPassword) {
                setOpenModal(false);
                Swal.fire({
                    icon: 'error',
                    title: t("profile.security.errorAlert.title"),
                    text: t("profile.security.passwordMismatchMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                });
                return;
            }
            await api.put(`auth/change-password`, {
                oldPassword: oldPassword,   
                newPassword: newPassword
            });
            Swal.fire({
                icon: 'success',
                title: t("profile.security.successAlert.title"),
                text: t("profile.security.successAlert.message"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } catch (error) {   
            console.error(error);
            const message = error.response?.data?.message || t("profile.security.errorAlert.message");
            Swal.fire({ 
                icon: 'error',
                title: t("profile.security.errorAlert.title"),
                text: message,
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } finally {
            setLoading(false);
            setOpenModal(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        }
    }



    useEffect(() => {
        async function getProfile() {
            try {
                const response = await api.get("users/profile");
                const userData = {
                    id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    role: localStorage.getItem("role"),
                    language: response.data.language
                };
                setUser(userData);
                setFixedName(userData);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: t("profile.errorAlert.title"),
                    text: t("profile.errorAlert.fetchMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                });
            } finally {
                setLoading(false);
            }
        }
        async function validateToken() {
            try {
            const response = await api.get("auth/validate");
            console.log(response.data);
            } catch (error) {
            localStorage.clear();
            window.location.href = "/login";
            }
        }
        validateToken();
        getProfile();
    },[])
    const {t} = useTranslation();
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
          {localStorage.getItem("role") === "RESTAURANT_OWNER" ? (
            <OwnerSidebar view={"phone"}/>
          ) : (
            <Sidebar view={"phone"}/>
          )}
        </Drawer>
      </Box>
      <Box display={'flex'} bgcolor={"background.default"} gap={2}>
        {localStorage.getItem("role") === "RESTAURANT_OWNER" ? (
            <OwnerSidebar view={"desktop"}/>
          ) : (
            <Sidebar view={"desktop"}/>
          )}
        <Box flex={5} p={5} mt={{xs: 8, md: 0}}>
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
                                ({user.role === 'RESTAURANT_OWNER' ? t("profile.restaurantOwner") : t("profile.superAdmin")})
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
                    {t("profile.basicInfo")}
                </Typography>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Grid container spacing={2}>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label={t("profile.firstnameLabel")} fullWidth
                        inputProps={{readOnly: !editMode}} 
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        autoFocus={editMode}/>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label={t("profile.lastnameLabel")} fullWidth inputProps={{readOnly: !editMode}}
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}/>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label={t("profile.emailLabel")} fullWidth inputProps={{readOnly: !editMode}}
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}/>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <TextField label={t("profile.role")} fullWidth inputProps={{readOnly: true}} 
                        value={user.role}/>
                    </Grid>
                </Grid>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mt: 2}}></Divider>
                <Box mt={2} display={'flex'} justifyContent={'flex-start'} gap={2}>
                    <Tooltip title={t("profile.editButton")}>
                        <IconButton onClick={() => setEditMode(true)} sx={{bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'}}}>
                            <Edit sx={{color: 'background.default'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("profile.updateButton")}>
                        <IconButton onClick={handleUpdate} sx={{bgcolor: 'success.main', '&:hover': {bgcolor: 'success.dark'}}} disabled={!editMode}>
                            <Save sx={{color: 'background.default'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("profile.cancel")}>
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
                    {t("profile.security.title")}
                </Typography>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Grid container spacing={2}>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <Button variant='contained' sx={{bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'}}} fullWidth onClick={() => setOpenModal(true)}>
                            {t("profile.security.changePasswordTitle")}
                        </Button>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <Button variant='contained' sx={{bgcolor: 'error.main', '&:hover': {bgcolor: 'error.dark'}, color: '#FFF'}} fullWidth>
                            {t("profile.security.logout")}
                        </Button>
                    </Grid>
                </Grid>
                </>
                )}  
            </Paper>
            <Modal
                open={openModal}
                onClose={() => {setOpenModal(false); setOldPassword(""); setNewPassword(""); setConfirmNewPassword("");}}
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '400px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h5" component="h2" fontWeight={600}>
                        {t("profile.security.changePasswordTitle")}
                    </Typography>
                    <Typography color='text.secondary' sx={{mt: 1}}>
                        {t("profile.security.changePasswordDescription")}
                    </Typography>
                    <form action="#" onSubmit={handleChangePassword}>
                        <TextField
                            label={t("profile.security.currentPasswordLabel")}
                            type="password"
                            fullWidth
                            sx={{mt: 2}}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label={t("profile.security.newPasswordLabel")}
                            type="password"
                            fullWidth
                            sx={{mt: 2}}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label={t("profile.security.confirmNewPasswordLabel")}
                            type="password"
                            fullWidth
                            sx={{mt: 2}}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        {(newPassword !== confirmNewPassword && confirmNewPassword !== "") && (
                            <Alert severity="error" sx={{mt: 2}}>{t("profile.security.passwordMismatchMessage")}</Alert>
                        )}
                        <Button
                            variant="contained"
                            sx={{mt: 2, bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'}}}
                            fullWidth
                            type='submit'
                            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <LockReset />}
                            disabled={loading || newPassword !== confirmNewPassword || !oldPassword || !newPassword || !confirmNewPassword}
                        >
                            {loading ? t("profile.security.changePasswordButtonLoading") : t("profile.security.changePasswordButton")}
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Paper elevation={3} sx={{p: loading ? 0 : 3, bgcolor: 'background.paper', mt: 3}}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={"315px"} />
                ) : (
                <>
                <Typography variant='h5' color='text.primary' fontWeight={600} mb={2}>
                    {t("profile.preferences.title")}
                </Typography>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <Typography variant='h6' color='text.secondary' fontWeight={600}>
                            {t("profile.preferences.languageLabel")}
                        </Typography>
                        <FormControl fullWidth sx={{mt: 1}}>
                            <Select
                                value={user.language}
                                onChange={(e) => handleLanguageChange(e)}
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
                            {t("profile.preferences.darkModeLabel")}
                        </Typography>
                        <FormControl fullWidth sx={{mt: 1}}>
                            <Select
                                value={theme.palette.mode}
                                displayEmpty
                                fullWidth
                                onChange={handleChange}
                            >
                                <MenuItem value="light">{t("profile.preferences.lightMode")}</MenuItem>
                                <MenuItem value="dark">{t("profile.preferences.darkMode")}</MenuItem>
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