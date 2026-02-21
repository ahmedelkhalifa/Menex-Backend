import {AttachMoney, Category, Circle, Delete, DisabledByDefault, Edit, Event, Fastfood, Menu, MenuBook, Payments, Person, PersonOff, Restaurant, SentimentDissatisfied, SpaceDashboard, Subscriptions, SupervisorAccount, WorkspacePremium } from '@mui/icons-material'
import { Autocomplete, Box, Button, Card, CircularProgress, Divider, Drawer, FormControl, IconButton, InputLabel, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Modal, OutlinedInput, Paper, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../api"
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../main';

const RestaurantOwners = () => {

  const {t} = useTranslation();
  const {mode, setMode} = useThemeMode();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [role, setRole] = useState("RESTAURANT_OWNER");
  const options = ["RESTAURANT_OWNER", "SUPER_ADMIN", "UNSUBSCRIBER"];
  const [subscription, setSubscription] = useState(null);
  const [openSubscription, setOpenSubscription] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [today, setToday] = useState(0);
  const [plan, setPlan] = useState("PRO");

  const totalDuration = end - start;
  const timeRemaining = end - today;

  const elapsed = totalDuration - timeRemaining;
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  const [nextBillingDate, setNextBillingDate] = useState("");

  const getOrdinal = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };

  async function handleRenew(days) {
    try {
      setLoading(true);
      await api.put("payment/renewal", {
        userId: selectedOwner.id,
        days: days,
        plan: plan
      });
      setOpenSubscription(false);
      Swal.fire({
        title: "Done",
        text: "Subscription renewed successfully.",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error.response.data);
      const message = error.response?.data?.message || "An error occurred.";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
      setSubscription(null);
      setDaysRemaining(null);
      setExpirationDate("");
      setNextBillingDate("");
      setStart(0);
      setEnd(0);
      setToday(0);
    }
  }

  const handleGetSubscriptions = async (ownerId) => {
    try {
      setLoading(true);
      const response = await api.get(`payment/subscription/${ownerId}`);
      setSubscription(response.data);
      setPlan(response.data.plan);
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
      setStart(new Date(response.data.subscriptionStart * 1000));
      setEnd(new Date(response.data.currentPeriodEnd * 1000));
      setToday(new Date());
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  function handleCloseSubscription() {
    setOpenSubscription(false);
    setSubscription(null);
    setDaysRemaining(null);
    setExpirationDate("");
    setNextBillingDate("");
    setStart(0);
    setEnd(0);
    setToday(0);
  }

  const filteredOwners = owners.filter(o =>
  o.firstName.toLowerCase().includes(search.toLowerCase()) ||
  o.lastName.toLowerCase().includes(search.toLocaleLowerCase) ||
  o.email.toLowerCase().includes(search.toLowerCase())
  );

  const SkeletonRow = () => (
  <TableRow>
    <TableCell width={"30%"}><Skeleton width="100%" /></TableCell>
    <TableCell width={"50%"}><Skeleton width="100%" /></TableCell>
    <TableCell align='center'><Skeleton width="100%"/></TableCell>
  </TableRow>
  );

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login"
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("auth/register",
        {
          firstname,
          lastname,
          email,
          password,
          role: "UNSUBSCRIBER"
        }
      );
      setOwners(o => [...o, response.data]);
      Swal.fire({
        title: "Done!",
        text: "Restaurant owner created Successfully",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
      setOpenCreate(false);
    } catch(error) {
      console.error(error);
      Swal.fire({
        title: "Oops...",
        text: "Some error occurred",
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      console.log(lastname);
      setLoading(true)
      const response = await api.put(`/users/${selectedOwner.id}`, {
        firstname,
        lastname,
        email,
        role
      });
      setOwners(prev => prev.map(
        owner => owner.id === selectedOwner.id ? response.data : owner
      ));
      Swal.fire({
        title: "Done!",
        text: "Owner updated successfully",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Oops...",
        text: "Some error occurred",
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
      setOpenUpdate(false);
    }
  }

  async function handleDelete(ownerId) {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Deleted users can't be recovered",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: theme.palette.error.main,
        cancelButtonColor: theme.palette.text.secondary,
        confirmButtonText: "delete"
      }).then(async (res) => {
        if (res.isConfirmed) {
          await api.delete(`/users/${ownerId}`);
          Swal.fire({
            title: "Done!",
            text: "Owner deleted successfully",
            icon: "success",
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          });
        setOwners(owners.filter(o => o.id !== ownerId));
        } else {
          Swal.fire({
            title: "Cancelled!",
            text: "Operation cancelled.",
            icon: "success",
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
          });
        }
      });
    } catch(error) {
      console.error(error);
      Swal.fire({
        title: "Oops...",
        text: "Some error occurred",
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    }
  }

  async function handleDeActivate() {
    try {
      setLoading(true);
      await api.put(`payment/revoke/${selectedOwner.id}`);
      setOpenSubscription(false);
      Swal.fire({
        title: "Done",
        text: "Subscription deactivated successfully.",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error.response.data);
      const message = error.response?.data?.message || "an error occurred."
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
      setSubscription(null);
      setDaysRemaining(null);
      setExpirationDate("");
      setNextBillingDate("");
      setStart(0);
      setEnd(0);
      setToday(0);
    }
  }

  async function handleDisable(ownerId) {
    try {
      setLoading(true);
      await api.put(`/auth/disable/${ownerId}`);
      setOwners(prev => prev.map(
        owner => owner.id === ownerId ? {...owner, enabled: false} : owner
      ));
      Swal.fire({
        title: "Done!",
        text: "Owner disabled successfully",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Oops...",
        text: "Some error occurred",
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable(ownerId) {
    try {
      setLoading(true);
      await api.put(`/auth/enable/${ownerId}`);
      setOwners(prev => prev.map(
        owner => owner.id === ownerId ? {...owner, enabled: true} : owner
      ));
      Swal.fire({
        title: "Done!",
        text: "Owner enabled successfully",
        icon: "success",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Oops...",
        text: "Some error occurred",
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    async function getOwners() {
      try {
        const response = await api.get("users/owners");
        setOwners(response.data);
      } catch (error) {
        Swal.fire({
        title: "Oops...",
        text: "Some error occurred",
        icon: "error",
        showCloseButton: true,
        background: theme.palette.background.default,
        color: theme.palette.text.primary
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
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
    getOwners();
  }, []);

  return (
    <>
    <Box>
      <Box position={'absolute'} top={'5%'} left={'8%'} display={{sm: "block", md: "none"}}>
        <IconButton onClick={() => setOpen(true)}>
          <Menu color=''/>
        </IconButton>
        <Drawer
          anchor='left'
          open={open}
          onClose={() => setOpen(false)}>
            <Sidebar view={"phone"} subname={"Super Admin"}></Sidebar>
        </Drawer>
      </Box>
      <Box display={'flex'} bgcolor={"background.default"} gap={2}>
        <Sidebar subname={"Super Admin"}></Sidebar>
        <Box flex={4} p={5} mt={{xs: 8, md: 0}}>
          <Stack direction={{xs: 'column', sm: 'row'}} gap={2} alignItems={{xs: 'left', sm: 'center'}}>
            <Box flex={2}>
              <Typography variant='h4' fontWeight={700} color='text.primary'>
                Restaurant Owners
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Perform all the operations on the system users (Restaurant owners)
              </Typography>
            </Box>
            <Button variant='contained' sx={{flex: 1}} onClick={() => {
              setOpenCreate(true);
              setFirstName("");
              setLastName("");
              setEmail("");
              }}>
              Create Owner
            </Button>
          </Stack>
          <Modal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Card sx={{p: 5, width: '500px'}}>
              <Typography variant='h4' fontSize={30} fontWeight={700} color='text.primary'>
                Create new restaurant owner:
              </Typography>
              <Divider sx={{mt:3, borderBottomWidth: 3, borderColor: "text.primary"}}></Divider>
              <form action="#" onSubmit={handleCreate}>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="firstname">First name</InputLabel>
                  <OutlinedInput id='firstname'
                  label="First name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoFocus/>
                </FormControl>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="lastname">Last name</InputLabel>
                  <OutlinedInput id='lastname'
                  label="Last name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required/>
                </FormControl>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput id='email'
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  required/>
                </FormControl>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput id='password'
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  required/>
                </FormControl>
                <Button sx={{mt:3, color: "background.paper"}} type='submit' variant='contained' color='success' fullWidth disabled={loading ? true : false}
                startIcon={loading && <CircularProgress size={"small"} color='background.paper'/>}>
                  Create
                </Button>
              </form>
            </Card>
          </Modal>

          <Box mt={3}>
            <TextField
            label="Search..."
            fullWidth
            variant='outlined'
            sx={{bgcolor: "background.paper"}}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <Divider sx={{borderBottomWidth: 3, my: 3, borderColor: "primary.main"}}></Divider>

          <Box>
            {loading ? (
              <TableContainer component={Paper} sx={{p: 2, overflowX: 'auto'}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper", display: {xs: "none", md: "table-cell"}}}>name</TableCell>
                      <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}>email</TableCell>
                      <TableCell align='center' sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}>actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                     {Array.from(new Array(5)).map((_, i) => <SkeletonRow key={i} />)}
                  </TableBody>
                </Table>
            </TableContainer>
                      ) : 
                      (
                        owners.length === 0 ? (
                          <Typography variant='h4' color='text.secondary'>
                            <SentimentDissatisfied/> No users found!
                          </Typography>
                        ) : 
                        (
                        <TableContainer component={Paper} sx={{p: 2, overflowX: 'auto'}}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper", display: {xs: "none", md: "table-cell"}}}>name</TableCell>
                                  <TableCell sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}>email</TableCell>
                                  <TableCell align='center' sx={{fontWeight: 800, bgcolor: "primary.main", color: "background.paper"}}>actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredOwners.map(owner => (
                                  <TableRow key={owner.id}>
                                    <TableCell sx={{width: "30%", display: {xs: "none", md: "table-cell"}}}>{owner.firstName + " " + owner.lastName}</TableCell>
                                    <TableCell sx={{width: {xs: "70%", md: "50%"}}}>{owner.email}</TableCell>
                                    <TableCell align='center'>
                                      <IconButton 
                                      onClick={() => {
                                        setOpenUpdate(true);
                                        setSelectedOwner(owner);
                                        setFirstName(owner.firstName);
                                        setLastName(owner.lastName);
                                        setEmail(owner.email);
                                      }}>
                                        <Edit sx={{color: "primary.main"}}></Edit>
                                      </IconButton>
                                      <IconButton
                                      onClick={() => {;
                                        handleDelete(owner.id);
                                      }}>
                                        <Delete sx={{color: "error.main"}}></Delete>
                                      </IconButton>
                                      <Tooltip title={owner.enabled ? "Disable" : "Enable"}>
                                      {owner.enabled ? (
                                        <IconButton onClick={() =>handleDisable(owner.id)}>
                                          <PersonOff sx={{color: "warning.main"}}></PersonOff>
                                        </IconButton>
                                        ) : (
                                          <IconButton onClick={() => handleEnable(owner.id)}>
                                          <Person sx={{color: "success.main"}}></Person>
                                        </IconButton>
                                        )}
                                      </Tooltip>
                                      <Tooltip>
                                        <IconButton
                                        onClick={() => {;
                                          setOpenSubscription(true);
                                          setSelectedOwner(owner);
                                          handleGetSubscriptions(owner.id);
                                        }}>
                                          <Subscriptions sx={{color: "primary.main"}}></Subscriptions>
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        </TableContainer>

                        )
                      )}
            <Modal
            open={openSubscription}
            onClose={handleCloseSubscription}
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Paper elevation={3} sx={{p: loading ? 0 : 3, bgcolor: 'background.paper', width: "80%"}}>
                  {loading ? (
                      <Skeleton variant="rectangular" width="100%" height={"150px"} />
                  ) : (
                  <>
                  {subscription && (
                  <>
                  <Typography variant='h5' color='text.primary' fontWeight={600} mb={1}>
                      {t("profile.subscription.title")}
                  </Typography>
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
                                      {subscription?.plan === "PRO" ? t("profile.subscription.proPlan") : (
                                        subscription?.plan === "STARTER" ? t("profile.subscription.starterPlan") : t("profile.subscription.enterprisePlan")
                                      )}
                                  </Typography>
                                  <Typography variant='body1' color='text.secondary'>
                                      {t("profile.subscription.proPlanDesc")}
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                      <Box sx={{bgcolor: (theme) => subscription?.status === "CANCELLED" 
                              ? theme.palette.error.light
                              : theme.palette.primary.light
                          , borderRadius: 3}}
                      display={'flex'} alignItems={'center'} justifyContent={'center'} p={2}
                      gap={1}>
                          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                              <Circle sx={{color:
                              subscription?.status === "CANCELLED" ? (mode === "dark" ? "#2c0b0a" : '#EF5350') : 'primary.main', fontSize: 16}}/>
                          </Box>
                          <Typography variant='body1' fontWeight={700} color={
                              subscription?.status === "CANCELLED" ? (mode === "dark" ? "#2c0b0a" : '#EF5350') : 'primary.main'
                          }>
                              {loading || !subscription ? <Skeleton variant='text' width={"100%"}/> : 
                              (subscription?.status === "trialing" ? t("profile.subscription.trialActive") : (
                                  subscription?.status === "ACTIVE" ? t("profile.subscription.subActive") : t("profile.subscription.pastDue")
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
                          {loading || !expirationDate ? <Skeleton variant='text' width={"100%"}/> : `${subscription?.status === "trialing" ? 
                              t("profile.subscription.trialEnd") :
                              t("profile.subscription.periodEnd")
                          } ${expirationDate}`}
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
                  </>
                  )}
                  </>
                  )}
                  <Box display={'flex'} alignItems={'center'} gap={1} mt={3}>
                    <Select onChange={(e) => setPlan(e.target.value)}
                      value={plan} sx={{width: '150px'}}>
                      <MenuItem value={"PRO"} disabled={plan === "ENTERPRISE"}>Pro</MenuItem>
                      <MenuItem value={"STARTER"} disabled={plan === "ENTERPRISE" || plan === "PRO"}>Starter</MenuItem>
                      <MenuItem value={"ENTERPRISE"}>Enterprise</MenuItem>
                    </Select>
                    <Button variant='contained' sx={{height: "50px", width: "150px"}}
                    onClick={() => handleRenew(30)} disabled={loading}>
                      Renew 1 month
                    </Button>
                    <Button variant='contained' sx={{height: "50px", width: "150px"}}
                    onClick={() => handleRenew(365)} disabled={loading}>
                      Renew 1 year
                    </Button>
                    <Button variant='contained' color='error' sx={{height: "50px", width: "150px"}}
                    onClick={handleDeActivate} disabled={loading}>
                      DeActivate
                    </Button>
                  </Box>  
              </Paper>
            </Modal>         
            <Modal
            open={openUpdate}
            onClose={() => setOpenUpdate(false)}
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Card sx={{p: 5, width: '500px'}}>
                <Typography variant='h4' fontSize={30} fontWeight={700} color='text.primary'>
                  Update restaurant owner:
                </Typography>
                <Divider sx={{mt:3, borderBottomWidth: 3, borderColor: "text.primary"}}></Divider>
                <form action="#" onSubmit={handleUpdate}>
                  <FormControl sx={{mt:3}} fullWidth>
                    <InputLabel htmlFor="firstname">New Firstname</InputLabel>
                    <OutlinedInput id='firstname'
                    label="New Firstname"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoFocus/>
                  </FormControl>
                  <FormControl sx={{mt:3}} fullWidth>
                    <InputLabel htmlFor="lastname">New Lastname</InputLabel>
                    <OutlinedInput id='lastname'
                    label="New Lastname"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    required/>
                  </FormControl>
                  <FormControl sx={{mt:3}} fullWidth>
                    <InputLabel htmlFor="email">New Email</InputLabel>
                    <OutlinedInput id='email'
                    label="New Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    required/>
                  </FormControl>
                  <FormControl fullWidth sx={{mt: 3}}>
                    <Autocomplete
                    disablePortal
                    options={options}
                    renderInput={(params) => <TextField {...params} label="Roles" />}
                    id='roles'
                    value={role}
                    onChange={(e, newValue) => setRole(newValue)}/>
                  </FormControl>
                  <Button sx={{mt:3, color: "background.paper"}} type='submit' variant='contained' color='success' fullWidth disabled={loading ? true : false}
                  startIcon={loading && <CircularProgress size={"small"} color='background.paper'/>}>
                    Update
                  </Button>
                </form>
              </Card>
            </Modal>
          </Box>
        </Box>
      </Box>
    </Box>
    </>
  )
}

export default RestaurantOwners;