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
import WishlistPage from './pages/wishlist/wishlist-page';


import { CartProvider } from './contexts/cart-context';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider } from './contexts/auth-context';
import AddGame from './components/AddGame';
import ViewGames from './components/ViewGames';
import Settings from './components/Settings';
import Purchases from './components/Purchases';
import { Footer } from './components/Footer';
import RequireClient from './components/requireClient';


import RequireAdmin from './components/RequireAdmin';
import Users from './pages/admin/Users';
import Profile from './pages/profile/profile';

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
                  {/* Client Routes protected by RequireClient */}
                  <Route path="/" element={<HomeGameStore />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/games/:id" element={<GamePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/profile" element={<Profile />} />


                  {/* Admin Routes protected by RequireAdmin */}
                  <Route path="/admin" element={<RequireAdmin><AdminApp /></RequireAdmin>}>
                    <Route index element={<AddGame />} />
                    <Route path="add-a-game" element={<AddGame />} />
                    <Route path="view-games" element={<ViewGames />} />
                    <Route path="purchases" element={<Purchases />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />

                {/* Optional: Hide footer on admin routes */}
                {/* {!isAdminRoute && <Footer />} */}
              </>
            </ThemeProvider>
          </LoadingBarContainer>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);