import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminApp from './Admin.jsx'
import AuthPage from './pages/Auth'
import theme from "./theme.js"
import { ChakraProvider } from '@chakra-ui/react';
import { LoadingBarContainer } from "react-top-loading-bar";
import HomeGameStore from './pages/Home'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingBarContainer>
      <HomeGameStore />
    </LoadingBarContainer>
  </StrictMode>,
)
