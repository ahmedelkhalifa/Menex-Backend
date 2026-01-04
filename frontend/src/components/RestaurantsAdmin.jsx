import {Category, Delete, Edit, Fastfood, Menu, MenuBook, Person, Restaurant, SentimentDissatisfied, SpaceDashboard, SupervisorAccount } from '@mui/icons-material'
import { Autocomplete, Box, Button, Card, CircularProgress, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, OutlinedInput, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../api"
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';

const RestaurantsAdmin = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
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
                Restaurants.
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Perform all the operations on the restaurants. (As a Super Admin)
              </Typography>
            </Box>
            <Button variant='contained' sx={{flex: 1}} onClick={() => {
              }}>
              Create Restaurant
            </Button>
          </Stack>

          <Box mt={3}>
            <TextField
            label="Search..."
            fullWidth
            variant='outlined'
            sx={{bgcolor: "background.paper"}}
            />
          </Box>

          <Divider sx={{borderBottomWidth: 3, my: 3, borderColor: "primary.main"}}></Divider>

        </Box>
      </Box>
    </Box>
    </>
  )
}

export default RestaurantsAdmin