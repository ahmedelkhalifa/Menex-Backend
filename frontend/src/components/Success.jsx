import { CheckCircleOutline, Login } from '@mui/icons-material'
import { Box, Button, Card, Divider, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
  return (
    <>
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
        <Card sx={{padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: {xs: '90%', sm: '600px'},
            boxShadow: (theme) =>
            `0px 6px 20px ${theme.palette.primary.main}80`}}>
                <Box width={"100px"} height={"100px"} borderRadius={"50%"} sx={{
                    bgcolor: "background.paper", boxShadow: (theme) =>
                        `0px 6px 20px ${theme.palette.primary.main}80`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <CheckCircleOutline color='primary' sx={{ fontSize: 50 }} />
                </Box>
                <Box>
                    <Typography variant='h4' fontWeight={900} textAlign={'center'} fontSize={40}
                    color='text.primary'>
                        {t("subscription.success")}
                    </Typography>
                    <Typography variant='body1' textAlign={'center'} color='text.secondary' mt={1}>
                        {t("subscription.successDesc")}
                        <Typography variant='body1' fontWeight={900} color='primary.main'
                        display={'inline-block'} fontSize={20}>
                            {t("subscription.menexPro")}
                        </Typography> {t("subscription.lastWord")}
                    </Typography>
                    <Divider sx={{borderColor: "divider", my: 3}}/>
                    <Typography variant='body1' textAlign={'center'} color='text.secondary'>
                        {t("subscription.successDesc2")}
                    </Typography>
                    <Divider sx={{borderColor: "divider", mt: 3}}/>
                </Box>
                <Button variant='contained' sx={{
                    width: "100%", height: "50px", fontSize: 18, fontWeight: 600, mt: 1
                }} startIcon={<Login/>} onClick={() => navigate('/login')}>
                    {t("landing.login")}
                </Button>
        </Card>
    </Box>
    </>
  )
}

export default Success