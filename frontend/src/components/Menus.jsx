import { Add, Delete, DeleteOutlined, Edit, ErrorOutline, EventAvailable, EventBusy, ExpandMore, MoreHoriz, QrCode, Restaurant, SentimentDissatisfiedOutlined, Update, WebAsset, WebAssetOffOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, Box, Button, Card, CircularProgress, Divider, Drawer, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Modal, Paper, Select, Skeleton, Stack, Switch, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import OwnerSidebar from './OwnerSidebar';
import Sidebar from './Sidebar';
import api from '../api';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import logo from '../assets/burger.webp';

const Menus = () => {
    const [open, setOpen] = useState(false);
    const [openAddMenu, setOpenAddMenu] = useState(false);
    const [openAddCategory, setOpenAddCategory] = useState(false);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [openUpdateItem, setOpenUpdateItem] = useState(false);
    const [openQr, setOpenQr] = useState(false);
    const [openOperationsCategory, setOpenOperationsCategory] = useState(false);
    const [menuName, setMenuName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();
    const [openOperations, setOpenOperations] = useState(false);
    const [qrUrl, setQrUrl] = useState(null);
    const [items, setItems] = useState([
        {
            "id": 1,
            "name": "Premium Steak",
            "description": "Succulent 12oz ribeye steak grilled to perfection, served with garlic mashed potatoes and seasonal.",
            "price": 15.99,
            "available": true,
            "image": logo
        },
        {
            "id": 2,
            "name": "Hamburger",
            "description": "Succulent 12oz ribeye steak grilled to perfection, served with garlic mashed potatoes and seasonal.",
            "price": 21.99,
            "available": true,
            "image": logo
        }
    ]);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [exceededSize, setExceededSize] = useState(false)
    const [currency, setCurrency] = useState("USD");
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [search, setSearch] = useState("");
    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase())
    );
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [available, setAvailable] = useState(true)


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        if (file.size > 2 * 1024 * 1024) {
            setExceededSize(true);
            setPreviewUrl(null);
            setImage(null);
            return;
        } // 2MB

        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setExceededSize(false);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    }

    async function handleAddMenu() {
        try {
            setLoading(true);
            const response = await api.post(`menus`, {
                menuName: menuName,
                restaurantId: selectedRestaurant?.id
            });
            setMenus([...menus, response.data]);
            setSelectedMenu(response.data);
            setMenuName("");
            setOpenAddMenu(false);
            Swal.fire({
                icon: 'success',
                title: t("menus.createMenu.successAlert.title"),
                text: t("menus.createMenu.successAlert.message"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error adding menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.createMenu.errorAlert.title"),
                text: t("menus.createMenu.errorAlert.message"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
            setMenuName("");
            setOpenAddMenu(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteMenu() {
        try {
            setLoading(true);
            setOpenOperations(false);
            Swal.fire({
                title: t("menus.editMenu.deleteTitle"),
                text: t("menus.editMenu.deleteMessage"),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: theme.palette.error.main,
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
                confirmButtonText: t("menus.editMenu.confirmDelete"),
                cancelButtonText: t("menus.editMenu.cancelDelete")
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await api.delete(`menus/${selectedMenu?.id}`);
                    setMenus(menus.filter((menu) => menu.id !== selectedMenu?.id));
                    setSelectedMenu(selectedMenu === menus[0] ? null : menus[0]);
                    Swal.fire({
                        icon: 'success',
                        title: t("menus.successAlert.title"),
                        text: t("menus.successAlert.deleteSuccessMessage"),
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary
                    })
                }
            })
        } catch (error) {
            console.error('Error deleting menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.deleteErrorMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
            setOpenOperations(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateMenu() {
        try {
            setLoading(true);
            const response = await api.put(`restaurants/${selectedRestaurant?.id}/menus/${selectedMenu?.id}`, {
                menuName: menuName
            });
            setMenus(menus.map((menu) => {
                if (menu.id === selectedMenu?.id) {
                    return {...menu, name: response.data.name};
                }
                return menu;
            }));
            setSelectedMenu(response.data);
            setMenuName("");
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.updateSuccessMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error updating menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.updateErrorMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } finally {
            setOpenOperations(false);
            setLoading(false);
        }
    }


    async function handleDisableMenu() {
        try {
            setLoading(true);
            setOpenOperations(false);
            await api.put(`menus/${selectedMenu?.id}/disable`);
            setMenus(menus.map((menu) => {
                if (menu.id === selectedMenu?.id) {
                    return {...menu, active: false};
                }
                return menu;
            }));
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.disableSuccessMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error disabling menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.disableErrorMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } finally {
            setLoading(false);
            }
    }

    async function handleEnableMenu() {
        try {
            setLoading(true);
            setOpenOperations(false);
            await api.put(`menus/${selectedMenu?.id}/enable`);
            setMenus(menus.map((menu) => {
                if (menu.id === selectedMenu?.id) {
                    return {...menu, active: true};
                }
                return menu;
            }));
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.enableSuccessMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error disabling menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.enableErrorMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } finally {
            setLoading(false);
        }
    }

    async function handleAddCategory() {
        try {
            setLoading(true);
            console.log(selectedMenu);
            const response = await api.post(`menus/${selectedMenu?.id}/categories`, {
                categoryName: categoryName
            });
            setCategories([...categories, response.data]);
            setSelectedCategory(response.data);
            setCategoryName("");
            setOpenAddCategory(false);
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.addCategorySuccessMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error adding menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.addCategoryErrorMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
            setCategoryName("");
            setOpenAddCategory(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateCategory() {
        try {
            setLoading(true);
            const response = await api.put(`menus/${selectedMenu?.id}/categories/${selectedCategory?.id}`, {
                categoryName: categoryName
            });
            setCategories(categories.map((category) => {
                if (category.id === selectedCategory?.id) {
                    return {...category, categoryName: response.data.categoryName};
                }
                return category;
            }));
            setSelectedCategory(response.data);
            setCategoryName("");
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.updateCategorySuccessMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error updating menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.updateCategoryErrorMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } finally {
            setOpenOperationsCategory(false);
            setLoading(false);
        }
    }

    async function handleDeleteCategory() {
        try {
            setLoading(true);
            Swal.fire({
                title: t("menus.editCategory.deleteTitle"),
                text: t("menus.editCategory.deleteMessage"),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: theme.palette.error.main,
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
                confirmButtonText: t("menus.editCategory.confirmDelete"),
                cancelButtonText: t("menus.editCategory.cancelDelete")
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await api.delete(`menus/categories/${selectedCategory?.id}`);
                    setCategories(categories.filter((c) => c.id !== selectedCategory?.id));
                    setSelectedCategory(selectedCategory === categories[0] ? null : categories[0]);
                    Swal.fire({
                        icon: 'success',
                        title: t("menus.successAlert.title"),
                        text: t("menus.successAlert.deleteCategorySuccessMessage"),
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary
                    })
                }
            })
        } catch (error) {
            console.error('Error deleting menu:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.deleteCategoryErrorMessage"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
            setOpenOperations(false);
        } finally {
            setLoading(false);
            setOpenOperationsCategory(false);
        }
    }

    const downloadQr = async (menuId) => {
        const response = await api.get(`${selectedMenu.restaurant.slug}/menus/${selectedMenu.id}/download-QR-code`, {
            responseType: "blob"
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${selectedMenu.name}-qr.png`);
        document.body.appendChild(link);
        link.click();
    };

    async function loadQr() {
        setOpenQr(true);
        try {
            if (!selectedMenu) throw new Error(t("menus.errorAlert.noMenuSelected"));
            const res = await api.get(`${selectedMenu.restaurant.slug}/menus/${selectedMenu.id}/get-QR-code`, {
            responseType: "blob"
            });
            setQrUrl(URL.createObjectURL(res.data));
        } catch (error) {
            console.error('Error loading QR code:', error);
            setOpenQr(false);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: error?.response?.data?.message || error.message || t("menus.errorAlert.QRErrorMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        }
    }

    async function handleCreateItem(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", itemName);
            formData.append("description", itemDescription);
            formData.append("price", itemPrice);
            formData.append("image", image);
            formData.append("currency", currency);
            const response = await api.post(`categories/${selectedCategory?.id}/menu-items`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setItems([...items, response.data]);
            setItemName("");
            setItemDescription("");
            setItemPrice("");
            setImage(null);
            setPreviewUrl(null);
            setOpenAddItem(false);
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.addItemSuccessMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error creating item:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.addItemErrorMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
            setOpenAddItem(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateItem(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", itemName);
            formData.append("description", itemDescription);
            formData.append("price", itemPrice);
            formData.append("image", image);
            formData.append("currency", currency);
            const response = await api.put(`categories/${selectedCategory?.id}/menu-items/${selectedItemId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setItems(items.map(item => {
            if (item.id === response.data.id) {
                return {
                ...response.data,
                imageUrl: `${response.data.imageUrl}?v=${Date.now()}`
                };
            }
                return item;
            }));
            setItemName("");
            setItemDescription("");
            setItemPrice("");
            setImage(null);
            setPreviewUrl(null);
            setOpenUpdateItem(false);
            Swal.fire({
                icon: 'success',
                title: t("menus.successAlert.title"),
                text: t("menus.successAlert.updateItemSuccessMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
        } catch (error) {
            console.error('Error creating item:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.updateItemErrorMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })
            setOpenUpdateItem(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteItem(itemId) {
        try {
            setLoading(true);
            Swal.fire({
                icon: "warning",
                title: t("menus.editItem.deleteTitle"),
                text: t("menus.editItem.deleteMessage"),
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: t("menus.editItem.confirmDelete"),
                confirmButtonColor: theme.palette.error.main,
                cancelButtonText: t("menus.editItem.cancelDelete"),
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await api.delete(`menu-items/${itemId}`);
                    setItems(items.filter((item) => item.id !== itemId));
                    Swal.fire({
                        icon: "success",
                        title: t("menus.successAlert.title"),
                        text: t("menus.successAlert.deleteItemMessage"),
                        showCloseButton: true,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary
                    })
                }
            })
        } catch (error) {
            console.error('Error deleting item:', error);
            Swal.fire({
                icon: 'error',
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.deleteItemErrorMessage"),
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } finally {
            setLoading(false);
        }
    }

    async function unavailableItem() {
        setLoading(true);
        try {
            await api.put(`menu-items/${selectedItemId}/unavailable`);
            setItems(items.map(i => {
                if (i.id === selectedItemId) {
                    return {...i, available: false};
                }
                return i;
            }
            ));
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.message"),
                icon: 'error',
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } finally {
            setOpenUpdateItem(false);
            setLoading(false);
        }
    }

    async function availableItem() {
        setLoading(true);
        try {
            await api.put(`menu-items/${selectedItemId}/available`);
            setItems(items.map(i => {
                if (i.id === selectedItemId) {
                    return {...i, available: true};
                }
                return i;
            }
            ));
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: t("menus.errorAlert.title"),
                text: t("menus.errorAlert.message"),
                icon: 'error',
                showCloseButton: true,
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            });
        } finally {
            setOpenUpdateItem(false);
            setLoading(false);
        }
    }

    function handleCloseAddItem() {
        setOpenAddItem(false);
        setItemName("");
        setItemDescription("");
        setItemPrice("");
        setCurrency("USD");
        setImage(null);
        setPreviewUrl(null);
        setExceededSize(false)
    }

    async function handleOpenUpdateItem(selectedItem) {
        setOpenUpdateItem(true);
        setSelectedItemId(selectedItem?.id);
        setItemName(selectedItem?.name);
        setItemDescription(selectedItem?.description);
        setItemPrice(selectedItem?.price);
        setCurrency(selectedItem?.currency);
        setAvailable(selectedItem.available)
        try {
            const response = await api.get(`images/${selectedItem?.imageUrl}`,
                {
                    responseType: 'blob'
                }
            );
            setPreviewUrl(URL.createObjectURL(response?.data))
        } catch (error) {
            console.error(error);
        }
        setImage(null);
        setExceededSize(false)
    }

    function handleCloseUpdateItem() {
        setOpenUpdateItem(false);
        setItemName("");
        setItemDescription("");
        setItemPrice("");
        setCurrency("USD");
        setImage(null);
        setPreviewUrl(null);
        setExceededSize(false)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/restaurants');
                setRestaurants(response.data);
                setSelectedRestaurant(response.data[0]);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                Swal.fire({
                    icon: 'error',
                    title: t("menus.errorAlert.title"),
                    text: t("menus.errorAlert.fetchRestaurantsMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                })
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
        fetchData();
    }, []);

    useEffect(() => {
        async function getMenus() {
            if (!selectedRestaurant) return;

            setMenus([]);
            setSelectedMenu(null);
            setCategories([]);
            setSelectedCategory(null);
            try {
                console.log(selectedRestaurant);
                const response = await api.get(`restaurants/${selectedRestaurant?.id}/menus`);
                setMenus(response.data);
                if (response.data.length > 0)
                    setSelectedMenu(response.data[0]);
            } catch (error) {
                console.error('Error fetching menus:', error);
                Swal.fire({
                    icon: 'error',
                    title: t("menus.errorAlert.title"),
                    text: t("menus.errorAlert.fetchMenusMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                })
            } finally {
                setLoading(false);
            }
        }
        getMenus();
    }, [selectedRestaurant]);

    useEffect(() => {
        if (!selectedMenu) {
            setCategories([]);
            setSelectedCategory(null);
            return;
        }
        async function getCategories() {
            try {
                const response = await api.get(`menus/${selectedMenu.id}/categories`);
                setCategories(response.data);
                setSelectedCategory(response.data[0] ?? null);
            } catch (error) {
                console.error('Error fetching menus:', error);
                Swal.fire({
                    icon: 'error',
                    title: t("menus.errorAlert.title"),
                    text: t("menus.errorAlert.fetchCategoriesMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                })
            } finally {
                setLoading(false);
            }
        }
        getCategories();
    }, [selectedMenu]);

    useEffect(() => {
        if (!selectedCategory) {
            setItems([]);
            return;
        }
        async function getItems() {
            try {
                const response = await api.get(`categories/${selectedCategory?.id}/menu-items`);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching Items:', error);
                Swal.fire({
                    icon: 'error',
                    title: t("menus.errorAlert.title"),
                    text: t("menus.errorAlert.fetchItemsMessage"),
                    showCloseButton: true,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary
                })
            } finally {
                setLoading(false);
            }
        }
        getItems();
    }, [selectedCategory]);
  return (
    <>
    <Box>
        <Box position={'absolute'} top={'3%'} left={'8%'} display={{sm: "block", md: "none"}}>
            <IconButton onClick={() => setOpen(true)}>
                <MenuIcon sx={{color: "text.primary"}}/>
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
            <Box display={'flex'} bgcolor={"background.default"} gap={0}>
            {localStorage.getItem("role") === "RESTAURANT_OWNER" ? (
                <OwnerSidebar view={"desktop"}/>
                ) : (
                <Sidebar view={"desktop"}/>
                )}
            <Box flex={5.5} mt={{xs: 0, md: 0}}>
                <Box sx={{minHeight: "80px", width: "100%", bgcolor: "background.paper",
                    borderBottom: 1, borderColor: "divider", px: 4
                }}>
                    <Grid container alignItems={'center'} spacing={2} py={2} pt={{xs: 6, md: 2}}
                    textAlign={{xs: 'center', lg: 'left'}} justifyContent={"space-between"}>
                        <Grid size={{xs: 12, lg: 3.5}}>
                            <Box>
                                <Typography variant='h5' color='text.primary' fontWeight={700}>
                                    {t("menus.title")}
                                </Typography>
                                <Typography variant='body1' color='text.secondary'>
                                    {t("menus.description")}
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{display: {xs: 'none', lg: 'block'}, height: "50px", alignSelf: "center"}}/>
                        <Grid size={{xs: 9, lg: 4.5}} sx={{mt: {xs: 2, lg: 0}}}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: {xs: 1, lg: 2}, p: 1, borderRadius: 1, border: "1px solid #e0e0e0", cursor: "pointer", width: "100%", height: "60px" }} onClick={
                                (e) => setAnchorEl(e.currentTarget)
                            } > {/* Left icon */} 
                                <Box sx={{ bgcolor: "primary.light", p: 1, display: {
                                    xs: "none", sm: "flex"
                                }, borderRadius: 1, alignItems: "center", justifyContent: "center", borderRadius: 1 }} 
                                flex={1}> <Restaurant sx={{color: "#333"}} /> 
                                </Box> 
                                {/* Text */} 
                                <Box flex={8}> 
                                    <Typography variant="caption" color="text.secondary">
                                        {t("menus.currentRestaurantLabel")} 
                                    </Typography> 
                                    <Typography variant="subtitle1" fontWeight={600}> 
                                        {loading ? (
                                            <Skeleton width={200} variant='text' />
                                        ) :
                                        selectedRestaurant ? selectedRestaurant.name
                                         : t("menus.selectRestaurantLabel")} 
                                    </Typography> 
                                </Box> 
                                {/* Arrow */} 
                                <IconButton size="small" sx={{flex: 1}}> 
                                    <ExpandMore />
                                </IconButton> 
                            </Box> 
                            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left", }} transformOrigin={{ vertical: "top", horizontal: "left", }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        width: anchorEl ? anchorEl.offsetWidth : undefined
                                    }
                                }
                            }}>
                                {restaurants.length === 0 ? 
                                (
                                    <MenuItem disabled>{t("menus.noRestaurantsLabel")}</MenuItem>
                                ) : 
                                (
                                    restaurants.map((restaurant) => (
                                    <MenuItem key={restaurant.id} onClick={() => {
                                        setSelectedRestaurant(restaurant);
                                        handleClose();
                                    }}>
                                        {restaurant.name}
                                    </MenuItem>
                                    )
                                    )
                                )}
                            </Menu>
                        </Grid>
                        <Grid size={{xs: 3, lg: 3}} sx={{mt: {xs: 2, lg: 0}}}>
                            <Button variant='contained' color='primary' 
                            startIcon={<QrCode />} fullWidth sx={{height: "50px",
                                display: {xs: 'none', lg: 'flex'}
                            }} onClick={loadQr}>
                                {t("menus.previewQRLabel")}
                            </Button>
                            <Button variant='contained' color='primary' fullWidth sx={{height: "50px",
                                display: {xs: 'flex', lg: 'none'},
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 0
                            }} onClick={loadQr}>
                                <QrCode/>
                            </Button>
                        </Grid>
                        <Modal
                        open={openQr}
                        onClose={() => setOpenQr(false)}>
                            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '400px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1
                            }} textAlign={'center'}>
                                <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                    Menu QR Code
                                </Typography>
                                <img src={qrUrl} alt="Menu QR Code"  width={200} height={200}/>
                                <Button variant='contained' fullWidth sx={{mt: 1,
                                    height: "50px"}} onClick={() =>downloadQr(selectedMenu?.id)}
                               >
                                    Download
                                </Button>
                            </Box>
                        </Modal>
                    </Grid>
                </Box>
                <Box p={4} height={{xs: "fit-content", md: "80vh", lg: "87vh"}}
                maxHeight={{xs: "70vh", md: "90vh"}}>
                    <Grid container spacing={4} height={"100%"}>
                        <Grid size={{xs: 12, sm: 6, lg: 3}} height={"100%"}>
                            <Paper sx={{p: 2, height: {xs: "fit-content", md: "100%"}, width: "100%", overflowY: "auto", maxHeight: {xs: "70vh", md: "100%"}
                            }}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={"10%"}>
                                    <Typography variant='h6' fontWeight={600}>
                                        {t("menus.menusLabel")}
                                    </Typography>
                                    <Tooltip title={t("menus.createMenu.title")}>
                                        <IconButton onClick={() => setOpenAddMenu(true)}>
                                            <Add sx={{color: "success.main", fontSize: 30}}/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                <List>
                                    {menus.length === 0 ? 
                                    (
                                        <Typography display={'flex'} gap={1} alignItems={'center'}>
                                            <SentimentDissatisfiedOutlined/>
                                            {t("menus.noMenusLabel")}
                                        </Typography>
                                    ) : (
                                        menus.map((menu) => (
                                            <ListItem key={menu.id}
                                            disablePadding sx={{borderRadius: 1, 
                                                bgcolor: selectedMenu?.id === menu?.id ? "primary.light" : "background.default",
                                                mb: 1
                                            }}
                                            onClick={() => setSelectedMenu(menu)}
                                            >
                                                <ListItemButton sx={{p: 2, borderRadius: 1,
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}>
                                                    <Box flex={4}>
                                                        <ListItemText primary={
                                                            <>
                                                            <Typography variant='body1'
                                                            color='text.primary'
                                                            sx={{
                                                                fontWeight: selectedMenu?.id === menu?.id ? 600 : 400
                                                            }}
                                                            >
                                                                {menu.name}
                                                            </Typography>
                                                            <Typography variant='body1'
                                                            sx={{color: menu.active ? "success.main" : "error.main"}}>
                                                                {menu.active ? t("menus.editMenu.activeLabel") : t("menus.editMenu.inactiveLabel")}
                                                            </Typography>
                                                            </>
                                                        }/>
                                                    </Box>
                                                    <Box flex={1}>
                                                        <Tooltip title={t("menus.menuOperationsLabel")}>
                                                            <IconButton onClick={
                                                                () => setOpenOperations(true)
                                                            }>
                                                                <MoreHoriz/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    )
                                    )}
                                </List>
                                <Modal
                                    open={openAddMenu}
                                    onClose={() => setOpenAddMenu(false)}
                               >
                                    <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '400px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                                        borderRadius: 1
                                    }}>
                                        <Typography variant="h5" component="h2" fontWeight={600}
                                        textAlign={'center'}>
                                            {t("menus.createMenu.title")}
                                        </Typography>
                                        <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                        <TextField label={t("menus.createMenu.nameLabel")} fullWidth sx={{mt: 2}} value={menuName} onChange={(e) => setMenuName(e.target.value)}/>
                                        <Button variant="contained" sx={{mt: 2, bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'},
                                    height: "50px"}} fullWidth
                                    startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <Add />}
                                    onClick={handleAddMenu}
                                    disabled={loading}>
                                            {loading ? t("menus.createMenu.buttonLoading") : 
                                            t("menus.createMenu.button")}
                                        </Button>
                                    </Box>
                                </Modal>
                                <Modal
                                    open={openOperations}
                                    onClose={() => setOpenOperations(false)}
                               >
                                    <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '400px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                                        borderRadius: 1
                                    }}>
                                        <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                            {t("menus.editMenu.title")}
                                        </Typography>
                                        <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                        <TextField label={t("menus.editMenu.nameLabel")} fullWidth sx={{mt: 2}} value={menuName} onChange={(e) => setMenuName(e.target.value)}/>
                                        <Button variant="contained" fullWidth
                                        startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <Update/>} sx={{height: "40px", mt: 2}}
                                        onClick={handleUpdateMenu} disabled={loading}>
                                            {loading ? t("menus.editMenu.buttonLoading") : 
                                            t("menus.editMenu.button")}
                                        </Button>
                                        <Divider sx={{my: 3, borderColor: "divider", borderWidth: 1}}></Divider>
                                        <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                            {t("menus.editMenu.otherOpsLabel")}
                                        </Typography>
                                        <Box mt={2}>
                                            {selectedMenu?.active ? (
                                                <Button variant='contained' fullWidth
                                                sx={{height: '40px', bgcolor: 'error.light'
                                                    ,color: "#fff"
                                                }} startIcon={<WebAssetOffOutlined/>}
                                                onClick={handleDisableMenu}>
                                                    {t("menus.editMenu.disableButton")}
                                                </Button>
                                            ) : (
                                                <Button variant='contained' fullWidth
                                                sx={{height: '40px', bgcolor: 'success.light'
                                                    ,color: "#fff"
                                                }} startIcon={<WebAsset/>}
                                                onClick={handleEnableMenu}>
                                                    {t("menus.editMenu.enableButton")}
                                                </Button>
                                            )}
                                            <Button variant='contained' color='error'
                                            fullWidth sx={{height: "40px", flex: 1, mt: 1}}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <DeleteOutlined/>}
                                            onClick={handleDeleteMenu}
                                            disabled={loading}>
                                                {loading ? t("menus.editMenu.deleteButtonLoading") : 
                                                t("menus.editMenu.deleteButton")}
                                            </Button>
                                        </Box>
                                    </Box>

                                </Modal>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6, lg: 3}} height={"100%"}>
                            <Paper sx={{p: 2, height: {xs: "fit-content", md: "100%"}, width: "100%", overflowY: "auto", maxHeight: {xs: "70vh", md: "100%"}
                            }}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={"10%"}>
                                    <Typography variant='h6' fontWeight={600}>
                                        {t("menus.categoriesLabel")}
                                    </Typography>
                                    <Tooltip title={t("menus.createCategory.title")}>
                                        <IconButton onClick={() => setOpenAddCategory(true)}>
                                            <Add sx={{color: "success.main", fontSize: 30}}/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                <List>
                                    {categories.length === 0 ? 
                                    (
                                        <Typography display={'flex'} gap={1} alignItems={'center'}>
                                            <SentimentDissatisfiedOutlined/>
                                            {t("menus.noCategoriesLabel")}
                                        </Typography>
                                    ) : (
                                        categories.map((c) => (
                                            <ListItem key={c.id}
                                            disablePadding sx={{borderRadius: 1, 
                                                bgcolor: selectedCategory?.id === c?.id ? "primary.light" : "background.default",
                                                mb: 1
                                            }}
                                            onClick={() => setSelectedCategory(c)}
                                            >
                                                <ListItemButton sx={{p: 2, borderRadius: 1,
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}>
                                                    <Box flex={4}>
                                                        <ListItemText primary={
                                                            <>
                                                            <Typography variant='body1'
                                                            color='text.primary'
                                                            sx={{
                                                                fontWeight: selectedCategory?.id=== c?.id ? 600 : 400
                                                            }}
                                                            >
                                                                {c.categoryName}
                                                            </Typography>
                                                            </>
                                                        }/>
                                                    </Box>
                                                    <Box flex={1}>
                                                        <Tooltip title={t("menus.menuOperationsLabel")}>
                                                            <IconButton onClick={
                                                                () => setOpenOperationsCategory(true)
                                                            }>
                                                                <MoreHoriz/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    )
                                    )}
                                </List>
                                <Modal
                                    open={openAddCategory}
                                    onClose={() => setOpenAddCategory(false)}
                               >
                                    <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '400px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                                        borderRadius: 1
                                    }}>
                                        <Typography variant="h5" component="h2" fontWeight={600}
                                        textAlign={'center'}>
                                            {t("menus.createCategory.title")}
                                        </Typography>
                                        <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                        <TextField label={t("menus.createCategory.nameLabel")} fullWidth sx={{mt: 2}} value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                                        <Button variant="contained" sx={{mt: 2, bgcolor: 'primary.main', '&:hover': {bgcolor: 'primary.dark'},
                                    height: "50px"}} fullWidth
                                    startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <Add />}
                                    onClick={handleAddCategory}
                                    disabled={loading}>
                                            {loading ? t("menus.createCategory.buttonLoading") : 
                                            t("menus.createCategory.button")}
                                        </Button>
                                    </Box>
                                </Modal>
                                <Modal
                                    open={openOperationsCategory}
                                    onClose={() => setOpenOperationsCategory(false)}
                               >
                                    <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '400px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                                        borderRadius: 1
                                    }}>
                                        <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                            {t("menus.editCategory.title")}
                                        </Typography>
                                        <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                        <TextField label={t("menus.editCategory.nameLabel")} fullWidth sx={{mt: 2}} value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                                        <Button variant="contained" fullWidth
                                        startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <Update/>} sx={{height: "40px", mt: 2}}
                                        onClick={handleUpdateCategory} disabled={loading}>
                                            {loading ? t("menus.editCategory.buttonLoading") :
                                            t("menus.editCategory.button")}
                                        </Button>
                                        <Divider sx={{my: 3, borderColor: "divider", borderWidth: 1}}></Divider>
                                        <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                            {t("menus.editMenu.otherOpsLabel")}
                                        </Typography>
                                        <Box mt={2}>
                                            <Button variant='contained' color='error'
                                            fullWidth sx={{height: "40px", flex: 1, mt: 1}}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <DeleteOutlined/>}
                                            onClick={handleDeleteCategory}
                                            disabled={loading}>
                                                {loading ? t("menus.editCategory.deleteButtonLoading") : 
                                                t("menus.editCategory.deleteButton")}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, lg: 6}} height={"100%"} mb={2}>
                            <Paper sx={{p: 2, height: {xs: "fit-content", md: "100%"}, width: "100%", overflowY: "auto", maxHeight: {xs: "70vh", md: "100%"}}}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={"10%"}>
                                    <Typography variant='h6' fontWeight={600}>
                                        {t("menus.itemsLabel")} 
                                        <Typography variant='h6' component='span' fontWeight={600} sx={{ml: 1}} color='success'>
                                            {selectedCategory?.categoryName}
                                        </Typography>
                                    </Typography>                                    
                                    <Button variant='contained' sx={{
                                        height: '40px', width: "150px",
                                        color: "background.default"
                                    }} color='success' startIcon={<Add/>}
                                    onClick={() => setOpenAddItem(true)}>
                                        {t("menus.createItem.title")}
                                    </Button>
                                </Box>
                                <TextField label="search" fullWidth variant='outlined' sx={{
                                    mt:1
                                }} value={search} onChange={(e) => setSearch(e.target.value)}/>
                                <Divider sx={{my: 1, borderColor: "divider", borderWidth: 1}}></Divider>
                                <List>
                                    {filteredItems.length === 0 ? 
                                    (
                                        <Typography display={'flex'} gap={1} alignItems={'center'}>
                                            <SentimentDissatisfiedOutlined/>
                                            {t("menus.noItemsLabel")}
                                        </Typography>
                                    ) : (
                                        filteredItems.map((i) => (
                                            <ListItem key={i.id}
                                            disablePadding sx={{borderRadius: 1,
                                                mb: 1
                                            }}
                                            >
                                            <Paper elevation={2} sx={{p: 2, borderRadius: 1, width: "100%" }}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item size={{xs: 12, sm: 3}} display={'flex'} justifyContent={'center'}>
                                                        <Box
                                                            component="img"
                                                            src={`http://localhost:8080/api/images/${i.imageUrl}`}
                                                            alt={i.name}
                                                            sx={{
                                                                width: "100%",
                                                                maxWidth: {xs: "100%",sm: "200px", md: "100%"},
                                                                borderRadius: "15px",
                                                                objectFit: "cover",
                                                                aspectRatio: "1/1",
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item size={{xs: 9, sm: 8}}>
                                                        <Box
                                                            display={'flex'}
                                                            justifyContent={'space-between'}
                                                            alignItems={'center'}
                                                            flexWrap="wrap"
                                                            gap={1}
                                                        >
                                                            <Typography variant='h6' fontWeight={600}>
                                                                {i.name}
                                                            </Typography>
                                                            <Typography variant='h6' fontWeight={700} color='success.main'>
                                                                {i.currency === "USD" && "$"}
                                                                {i.currency === "TL" && "₺"}
                                                                {i.currency === "SDG" && "ج.س"}
                                                                {i.price}
                                                            </Typography>
                                                        </Box>
                                                        <Typography color="text.secondary" sx={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            mt: 0.5,
                                                        }}>
                                                            {i.description}
                                                        </Typography>
                                                        <Typography mt={0.5} sx={{
                                                            color: i.available ? "success.main" : "error.main",
                                                            fontWeight: 700
                                                        }}>
                                                            {i.available ? t("menus.createItem.availableLabel") : t("menus.createItem.unavailableLabel")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item size={{xs: 3, sm: 1}}>
                                                        <Stack direction={{ xs: 'row', md: 'column' }} justifyContent="flex-end">
                                                            <Tooltip title={t("menus.editItem.updateButton")}>
                                                            <IconButton onClick={() => handleOpenUpdateItem(i)}>
                                                                <Edit sx={{color: "primary.main"}}/>
                                                            </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={t("menus.editItem.deleteButton")}>
                                                            <IconButton onClick={() => handleDeleteItem(i.id)}>
                                                                {loading ? (
                                                                    <CircularProgress size={20} sx={{color: "error.main"}}/>
                                                                ) : (
                                                                    <DeleteOutlined sx={{color: "error.main"}}/>
                                                                )}
                                                            </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                            </ListItem>
                                        )
                                    )
                                    )}
                                </List>
                            </Paper>
                            <Modal 
                            open={openAddItem}
                            onClose={handleCloseAddItem}>
                                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '700px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                                        borderRadius: 1
                                }}>
                                    <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                        {t("menus.createItem.title")}
                                    </Typography>
                                    <Grid container spacing={2} mt={3}>
                                        <Grid size={{xs: 12, md: 4}} display={'flex'} flexDirection={'column'}
                                        alignItems={'center'}>
                                            <Box width={"200px"} height={"200px"}
                                            sx={{cursor: 'pointer', display: 'flex',
                                                borderRadius: "10px"
                                            }}
                                            component={'label'}>
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    width={"100%"}
                                                    height={"100%"}
                                                />
                                                {previewUrl ? (
                                                    <img src={previewUrl} style={{width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    }}/>
                                                ) : (
                                                    <Box width={"100%"} height={"100%"}
                                                    sx={{bgcolor: "#c4c4c4"}} display={'flex'}
                                                    justifyContent={"center"} alignItems={"center"}>
                                                        <Typography variant='body1' textAlign={'center'}>
                                                            {t("menus.createItem.uploadImageLabel")}<Typography display={'block'} variant='body3' fontSize={"12px"}>
                                                                {t("menus.createItem.recommendedSizeLabel")}
                                                            </Typography>
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            {previewUrl && 
                                            <Button fullWidth variant='contained' color='warning'
                                            onClick={() => {
                                                setImage(null),
                                                setPreviewUrl(null)
                                            }} sx={{mt: 1}}>
                                               Remove image 
                                            </Button>}
                                            {exceededSize && 
                                                <Alert icon={<ErrorOutline fontSize='inherit'/>}
                                                severity='error' sx={{width: "100%", mt:2}}>
                                                    {t("menus.createItem.exceededSize")}
                                                </Alert>}
                                        </Grid>
                                        <Grid size={{xs: 12, md: 8}}>
                                                <form action="#" onSubmit={handleCreateItem}>
                                                    <TextField fullWidth label={t("menus.createItem.nameLabel")}
                                                    sx={{mb: 2}} autoFocus value={itemName}
                                                    onChange={(e) => setItemName(e.target.value)}
                                                    required/>
                                                    <TextField fullWidth label={t("menus.createItem.descriptionLabel")}
                                                    sx={{mb: 2}} multiline minRows={6}
                                                    value={itemDescription}
                                                    onChange={(e) => setItemDescription(e.target.value)} required/>
                                                    <Grid container spacing={1}>
                                                        <Grid size={{xs: 8, sm: 9}}>
                                                            <TextField fullWidth label={t("menus.createItem.priceLabel")}
                                                            sx={{mb: 2}} type='number'
                                                            value={itemPrice}
                                                            onChange={(e) => setItemPrice(
                                                                Number(e.target.value)
                                                            )}
                                                            inputProps={{
                                                                min: 0,
                                                                step: 0.01
                                                            }} required/>
                                                        </Grid>
                                                        <Grid size={{xs: 4, sm: 3}}>
                                                            <FormControl fullWidth>
                                                            <Select
                                                                value={currency}
                                                                onChange={(e) => setCurrency(e.target.value)}
                                                            >
                                                                <MenuItem value={"USD"}>USD</MenuItem>
                                                                <MenuItem value={"TL"}>TL</MenuItem>
                                                                <MenuItem value={"SDG"}>SDG</MenuItem>
                                                            </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    <Button variant='contained' fullWidth
                                                    sx={{height: "40px", color: "background.default"}} color='success' startIcon={
                                                        loading ? <CircularProgress size={20} color="inherit"/> : <Add/>
                                                    } disabled={loading}
                                                    type='submit'>
                                                        {loading ? t("menus.createItem.buttonLoading") : t("menus.createItem.button")}
                                                    </Button>
                                                </form>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                            <Modal 
                            open={openUpdateItem}
                            onClose={handleCloseUpdateItem}>
                                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: {xs: '80%', md: '700px'}, bgcolor: 'background.paper', boxShadow: 24, p: 4,
                                        borderRadius: 1, maxHeight: "90vh", overflowY: 'auto'
                                }}>
                                    <Typography variant='h6' fontWeight={600} textAlign={'center'}>
                                        {t("menus.editItem.updateLabel")}
                                    </Typography>
                                    <Grid container spacing={2} mt={3}>
                                        <Grid size={{xs: 12, md: 4}} display={'flex'} flexDirection={'column'}
                                        alignItems={'center'}>
                                            <Box width={"200px"} height={"200px"}
                                            sx={{cursor: 'pointer', display: 'flex',
                                                borderRadius: "10px"
                                            }}
                                            component={'label'}>
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    width={"100%"}
                                                    height={"100%"}
                                                />
                                                {previewUrl ? (
                                                    <img src={previewUrl} style={{width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    }}/>
                                                ) : (
                                                    <Box width={"100%"} height={"100%"}
                                                    sx={{bgcolor: "#c4c4c4"}} display={'flex'}
                                                    justifyContent={"center"} alignItems={"center"}>
                                                        <Typography variant='body1' textAlign={'center'}>
                                                            {t("menus.createItem.uploadImageLabel")}<Typography display={'block'} variant='body3' fontSize={"12px"}>
                                                                {t("menus.createItem.recommendedSizeLabel")}
                                                            </Typography>
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            {previewUrl && 
                                            <Button fullWidth variant='contained' color='warning'
                                            onClick={() => {
                                                setImage(null),
                                                setPreviewUrl(null)
                                            }} sx={{mt: 1}}>
                                               Remove image 
                                            </Button>}
                                            {exceededSize && 
                                                <Alert icon={<ErrorOutline fontSize='inherit'/>}
                                                severity='error' sx={{width: "100%", mt:2}}>
                                                    {t("menus.createItem.exceededSize")}
                                                </Alert>}
                                        </Grid>
                                        <Grid size={{xs: 12, md: 8}}>
                                                <form action="#" onSubmit={handleUpdateItem}>
                                                    <TextField fullWidth label={t("menus.editItem.nameLabel")}
                                                    sx={{mb: 2}} autoFocus value={itemName}
                                                    onChange={(e) => setItemName(e.target.value)} required/>
                                                    <TextField fullWidth label={t("menus.createItem.descriptionLabel")}
                                                    sx={{mb: 2}} multiline minRows={6}
                                                    value={itemDescription}
                                                    onChange={(e) => setItemDescription(e.target.value)} required/>
                                                    <Grid container spacing={1}>
                                                        <Grid size={{xs: 7, sm: 9}}>
                                                            <TextField fullWidth label={t("menus.createItem.priceLabel")}
                                                            sx={{mb: 2}} type='number'
                                                            value={itemPrice}
                                                            onChange={(e) => setItemPrice(
                                                                Number(e.target.value)
                                                            )}
                                                            inputProps={{
                                                                min: 0,
                                                                step: 0.01
                                                            }} required/>
                                                        </Grid>
                                                        <Grid size={{xs: 5, sm: 3}}>
                                                            <FormControl fullWidth>
                                                            <Select
                                                                value={currency}
                                                                onChange={(e) => setCurrency(e.target.value)}
                                                            >
                                                                <MenuItem value={"USD"}>USD</MenuItem>
                                                                <MenuItem value={"TL"}>TL</MenuItem>
                                                                <MenuItem value={"SDG"}>SDG</MenuItem>
                                                            </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    <Button variant='contained' fullWidth
                                                    sx={{height: "40px", color: "background.default"}} color='success' startIcon={
                                                        loading ? <CircularProgress size={20} color="inherit"/> : <Add/>
                                                    } disabled={loading}
                                                    type='submit'>
                                                        {loading ? t("menus.editItem.buttonLoading") : t("menus.editItem.updateButton")}
                                                    </Button>
                                                </form>
                                                {available && 
                                                <Button fullWidth variant='contained' color='error' sx={{mt:1, height: "40px",
                                                    color: 'background.default'
                                                }}
                                                onClick={unavailableItem} startIcon={loading ? <CircularProgress size={20} color='inherit'/> :
                                                <EventBusy sx={{color: "background.default"}}/>}
                                                disabled={loading}>
                                                    List item as unavailable
                                                </Button>}
                                                {!available && 
                                                <Button fullWidth variant='contained' color='success' sx={{mt:1, height: "40px",
                                                    color: 'background.default'
                                                }}
                                                onClick={availableItem} startIcon={loading ? <CircularProgress size={20} color='inherit'/> :
                                                <EventAvailable sx={{color: "background.default"}}/>}
                                                disabled={loading}>
                                                    List item as available
                                                </Button>}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    </Box>
    </>
  )
}

export default Menus