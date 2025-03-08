import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { LoadingBarContainer } from 'react-top-loading-bar';
import './index.css';
import HomeGameStore from './pages/Home';
import AdminApp from './Admin.jsx';
import AuthPage from './pages/Auth';
import CartPage from './pages/cart/page';
import { CartProvider } from './contexts/cart-context';
import GamePage from './pages/games/[id]/games-page';


const isAdmin = false;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {isAdmin ? (
        <ChakraProvider>
          <CartProvider>
            <LoadingBarContainer>
              <Routes>
                <Route path="/" element={<HomeGameStore />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin" element={<AdminApp />} />
              </Routes>
            </LoadingBarContainer>
          </CartProvider>
        </ChakraProvider>
      ) : (
        <CartProvider>
          <LoadingBarContainer>
            <Routes>
              <Route path="/" element={<HomeGameStore />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/games/:id" element={<GamePage />} />
            </Routes>
          </LoadingBarContainer>
        </CartProvider>
      )}
    </BrowserRouter>
  </StrictMode>
);
