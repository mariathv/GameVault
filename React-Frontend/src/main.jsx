import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { LoadingBarContainer } from 'react-top-loading-bar';
import './index.css';

import HomeGameStore from './pages/Home';
import AdminApp from './Admin.jsx';
import CartPage from './pages/cart/page';
import GamePage from './pages/games/[id]/games-page';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import { NotFound } from './pages/not-found';

import { CartProvider } from './contexts/cart-context';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider } from './contexts/auth-context';
import AddGame from './components/AddGame';
import ViewGames from './components/ViewGames';
import Settings from './components/Settings';
import Purchases from './components/Purchases';
import { Footer } from './components/Footer';


import RequireAdmin from './components/RequireAdmin';
import Users from './pages/admin/Users';

console.log("-------> in main");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LoadingBarContainer>
            <ThemeProvider>
              <>
                <Routes>
                  <Route path="/" element={<HomeGameStore />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/games/:id" element={<GamePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected admin route */}
                  <Route path="/admin" element={<RequireAdmin><AdminApp /></RequireAdmin>}>
                    <Route index element={<AddGame />} />
                    <Route path="add-a-game" element={<AddGame />} />
                    <Route path="view-games" element={<ViewGames />} />
                    <Route path="purchases" element={<Purchases />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />

                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </>

            </ThemeProvider>
          </LoadingBarContainer>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode >
);