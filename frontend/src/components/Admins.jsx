import {Category, Delete, Edit, Fastfood, Menu, MenuBook, Person, Restaurant, SentimentDissatisfied, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Autocomplete, Box, Button, Card, CircularProgress, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, OutlinedInput, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../api"
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';

const Admins = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openUpdate, setOpenUpdate] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [search, setSearch] = useState("");
    const theme = useTheme();
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [role, setRole] = useState("SUPER_ADMIN");
    const options = ["RESTAURANT_OWNER", "SUPER_ADMIN"];
    
      const filteredAdmins = admins.filter(o =>
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
            role: "SUPER_ADMIN"
            }
        );
        setAdmins(a => [...a, response.data]);
        Swal.fire({
            title: "Done!",
            text: "System admin created Successfully",
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
        setLoading(true)
        const response = await api.put(`/users/${selectedAdmin.id}`, {
            firstname,
            lastname,
            email,
            role
        });
        setAdmins(prev => prev.map(
            admin => admin.id === selectedAdmin.id ? response.data : admin
        ));
        Swal.fire({
            title: "Done!",
            text: "Admin updated successfully",
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

    async function handleDelete(adminId) {
        try {
        const res = await Swal.fire({
            title: "Are you sure?",
            text: "Deleted admins can't be recovered",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.text.secondary,
            confirmButtonText: "delete",
            background: theme.palette.background.default,
            color: theme.palette.text.primary
        });

        if (res.isConfirmed) {
            await api.delete(`/users/${adminId}`);
            Swal.fire({
                title: "Done!",
                text: "Owner deleted successfully",
                icon: "success",
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
            setAdmins(admins.filter(a => a.id !== adminId));
            } else {
            Swal.fire({
                title: "Cancelled!",
                text: "Operation cancelled.",
                icon: "success",
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        };
        } catch(error) {
        console.error(error);
        console.log("yesss");
        const message = error.response?.data?.message || "Some error occurred";
        Swal.fire({
            title: "Oops...",
            text: message,
            icon: "error",
            showCloseButton: true,
            background: theme.palette.background.default,
            color: theme.palette.text.primary
        });
        }
    }

    useEffect(() => {
        async function getAdmins() {
        try {
            const response = await api.get("users/admins");
            setAdmins(response.data);
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
        } catch (error) {
            localStorage.clear();
            window.location.href = "/login";
        }
        }
        validateToken();
        getAdmins();
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
                System Admins.
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Perform all the operations on the admins. (Super Admins)
              </Typography>
            </Box>
            <Button variant='contained' sx={{flex: 1}} onClick={() => {
              setOpenCreate(true);
              setFirstName("");
              setLastName("");
              setEmail("");
              }}>
              Create Admin
            </Button>
          </Stack>
          <Modal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Card sx={{p: 5, width: '500px'}}>
              <Typography variant='h4' fontSize={30} fontWeight={700} color='text.primary'>
                Create new restaurant admin:
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
                  autoFocus
                  autoComplete='off'/>
                </FormControl>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="lastname">Last name</InputLabel>
                  <OutlinedInput id='lastname'
                  label="Last name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete='off'/>
                </FormControl>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput id='email'
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  required
                  autoComplete='off'/>
                </FormControl>
                <FormControl sx={{mt:3}} fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput id='password'
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  required
                  autoComplete='off'/>
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
                        admins.length === 0 ? (
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
                                {filteredAdmins.map(admin => (
                                  <TableRow key={admin.id}>
                                    <TableCell sx={{width: "30%", display: {xs: "none", md: "table-cell"}}}>{admin.firstName + " " + admin.lastName}</TableCell>
                                    <TableCell sx={{width: {xs: "70%", md: "50%"}}}>{admin.email}</TableCell>
                                    <TableCell align='center'>
                                      <IconButton 
                                      onClick={() => {
                                        setOpenUpdate(true);
                                        setSelectedAdmin(admin);
                                        setFirstName(admin.firstName);
                                        setLastName(admin.lastName);
                                        setEmail(admin.email);
                                      }}>
                                        <Edit sx={{color: "primary.main"}}></Edit>
                                      </IconButton>
                                      <IconButton
                                      onClick={() => {;
                                        handleDelete(admin.id);
                                      }}>
                                        <Delete sx={{color: "error.main"}}></Delete>
                                      </IconButton>
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
                  Update restaurant admin:
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
                    autoFocus
                    autoComplete='off'/>
                  </FormControl>
                  <FormControl sx={{mt:3}} fullWidth>
                    <InputLabel htmlFor="lastname">New Lastname</InputLabel>
                    <OutlinedInput id='lastname'
                    label="New Lastname"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete='off'/>
                  </FormControl>
                  <FormControl sx={{mt:3}} fullWidth>
                    <InputLabel htmlFor="email">New Email</InputLabel>
                    <OutlinedInput id='email'
                    label="New Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    required
                    autoComplete='off'/>
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

export default Admins