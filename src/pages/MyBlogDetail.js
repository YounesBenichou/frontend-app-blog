import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import * as React from 'react';
import { useHistory } from 'react-router';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Stack,
  Typography,
  Container,
  Box,
  CircularProgress
} from '@mui/material';

import { useCallback } from 'react';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import palette from '../theme/palette';
import axios from 'axios';
import { async } from 'regenerator-runtime';

// ----------------------------------------------------------------------


// front-app-session 
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';

function ContentPreview({ content }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default function MyBlogDetail() {
  // authn
  let userId = '';
  const { authenticatedUser } = useContext(AppContext);
  const user_data = useContext(AppContext);

  if (authenticatedUser) {
    userId = user_data.authenticatedUser.userId;
  }

  const location = useLocation();
  
  // routing 
  const history = useHistory();
  
  const listPost = ()=>{
    history.goBack();
  }

  // consts 

  // UseState
  const [EditMode,setEditMode] = React.useState(false)

  const intialPost = {
    "title": null,
    "summary": null,
    "is_published": false,
    "content": null,
    "user_id": userId,
    "cover_photo": null,
  }
  const [post,setPost]= React.useState()
  const [newImage,setNewImage]= React.useState(null)

  // consts 
  const URL_POST_CreatePost = getConfig().LMS_BASE_URL + "/api/posts/v1/posts/create/"

  // usestate
  const [onSumbition,setOnSumbition]= React.useState(false)
  
  const [requestResult, setRequestResult] = useState({
    'sucess' : null,
    'error': null,
  });

  const [formErrors, setFormErrors] = useState({
    "title": null,
    "cover_photo": null,
  });

  // functions 


  const createPost = async() =>{
    try {
      const { data } = await getAuthenticatedHttpClient().post(
        URL_POST_CreatePost,post, {headers: {
          'Content-Type': 'multipart/form-data',
        }},
      );
      setRequestResult({'sucess':'l\'article a été cré avec succès', 'error': null} )
      history.goBack()
      setOnSumbition(false)
    }catch (error) {
      setRequestResult({'sucess':null, 'error': 'Veuillez réessayer'} )
      setOnSumbition(false)
      console.error('article error:', error);
    }
  }

  const URL_PUT_POST = getConfig().LMS_BASE_URL + "/api/posts/v1/posts/modify/"
  const modifyPost = async() =>{
    console.log(post)
    try {
      console.log(post)
      const { data } = await axios.put(
        URL_PUT_POST+location.state.id+"/",post, {headers: {
          'Content-Type': 'multipart/form-data',
        }},
      )
      setRequestResult({'sucess':'l\'article a été modifié avec succès', 'error': null} )
      setOnSumbition(false)
    }catch (error) {
      setOnSumbition(false)
      setRequestResult({'sucess':null, 'error': 'Veuillez réessayer'})
    }
      
  }

  const handleSubmit = useCallback ((event) => {
    
      event.preventDefault()
      // Check if all required fields are filled
      let hasErrors = false;
      const newFormErrors = {};

      if (!post.title) {
        newFormErrors.title = 'Titre est obligatoire';
        hasErrors = true;
      }

      if (hasErrors) {
        setFormErrors(newFormErrors);
      } else {
        // Submit the form data (e.g., send it to an API)
        if (EditMode){
          modifyPost()
        }else{
          createPost()
        }
      }
    }
    ,[post])

  React.useEffect(()=>{
    if (location.state){
      console.log('location',location.state)
      setEditMode(true)
      setPost(location.state)
    }else{
      setPost(intialPost)
    }
  },[])

  React.useEffect(()=> console.log('post',post),[post])

  return (
        
        <React.Fragment>
        { post &&
        <form onSubmit={handleSubmit}>
        <Container>
          
          <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 2 }} justifyContent="flex-start" mb={3}>
            <div onClick={listPost} className="back_icon" > </div>
            {EditMode ? 
            <Typography variant="h4" gutterBottom>
              Modifier un article
            </Typography>
            :
            <Typography variant="h4" gutterBottom>
              Créer un article
            </Typography>
            }
          </Stack>
          {requestResult.error && 
          <Stack  mb={3}>
            <Alert severity="error">{requestResult.error}</Alert>
          </Stack>
          }
          {requestResult.sucess && 
          <Stack  mb={3}>
            <Alert severity="success">{requestResult.sucess}</Alert>
          </Stack>
          }
          <Card>
            
            <Divider />
            
            <CardContent>

            <Stack width={'75%'} spacing={{ xs: 3, sm: 3 }} direction="column" useFlexGap flexWrap="wrap">
              {EditMode &&
                <TextField
                  required
                  id="nomFormation"
                  name="nomFormation"
                  label="Identifiant de la formation"
                  fullWidth
                  defaultValue={location.state.id}
                  value={location.state.id}
                  variant="outlined"
                />
              }
              <FormControl error sx={{ width:'100%' }} >
                  <TextField
                    required
                    id="nomPost"
                    name="nomPost"
                    label="Titre d'article"
                    placeholder='par exemple, Introduction au marketing'
                    fullWidth
                    autoComplete="given-name"
                    defaultValue={post.title}
                    value={post.title}
                    onChange={(e) => {
                      setPost({...post, 'title': e.target.value.toString()})
                    }}
                  />
                  {formErrors.title && <FormHelperText id="component-error-text">{formErrors.title}</FormHelperText> }
              </FormControl>
              
              
              <TextField
                multiline
                rows={2}
                maxRows={4}
                id="short-description"
                name="short-description"
                label="Résumé"
                fullWidth
                value={post.summary}
                onChange={(e) => {
                  setPost({...post, 'summary': e.target.value.toString()})
                }}
              />
              
              {/* <ContentPreview content={post.content} /> */}

              <ReactQuill style={{height:'300px'}} theme="snow" value={post.content} onChange={(e) => {
                  setPost({...post, 'content': e})
                }} />
              
                
              <Divider />
              <FormControl error sx={{ width:'100%' }} >
                <Typography my={2} variant='h6'>Image de couverture </Typography>
                {(EditMode && !newImage ) ?
                    <img style={{width:'50%',padding:'30px 0 30px 0'}} alt={post.title} src={getConfig().LMS_BASE_URL +""+ post.cover_photo} />
                  :
                    <img style={{width:'50%',padding:'30px 0 30px 0'}} alt={post.title} src={newImage} />
                }
                <Button sx={{ width:'30%' }} component="label" color="primary" variant="contained" >
                        <div className='text-regular'> Importer
                        </div>
                        <input hidden id="fileSelect" type="file" accept="image/*" 
                            onChange={(e)=>{
                                if ((e.target.files[0].type !== 'image/jpeg') && (e.target.files[0].type !== 'image/jpg') && (e.target.files[0].type !== 'image/png')){
                                    setFormErrors({...formErrors,'cover_photo':"Veuiller importer un fichier .jpeg ou .png"})
                                }  
                                else if(e.target.files[0].size > 20000000 ) {
                                  setFormErrors({...formErrors,'cover_photo':"La taille de l'image ne doit pas dépasser 20MO!"})
                                }else {
                                  setFormErrors({...formErrors,'cover_photo':""})
                                  const formData = new FormData();
                                  formData.append('cover_photo', e.target.files[0]);
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setNewImage(reader.result);
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                  setNewImage(e.target.files[0])
                                  setPost({...post,'cover_photo': e.target.files[0]})
                                }
                            }}
                            onClick={(event)=> { 
                              event.target.value = null
                            }}
                        />
                        
                </Button>
                {formErrors.cover_photo && <FormHelperText id="component-error-text">{formErrors.cover_photo}</FormHelperText> }
              </FormControl>
              <Divider />
            <Stack spacing={{ xs: 15, sm: 15 }} flexDirection={'row'} justifyContent='start' useFlexGap flexWrap="wrap">
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={post.is_published} 
                onChange={(event) => {
                  setPost({...post, 'is_published': event.target.checked})
                }}
                />} label="Publié" />
              </FormGroup>
            </Stack>  
            </Stack>  
            </CardContent>  
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              {!onSumbition ? 
              <>
              
              <Button  
                sx={{background: palette.red['darker'] , '&:hover':{
                        background: palette.red['darker']
                        }}} 
                onClick={handleSubmit}
                variant="contained">
                        
                  Enregistrer
              </Button>
              </>
              :
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
              }
              
            </CardActions>
          </Card>
          </Container>
         </form>
        }
        </React.Fragment>
    
  );
}