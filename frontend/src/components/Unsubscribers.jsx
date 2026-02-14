import {Category, Delete, DisabledByDefault, Edit, Fastfood, Menu, MenuBook, Person, PersonOff, Restaurant, SentimentDissatisfied, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Autocomplete, Box, Button, Card, CircularProgress, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, OutlinedInput, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../api"
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';

const Unsubscribers = () => {

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
  const [role, setRole] = useState("UNSUBSCRIBER");
  const options = ["RESTAURANT_OWNER", "SUPER_ADMIN", "UNSUBSCRIBER"];

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
        const response = await api.get("users/unsubscribers");
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
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        </TableContainer>

                        )
                      )}
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

export default Unsubscribers;