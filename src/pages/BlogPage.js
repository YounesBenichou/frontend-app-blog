import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import { Redirect } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// @mui

import { alpha, styled } from '@mui/material/styles';
import { Container, Button,TextField, Box, Link, Stack,Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../utils/formatTime';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Alert from '@mui/material/Alert';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import palette from '../theme/palette';
import axios from 'axios';
import { getConfig } from '@edx/frontend-platform';
import PostListToolbar from '../sections/@dashboard/user/PostListToolbar';

// ----------------------------------------------------------------------
// front-app-session 
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';
//


// ----------------------------------------------------------------------


const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginTop: theme.spacing(1),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '70%',
  objectFit: 'cover',
  position: 'absolute',
});
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BlogPage() {
  // authn
  let userId = '';
  const { authenticatedUser } = useContext(AppContext);
  const user_data = useContext(AppContext);

  if (authenticatedUser) {
    userId = user_data.authenticatedUser.userId;
  }

  // routing 
  const history = useHistory();
  // Consts

  const URL_GET_Posts = getConfig().LMS_BASE_URL + "/api/posts/v1/posts/"

  // UseStates 
  const [posts, setPosts] = useState([])
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterPost,setFilterPost] = useState("")
  // functions 
  const getPosts = async (page) =>{
    try {
      const result = await axios.post(URL_GET_Posts+"?page="+page,
      {
        'filterPost':filterPost
      }
      )
      console.log(result.data)
      setNumPages(result.data.results.num_pages)
      setPosts(result.data.results.results)
      // let i =1
      // let new_list = []
      // while (i<=result.data.results.num_pages){
      //   axios.get(URL_GET_Posts+"?page="+i).then((response) => {
      //     new_list = [...new_list, ...response.data.results.results]; 
      //     setPosts(new_list)
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
      //   i = i + 1
      // }   
    }catch( error ){
      console.log(error)
    }
  }

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };




  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

  const filteredPosts = applySortFilter(posts, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPosts.length && !!filterName;


  // 

  

  useEffect(()=>{
    getPosts(1).then((response)=>setFetchedPost(true)).catch((e)=> console.log(e))
  },[])

  useEffect(()=>{
    console.log(filterPost)
  },[filterPost])

  const toPostDetail = (id)=>{
    history.push('/blog/'+id+'/');    
  }

  const handleChange = (event, page) => {
    getPosts(page);
  };
  return (
    posts && 
    <>
      <Helmet>
        <title> Articles </title>
      </Helmet>

      <Container>
      <Stack my={7} sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            flexDirection: 'row',
            width:'100%'
          }}>
      <Stack my={7} sx={{
            display:"flex",
            justifyContent:"start",
            alignItems:"center",
            flexDirection: 'row',
            width:'70%'
          }}>
      <FormControl sx={{width:'50%', marginRight:'20px'}}>
            <TextField
              
              id="nomPost"
              name="nomPost"
              label="Rechercher article"
              placeholder='par exemple, Introduction au marketing'
              fullWidth
              autoComplete="given-name"
              defaultValue={filterPost}
              value={filterPost}
              sx={{
                border : '1px solid grey',
                borderRadius: '10px',
              }}

              onChange={(e) => {
                setFilterPost(e.target.value.toString())
              }}
            />
      </FormControl>
      <FilterAltIcon onClick={()=> getPosts(1)} sx={{
        transform: 'scale(1.5)',
        '&:hover' : {
          transform: 'scale(2)'
        }
      }}></FilterAltIcon>

      </Stack>
      <Button 
      onClick={()=>{
        history.push('/blog/my-posts/')
      }}
      sx={{
        background: palette.red['darker'],
        '&:hover' : {
          background: palette.red['darker'],
        }
      }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
          Créer article
      </Button>
      </Stack>
        <Grid container spacing={3}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={8} md={4}>
              <Card sx={{ position: 'relative' }} onClick={()=>toPostDetail(post.id)}>
                {post.cover_photo && 
                  <img alt={post.title} style={{
                    minWidth:'100%',
                    minHeight:'200px',
                    maxHeight: '200px'
                  }} src={getConfig().LMS_BASE_URL +""+ post.cover_photo} />
                }
              {/* </StyledCardMedia> */}
      
              <CardContent
                sx={{
                  pt: 1,
                  bottom: 0,
                  width: '100%',
                }}
              >
                <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                  {fDate(post.created)}
                </Typography>
      
                <StyledTitle
                  color="inherit"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    color: 'black',
                  }}
                >
                  {post.title}
                </StyledTitle>
      
                <StyledTitle
                  color="inherit"
                  // variant="subtitle2"
                  underline="none"
                  variant="subtitle2"
                  sx={{
                    color: (theme) => alpha(theme.palette.grey[600], 0.72),
                  }}
                >
                  {post.summary}
                </StyledTitle>
                
                {/* <Typography variant="subtitle2">Plus de détails</Typography> */}
                
                <StyledInfo>
                    <Box
                      key={index}
                      mt={2}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems:'center',
                        color: 'black',
                        '&:hover': {
                          // Define the styles you want to apply on hover here
                          cursor: 'pointer', // Change the cursor to a pointer on hover
                          textDecoration: 'underline'
                        },
                      }}
                      onClick={()=> toPostDetail(post.id) }
                    >
                      <Typography 
                      mr={1}
                      sx={{
                        
                        
                      }}
                      variant="subtitle2">Plus de détails
                      
                      </Typography>
                      <img  width={30} src={'/assets/icons/arrow-detail.svg'}></img>
                    </Box>
                </StyledInfo>
              </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Stack mt={4} sx={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            flexDirection: 'column'
          }}
          spacing={2}>
          <Pagination sx={{
            '&.MuiPagination-root': {
              button : {
                color: 'white',
                background: palette.red['darker'],
                '&:hover' : {
                  color: 'white',
                  background: palette.red['darker'], 
                }
             }
            }
          }} count={numPages} onChange={handleChange} on showFirstButton showLastButton />
        </Stack>
      </Container>


    </>
  );
}
