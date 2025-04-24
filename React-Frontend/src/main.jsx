import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import Dashboard from './pages/admin/dashboard';
import { Footer } from './components/Footer';
import Header from './components/Header';

import RequireAdmin from './components/RequireAdmin';
import RequireClient from './components/RequireClient';
import Users from './pages/admin/Users';
import Profile from './pages/profile/profile';
import ExplorePage from './pages/explore/explore';
import CheckoutPage from './pages/checkout/checkout';
import Inventory from './pages/inventory/inventory';
import Help from './pages/admin/Help';
import BlockAdmin from './components/BlockAdmin';
import CustomerSupport from './pages/customer-support/customersupport';

import ScrollToTop from './utils/scrollToTop';
import VerifyEmail from './pages/auth/verify';

import { Toaster } from "@/components/ui/sonner"
import PromoCodes from './pages/admin/promo-codes';
import AccountSettingsPage from "./pages/account-settings/index"
import TwoFactorAuthPage from './pages/auth/two-factor';
import { CurrencyProvider } from './contexts/currency-context';


console.log("-------> in main");

const App = () => {
  const { pathname } = useLocation();

  // Show header only for client routes
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <LoadingBarContainer>
            <ThemeProvider>
              <>
                <ScrollToTop />
                <Toaster
                  position="bottom-right"
                  richColors
                  theme="dark"
                  closeButton
                  toastOptions={{
                    style: {
                      color: '#F8FAFC',
                    },
                    className: 'rounded-2xl shadow-xl text-sm px-4 py-3'
                  }}
                />

                <div className="bg-(--color-background)">
                  {!isAdminRoute && <Header />}
                  <Routes>
                    {/* Public Routes (Blocked for Admins) */}
                    <Route element={<BlockAdmin />}>
                      <Route path="/" element={<HomeGameStore />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/games/:id/:slug" element={<GamePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/explore" element={<ExplorePage />} />
                      <Route path="/explore/genres/:id/:type" element={<ExplorePage />} />
                      <Route path="/explore/themes/:id/:type" element={<ExplorePage />} />
                      <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />

                    </Route>



                    {/* Protected Client Routes (Require Login & Block Admins) */}
                    <Route path="/profile" element={<RequireClient><Profile /></RequireClient>} />
                    <Route path="/checkout" element={<RequireClient><CheckoutPage /></RequireClient>} />
                    <Route path="/wishlist" element={<RequireClient><WishlistPage /></RequireClient>} />
                    <Route path="/inventory" element={<RequireClient><Inventory /></RequireClient>} />
                    <Route path="/account-settings" element={<RequireClient><AccountSettingsPage /></RequireClient>} />
                    <Route path="/support" element={<RequireClient><CustomerSupport /></RequireClient>} />


                    {/* Admin Routes (Require Admin) */}
                    <Route path="/admin" element={<RequireAdmin><AdminApp /></RequireAdmin>}>
                      <Route index element={<Dashboard />} />
                      <Route path="add-a-game" element={<AddGame />} />
                      <Route path="view-games" element={<ViewGames />} />
                      <Route path="purchases" element={<Purchases />} />
                      <Route path="users" element={<Users />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="help" element={<Help />} />
                      <Route path="promo-codes" element={<PromoCodes />} />
                    </Route>

                    {/* Fallback Route */}

                    <Route path="/two-factor-auth" element={<TwoFactorAuthPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>


                  <Footer />
                </div>
              </>
            </ThemeProvider>
          </LoadingBarContainer>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider >
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
