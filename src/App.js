
// components
import { Switch, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import ThemeProvider from "./theme";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import StyledChart from "./components/chart";
// layouts

import DashboardLayout from './layouts/dashboard';
import {  getAuthenticatedUser} from '@edx/frontend-platform/auth';
import { getConfig } from "@edx/frontend-platform";

function App() {
    useEffect(()=>{
    if (!getAuthenticatedUser()){
      window.open(getConfig().LMS_BASE_URL, '_self');
      
  }
  },[])
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ScrollToTop />
        <Switch>
        {getAuthenticatedUser() && <Route path="/"><DashboardLayout /></Route> }
        </Switch>  
      </ThemeProvider>
    </BrowserRouter>      
  );
}

export default App;

