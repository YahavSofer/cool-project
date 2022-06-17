import React, {useState,useEffect} from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import {Image} from 'react-bootstrap'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import Attendor_img from '../../../images/logo12.png'
import { useHistory } from 'react-router-dom'
import {  useAuth } from '../../../context/AuthContext'
import { Link } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import UpdateIcon from '@mui/icons-material/Update';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {db} from '../../../firebaseConfig'
import { doc,getDoc,updateDoc ,arrayRemove,arrayUnion} from "firebase/firestore"


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const history = useHistory()
  const {currentUser , logout} = useAuth()
  const [profileImage,setProfileImage] = useState()
  const [isProfilePic,setIsProfilePic] = useState(false)
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  async function handleLogout(){
    try{
        await logout()
        history.push('/')
    }catch{
        console.log('Failed to log out');
    }
  
  } 
 
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
    handleMobileMenuClose();
    if(e.target.textContent=== 'Profile'){
      history.push('/user/profile')
    }
    else if (e.target.textContent=== 'My Events'){
      history.push('/user/my-events')
    }
    else if (e.target.textContent=== 'Log Out'){
      handleLogout()
    }
  

    
    
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  useEffect(() => {
  
    // set user profile in event profile picture. if they dont have, place icon insted
    const getUserProfileImg = async () => {
      const userDoc = await getDoc(doc(db,'users',currentUser.uid))
      .then( u =>{
                  setProfileImage(u.data().profileImage);
      } )
        
    };
    getUserProfileImg();  
   


    if (profileImage !== ""){
      setIsProfilePic(true)

    } 
  }, []);





  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My Events</MenuItem>
      <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My Events</MenuItem>
      <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
    </Menu>
  );
  return (
  <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
        <Link to='/user' style={{ textDecoration: 'none' }}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 1 }}
          >
            
              <Image src={Attendor_img} style={{height:'45px',width:'45px'}}/>
            
            </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            paddingTop='5px'
            color='white'
            fontSize={'25px'}
          >
            Attendor
          </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button key="one" style={{maxHeight:'35px',background:'#f0f2f5',fontWeight:'bold',marginRight:'5px',alignSelf:"center"}} startIcon={<UpdateIcon/>} onClick={()=>{window.location.reload()}}><Link to='/user/upcoming-events' style={{ textDecoration: 'none', textTransform:'none'}} >Upcoming Events</Link></Button>
          <Button key="one" style={{maxHeight:'35px',alignSelf:"center",background:'#f0f2f5',fontWeight:'bold',marginRight:'5px'}} startIcon={<FavoriteIcon/>} onClick={()=>{window.location.reload()}}><Link to='/user/liked-events'  style={{ textDecoration: 'none', textTransform:'none' }}>Liked Events</Link></Button>
          <Button key="one" style={{maxHeight:'35px',alignSelf:"center",background:'#f0f2f5',fontWeight:'bold',marginRight:'5px'}} startIcon={<DateRangeIcon/>} onClick={()=>{window.location.reload()}}><Link to='/user/attend-events'  style={{ textDecoration: 'none', textTransform:'none' }}>Attended Events</Link></Button>
          <Button key="one" style={{background:'#2e997b',border:'solid',borderWidth:'1.5px',boxShadow:'0px 0px 8px white',borderColor:'white',fontWeight:'bold', color:'white',minHeight:'1px'}} startIcon={<AddCircleIcon/>} onClick={()=>{window.location.reload()}}><Link to='/user/create-event' style={{ textDecoration: 'none', textTransform:'none',color:'white', fontSize:'18px' }}>Create Event</Link></Button>
          
          <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"         
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}