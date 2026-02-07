import { Badge, Box, Button, Chip, Container, Grid, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../api';
import { useParams } from 'react-router-dom';
import { ArrowForward, Numbers } from '@mui/icons-material';

const PublicMenuLayout = ({menu}) => {

    const [tabValue, setTabValue] = useState(0);

  return (
    <>
    <Box sx={{bgcolor: "background.default"}}>
    <Box width={"100%"} height={"350px"} position={'relative'}>
        <Box component={"img"} src={`http://localhost:8080/api/images/${menu?.imageUrl}`}
        width={"100%"} height={"100%"} sx={{objectFit: "cover"}}/>
        <Box position={"absolute"} top={0} left={0} width={"100%"} height={"100%"}
        sx={{bgcolor: "primary.main", opacity: "0.6"}}/>
        <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            zIndex: 1,
            textAlign: "center"
            }}>
            <Typography variant='h1' fontSize={{xs: "32px", md: "96px"}} fontWeight={600} sx={{color: "background.default"}}>
                {menu.name}
            </Typography>
            <Typography variant='body1' fontSize={{xs: 12, md: 16}} sx={{color: "background.default"}} mt={1}>
                {menu.description}
            </Typography>
        </Box>
    </Box>
    <Container maxWidth="lg">
      <Typography variant='h5' fontWeight={600} color='text.primary' mt={5} mb={1}>
        Categories
      </Typography>
      <Tabs variant='scrollable' scrollButtons="auto" value={tabValue}
      onChange={(e, v) => setTabValue(v)}>
            <Tab label="All categories"/>
            {menu.categories.map(category => (
                <Tab label={`${category.name} (${category.menuItemsCount})`} key={category.id}/>
            ))}
      </Tabs>
      <Box mt={5}>
        {tabValue === 0 ? (
            menu.categories.map(category => (
                <React.Fragment key={category.id}>
                <Box display="flex" gap={2} alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight={600}>
                    {category.name}
                    </Typography>
                    <Chip label={`${category.menuItemsCount} items`} />
                </Box>
                <Grid container spacing={2} mb={3}>
                    {menu.menuItems
                    .filter(item => item.categoryId === category.id)
                    .map(item => (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={item.id}>
                        <Paper
                            elevation={1}
                            sx={{
                                width: "100%",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-5px)" }
                        }}
                        >
                            <Chip
                            label={item.available ? "Avaliable" : "Unavailable"}
                            sx={{
                                position: "absolute",
                                top: "5%",
                                right: "5%",
                                fontWeight: 600,
                                bgcolor: "background.default",
                                color: item.available ? "primary.main" : "error.main",
                                fontSize: "16px",
                                borderRadius: 1
                            }}
                            />
                            <Box
                            component="img"
                            src={`http://localhost:8080/api/images/${item.imageUrl}`}
                            width="100%"
                            height="250px"
                            sx={{ objectFit: "contained" }}
                            />
                            <Box px={4} minHeight="160px" mt={2}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                width="100%"
                                gap={2}
                            >
                                <Typography
                                variant="h5"
                                fontWeight={600}
                                textAlign="left"
                                flex={2.5}
                                >
                                {item.name}
                                </Typography>
                                <Box flex={1} width={"100%"} textAlign={'center'}>
                                    <Typography variant='h6' fontWeight={700} display={'inline-block'} color='primary.main'>
                                        {item.price}
                                        <Typography variant='h6' fontWeight={700} display={'inline-block'}>
                                            {item.currency === "USD" && "$"}
                                            {item.currency === "TL" && "₺"}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign={{ xs: "left", md: "left" }}
                                mt={2}
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                textOverflow: "ellipsis",
                                }}
                                fontSize={14}
                            >
                                {item.description}
                            </Typography>
                            </Box>
                            <Box px={4} py={3}>
                            <Button
                                endIcon={<ArrowForward />}
                                fullWidth
                                variant="contained"
                                sx={{
                                color: "background.default",
                                height: "40px",
                                bgcolor: "primary.main",
                            }}
                            onClick={() => {
                                navigate(`/${menu.restaurant.slug}/${item.id}`);
                            }}
                            >
                                View Item
                            </Button>
                            </Box>
                        </Paper>
                        </Grid>
                    ))}
                </Grid>
                </React.Fragment>
            ))
        ) : (
            <>
            <Box display={'flex'} gap={2} alignItems={'center'}>
                <Typography variant='h5' fontWeight={600} color='text.primary'>
                    {menu.categories[tabValue - 1].name}
                </Typography>
                <Chip label={`${menu.categories[tabValue - 1].menuItemsCount} items`}/>
            </Box>
            <Grid container spacing={2} my={3}>
                {menu.menuItems
                    .filter(item => item.categoryId === menu.categories[tabValue - 1].id)
                    .map(item => (
                        <Grid size={{xs: 12, md: 4}} key={item.id} mb={3}>
                        <Paper
                            elevation={1}
                            sx={{
                                width: "100%",
                                position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-5px)" }
                            }}
                        >
                            <Chip
                            label={item.available ? "Avaliable" : "Unavailable"}
                            sx={{
                                position: "absolute",
                                top: "5%",
                                right: "5%",
                                fontWeight: 600,
                                bgcolor: "background.default",
                                color: item.active ? "primary.main" : "error.main",
                                fontSize: "16px",
                                borderRadius: 1
                            }}
                            />
                            <Box
                            component="img"
                            src={`http://localhost:8080/api/images/${item.imageUrl}`}
                            width="100%"
                            height="250px"
                            sx={{ objectFit: "contained" }}
                            />
                            <Box px={4} minHeight="150px" mt={2}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                                >
                                <Typography
                                variant="h5"
                                fontWeight={600}
                                textAlign="center"
                                >
                                {item.name}
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign={{ xs: "center", md: "left" }}
                                mt={2}
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 4,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                fontSize={14}
                            >
                                {item.description}
                            </Typography>
                            </Box>
                            <Box px={4} py={3}>
                            <Button
                                endIcon={<ArrowForward />}
                                fullWidth
                                variant="contained"
                                sx={{
                                    color: "background.default",
                                    height: "40px",
                                    bgcolor: "primary.main",
                                }}
                                onClick={() => {
                                    navigate(`/${menu.restaurant.slug}/${item.id}`);
                                }}
                                >
                                View Item
                            </Button>
                            </Box>
                        </Paper>
                        </Grid>
                    ))}
            </Grid>
            </>
            )}

      </Box>
    </Container>
    </Box>
    </>
  )
}

export default PublicMenuLayout