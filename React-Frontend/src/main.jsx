import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { LoadingBarContainer } from 'react-top-loading-bar';
import './index.css';
import HomeGameStore from './pages/Home';
import AdminApp from './Admin.jsx';
// import AuthPage from './pages/Auth';
import CartPage from './pages/cart/page';
import { CartProvider } from './contexts/cart-context';
import GamePage from './pages/games/[id]/games-page';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import { NotFound } from './pages/not-found';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider } from './contexts/auth-context';


const isAdmin = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {isAdmin ? (
          <CartProvider>
            <LoadingBarContainer>
              <Routes>
                <Route path="/" element={<AdminApp />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin" element={<AdminApp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LoadingBarContainer>
          </CartProvider>
        ) : (
          <CartProvider>
            <LoadingBarContainer>
              <ThemeProvider>
                <Routes>
                  <Route path="/" element={<HomeGameStore />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/games/:id" element={<GamePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ThemeProvider>
            </LoadingBarContainer>
          </CartProvider>
        )}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

/*
ADMIN:
-> display games before searching too
-> settings : only display base games or dlcs?

*/
