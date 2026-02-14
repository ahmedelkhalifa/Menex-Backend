import { Alert, Avatar, Box, Button, Card, CircularProgress, Divider, Drawer, FormControl, Grid, IconButton, LinearProgress, MenuItem, Modal, Paper, Select, Skeleton, Stack, TextField, Tooltip, Typography, useTheme} from '@mui/material'
import React, { useState, useEffect } from 'react'
import OwnerSidebar from './OwnerSidebar'
import { AttachMoney, Cancel, Circle, CreditCard, Edit, Event, LockReset, Menu, Payment, Payments, Restore, Save, SupportAgent, VerifiedUser, WorkspacePremium } from '@mui/icons-material';
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
    const [subscription, setSubscription] = useState(null);
    const [expirationDate, setExpirationDate] = useState("");
    const [daysRemaining, setDaysRemaining] = useState(null);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [today, setToday] = useState(0);

    const totalDuration = end - start;
    const timeRemaining = end - today;

    const elapsed = totalDuration - timeRemaining;
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    const [nextBillingDate, setNextBillingDate] = useState("");
    

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
        const isRTL = language === "ar";
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
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

    const handleUpdateCard = async () => {
        try {
            setLoading(true);
            const response = await api.post("subscription/create-portal-session/card");    
            window.open(response.data.url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error("Could not open portal", error);
        } finally {
            setLoading(false);
        }
    };
    const handleManagePayment = async () => {
        try {
            setLoading(true);
            const response = await api.post("subscription/create-portal-session");    
            window.open(response.data.url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error("Could not open portal", error);
        } finally {
            setLoading(false);
        }
    };

    async function handleSubscriptionCancel() {
        try {
            setLoading(true);
            await api.post("subscription/cancel");
            Swal.fire({
                icon: 'success',
                title: t("profile.subscription.successAlert.title"),
                text: t("profile.subscription.successAlert.message"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
                });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: t("profile.subscription.errorAlert.title"),
                text: t("profile.subscription.errorAlert.message"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
                });
        } finally {
            setLoading(false);
        }
    }

    const getOrdinal = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
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
        async function getSubscription() {
            try {
                setLoading(true);
                const response = await api.get("subscription/status");
                setSubscription(response.data);
                    const endDate = new Date(response.data.currentPeriodEnd * 1000);
                    const today = new Date();
                    const diffInMs = endDate - today;
                    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                    setDaysRemaining(diffInDays);
                    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(endDate);
                    const day = endDate.getDate();
                    const year = endDate.getFullYear();
                    const fullDateString = `${month} ${day - 1}${getOrdinal(day)}, ${year}`;
                    const fullBillingDateString = `${month} ${day}${getOrdinal(day)}, ${year}`;

                    setExpirationDate(fullDateString);
                    setNextBillingDate(fullBillingDateString)
                    setStart(new Date(response.data.currentPeriodStart * 1000));
                    setEnd(new Date(response.data.currentPeriodEnd * 1000));
                    setToday(new Date());       
                console.log(response.data);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: t("profile.errorAlert.title"),
                    text: t("profile.errorAlert.subscriptionMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                });
            } finally {
                setLoading(false);
            }
        }
        const updateDirection = (lng) => {
        const isRTL = lng === "ar";
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        document.documentElement.lang = lng;
        };
        validateToken();
        updateDirection(i18n.resolvedLanguage);
        getProfile();
        if (localStorage.getItem("role") === "RESTAURANT_OWNER") {
            getSubscription();
        }
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
        onClose={() => setOpen(false)}
        PaperProps={{
            sx: {
                borderRadius: 0
            }
        }}>
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
                        <Button variant='contained' sx={{bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'}, height: "40px", p: 3}} fullWidth onClick={() => setOpenModal(true)}>
                            {t("profile.security.changePasswordTitle")}
                        </Button>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <Button variant='contained' sx={{bgcolor: 'error.main', '&:hover': {bgcolor: 'error.dark'}, color: '#FFF', height: "40px", p: 3}} fullWidth>
                            {t("profile.security.logout")}
                        </Button>
                    </Grid>
                </Grid>
                </>
                )}  
            </Paper>
            {localStorage.getItem("role") === "RESTAURANT_OWNER" && (
                <Paper elevation={3} sx={{p: loading ? 0 : 3, bgcolor: 'background.paper', mt: 3}}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={"150px"} />
                ) : (
                <>
                <Typography variant='h5' color='text.primary' fontWeight={600} mb={1}>
                    {t("profile.subscription.title")}
                </Typography>
                {/* <Typography variant='body1' color='text.secondary' mb={2}>
                    {t("profile.subscription.description")}
                </Typography> */}
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Box display={'flex'} alignItems={{xs: "flex-start", md: 'center'}} justifyContent={'space-between'} gap={{xs: 2, md: 0}}
                py={3} flexDirection={{xs: "column", md: "row"}}>
                    <Box>
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                            <Box width={'50px'} height={"50px"} sx={{bgcolor: "primary.light"}}
                            display={'flex'} justifyContent={'center'} alignItems={'center'}
                            borderRadius={1}>
                                <WorkspacePremium sx={{color: mode === "light" ? "primary.main" : "background.default", fontSize: 30}}/>
                            </Box>
                            <Box>
                                <Typography variant='h5' fontWeight={600} color='text.primary'>
                                    {t("profile.subscription.proPlan")}
                                </Typography>
                                <Typography variant='body1' color='text.secondary'>
                                    {t("profile.subscription.proPlanDesc")}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{bgcolor: (theme) => subscription?.status === "past_due" 
                            ? theme.palette.error.light
                            : theme.palette.primary.light
                        , borderRadius: 3}}
                    display={'flex'} alignItems={'center'} justifyContent={'center'} p={2}
                    gap={1}>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Circle sx={{color:
                            subscription?.status === "past_due" ? (mode === "dark" ? "#2c0b0a" : '#EF5350') : 'primary.main', fontSize: 16}}/>
                        </Box>
                        <Typography variant='body1' fontWeight={700} color={
                            subscription?.status === "past_due" ? (mode === "dark" ? "#2c0b0a" : '#EF5350') : 'primary.main'
                        }>
                            {loading || !subscription ? <Skeleton variant='text' width={"100%"}/> : 
                            (subscription?.status === "trialing" ? t("profile.subscription.trialActive") : (
                                subscription?.status === "active" ? t("profile.subscription.subActive") : t("profile.subscription.pastDue")
                            ))}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{borderWidth: 1, borderColor: 'divider', mb: 2}}></Divider>
                <Box>
                    <Typography variant='h6' fontWeight={600} color='text.primary'>
                        {subscription?.status === "trialing" ? t("profile.subscription.freeTrial") :
                        (subscription?.interval === "month" ? 
                            t("profile.subscription.monthly") :
                            t("profile.subscription.yearly")
                        )}
                    </Typography>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={{xs: "flex-start", md: 'center'}} flexDirection={{xs: "column", md: "row"}}
                    gap={{xs: 2, md: 0}}>
                        <Typography variant='body1' color='text.secondary' sx={{fontStyle: 'italic'}}>
                            {t("profile.subscription.subscriptionDesc")}
                        </Typography>
                        <Box display={'flex'} alignItems={'center'} gap={1}>
                            <Typography variant='h5' fontWeight={700} color='primary.main'>
                                {loading || !daysRemaining ? <Skeleton variant='text' width={"100%"}/> : `${daysRemaining}`}
                            </Typography>
                            <Typography>
                                {t("profile.subscription.daysRemaining")}
                            </Typography>
                        </Box>
                    </Box>
                    <LinearProgress
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'background.default',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: progress > 80 ? '#f44336' : 'primary.main', // Turns red if close to end
                        },
                        mt: 2
                    }} 
                    />
                    <Typography variant='body1' color='text.secondary' mt={1}>
                        {loading || !expirationDate ? <Skeleton variant='text' width={"100%"}/> : `${t("profile.subscription.trialEnd")} ${expirationDate}`}
                    </Typography>
                    {!subscription?.isScheduledForCancel && (
                        <Box width={"100%"} sx={{bgcolor: mode === "dark" ? "#1B3F2A" : "primary.light", border:
                        "1px solid", borderColor: "primary.main", borderRadius: 1
                    }} display={'flex'} alignItems={{xs: "flex-start", md: "center"}} p={4} mt={2}
                    flexDirection={{xs: "column", md: "row"}} gap={{xs: 2, md: 0}}>
                        <Box display={'flex'} gap={2} alignItems={'flex-start'} flex={1}>
                            <Event sx={{color: mode === "dark" ? "#8FD19E" : "primary.main"}}/>
                            <Box>
                                <Typography variant='body2' fontWeight={600} color={
                                    mode === "dark" ? "#8FD19E" : "text.secondary"
                                }>
                                    {t("profile.subscription.nextBillingDate")}
                                </Typography>
                                <Typography variant='h6' fontWeight={800} color='text.primary'>
                                    {loading || !nextBillingDate ? <Skeleton variant='text' width={"100%"}/> : nextBillingDate}
                                </Typography>
                            </Box>
                        </Box>
                        <Box display={'flex'} gap={2} alignItems={'flex-start'} flex={1}>
                            <Payments sx={{color: mode === "dark" ? "#8FD19E" : "primary.main"}}/>
                            <Box>
                                <Typography variant='body2' fontWeight={600} color={
                                    mode === "dark" ? "#8FD19E" : "text.secondary"
                                }>
                                    {t("profile.subscription.renewalAmount")}
                                </Typography>
                                <Typography variant='h6' fontWeight={800} color='text.primary'
                                display={'inline-block'}>
                                    {loading || !subscription ? <Skeleton variant='text' width={"100%"} sx={{display: 'inline-block'}}/> : (subscription.amount).toFixed(2) + "$"}
                                    <Typography variant='body1' color={
                                    mode === "dark" ? "#8FD19E" : "text.secondary"
                                } display={'inline-block'}>
                                        {loading || !subscription ? "" : 
                                        (subscription?.interval === "month" ? t("profile.subscription.perMonth") : t("profile.subscription.perYear"))}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>  
                    )}
                    {subscription?.isScheduledForCancel && (
                        <Typography variant='body1' color='warning' mt={1} fontWeight={800}>
                            {t("profile.subscription.scheduledForCancel")} <br/>
                            {t("profile.subscription.scheduledForCancel2")}
                        </Typography>
                    )}
                    {subscription?.status === "past_due" && (
                        <Alert severity="error" sx={{ my: 2,
                            bgcolor: "error.light",
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350',
                            '& .MuiAlert-icon': {
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350', // Keeps the icon the bright red you like
                            }
                         }}>
                            {t("profile.subscription.past_due")}
                        </Alert>
                    )}
                </Box>
                <Box mt={3} display={'flex'} alignItems={'center'} justifyContent={'space-between'}
                flexDirection={{xs: "column", md: "row"}} gap={{xs: 2, md: 0}}>
                    <Box display={'flex'} alignItems={'center'} gap={2}
                    flexDirection={{xs: "column", md: "row"}} width={{xs: "100%", md: "fit-content"}}>
                        <Button variant='contained' startIcon={<AttachMoney/>}
                        sx={{height: "40px", p: 3, color: "#fff", bgcolor: "primary.main",
                            boxShadow: mode === "light" && ((theme) =>
                            `0px 6px 20px ${theme.palette.primary.main}80`),
                            width: {
                            xs: '100%',
                            md: 'auto'
                            }}} onClick={handleManagePayment}>
                            {t("profile.subscription.manageBilling")}
                        </Button>
                        <Button variant='contained' startIcon={<CreditCard/>}
                        sx={{height: "40px", p: 3, color: "text.primary", bgcolor: "background.paper",
                            
                            border: "1px solid", borderColor: "text.primary",
                            width: {
                            xs: '100%',
                            md: 'auto'
                            }}} onClick={handleUpdateCard}>
                            {t("profile.subscription.updateCard")}
                        </Button>
                    </Box>
                    <Button variant={mode === "dark" ? "contained" : "outlined"} startIcon={<Cancel/>}
                    sx={{height: "40px", p: 3, bgcolor: mode === "dark" && "error.main", '&:hover': {color: "error.dark"}, color: mode === "light" ? "error.main" : "#fff", borderColor: "error.main", width: {xs: "100%", md: "fit-content"}}} onClick={handleSubscriptionCancel}>
                        {t("profile.subscription.cancelSubscription")}
                    </Button>
                </Box>
                </>
                )}  
            </Paper>
            )}
            {localStorage.getItem("role") === "RESTAURANT_OWNER" && (
                <Grid container spacing={2} mt={3}>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }}>
                    <Card sx={{width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, py: 2, px: 4, flexGrow: 1}}>
                        <VerifiedUser sx={{color: "primary.main"}}/>
                        <Box>
                            <Typography variant='body1' color='text.primary' fontWeight={700}>
                                {t("profile.subscription.securePayment")}
                            </Typography>
                            <Typography variant='body1' color='text.secondary' fontSize={12}>
                                {t("profile.subscription.encrypted")}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }}>
                    <Card sx={{width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, py: 2, px: 4, flexGrow: 1}}>
                        <SupportAgent sx={{color: "primary.main"}}/>
                        <Box>
                            <Typography variant='body1' color='text.primary' fontWeight={700}>
                                {t("profile.subscription.support")}
                            </Typography>
                            <Typography variant='body1' color='text.secondary' fontSize={12}>
                                {t("profile.subscription.help")}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, md: 4}} sx={{ display: "flex" }}>
                    <Card sx={{width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, py: 2, px: 4, flexGrow: 1}}>
                        <Restore sx={{color: "primary.main"}}/>
                        <Box>
                            <Typography variant='body1' color='text.primary' fontWeight={700}>
                                {t("profile.subscription.commitment")}
                            </Typography>
                            <Typography variant='body1' color='text.secondary' fontSize={12}>
                                {t("profile.subscription.cancelAnytime")}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            )}
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
                            <Alert severity="error" sx={{ my: 2,
                            bgcolor: "error.light",
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350',
                            '& .MuiAlert-icon': {
                            color: mode === "dark" ? "#2c0b0a" : '#EF5350', // Keeps the icon the bright red you like
                            }
                         }}>{t("profile.security.passwordMismatchMessage")}</Alert>
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