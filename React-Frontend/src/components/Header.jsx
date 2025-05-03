"use client";

import { useState, useEffect, useRef } from "react";
import {
  LogOut,
  Search,
  ShoppingCart,
  User,
  Heart,
  LogInIcon,
  ChevronDown,
  Menu,
  X,
  HelpCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../contexts/cart-context";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "../contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, ClipboardList, Key, ThumbsUp } from "lucide-react";
import { themes } from "@/lib/game-themes";
import { genres } from "@/lib/game-genres";
import { useCurrency } from "../contexts/currency-context";

const gameGenres = [
  [
    "Shooter",
    "RPG",
    "Simulator",
    "Sport",
    "Strategy",
    "Turn-based strategy",
    "Tactical",
    "MOBA",
  ],
  [
    "Quiz-Trivia",
    "Pinball",
    "Adventure",
    "Indie",
    "Arcade",
    "Visual Novel",
    "Card & Board Game",
  ],
  [
    "Point-and-click",
    "Fighting",
    "Music",
    "Platform",
    "Puzzle",
    "Racing",
    "RTS",
  ],
];

const gameThemes = [
  [
    "Action",
    "Fantasy",
    "Science fiction",
    "Horror",
    "Thriller",
    "Survival",
    "Historical",
  ],
  [
    "Stealth",
    "Comedy",
    "Business",
    "Drama",
    "Non-fiction",
    "Sandbox",
    "Educational",
  ],
  ["Kids", "Open-World", "Warfare", "Party", "4X", "Mystery"],
];

export default function Header() {
  const { cart } = useCart();
  const { currency, setCurrency, availableCurrencies, convertPrice } =
    useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  console.log(user);

  const [showGenres, setShowGenres] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGenresOpen, setMobileGenresOpen] = useState(false);
  const [mobileThemesOpen, setMobileThemesOpen] = useState(false);
  const dropdownRef = useRef(null);
  let dropdownTimer;

  const handleMouseOver = (type) => {
    clearTimeout(dropdownTimer);
    if (type === "genres") {
      setShowGenres(true);
      setShowThemes(false);
    }
    if (type === "themes") {
      setShowThemes(true);
      setShowGenres(false);
    }
  };

  const handleMouseOut = (type) => {
    dropdownTimer = setTimeout(() => {
      if (type === "genres") setShowGenres(false);
      if (type === "themes") setShowThemes(false);
    }, 200);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGenres(false);
        setShowThemes(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileGenresOpen(false);
    setMobileThemesOpen(false);
  }, [location.pathname]);

  const cartItemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isActive = (path) =>
    location.pathname === path
      ? "text-(--color-accent-secondary) underline underline-offset-4 decoration-2"
      : "hover:text-(--color-foreground)";

  return (
    <header className="sticky top-0 z-50 bg-(--color-background)/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-(--color-foreground) mr-4 sm:mr-10 flex-shrink-0"
          >
            <div className="flex items-center">
              <img
                src="https://i.ibb.co/JWDSdNGH/1.png"
                className="w-8 sm:w-10"
                alt="GameVault Logo"
              />
              <h1 className="text-(--color-accent-secondary)">Game</h1>Vault
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center gap-8 text-(--color-foreground)">
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
            <Link to="/explore" className={isActive("/explore")}>
              Explore
            </Link>
          </nav>

          {/* Desktop Genres & Themes */}
          <nav
            className="hidden md:flex items-center gap-8 text-(--color-foreground) pr-4"
            ref={dropdownRef}
          >
            <div className="relative">
              <button
                className="flex items-center gap-1 hover:text-(--color-foreground)"
                onMouseOver={() => handleMouseOver("genres")}
                onMouseOut={() => handleMouseOut("genres")}
              >
                Genres
                <ChevronDown className="h-4 w-4" />
              </button>
              {showGenres && (
                <div
                  className="absolute right-0 top-full mt-1 bg-(--color-background) border border-[#2D3237] rounded-md shadow-lg w-[600px] z-50 "
                  onMouseOver={() => handleMouseOver("genres")}
                  onMouseOut={() => handleMouseOut("genres")}
                  style={{ right: "-200px" }}
                >
                  <div className="p-4 grid grid-cols-3 gap-6">
                    {gameGenres.map((column, colIndex) => (
                      <div key={colIndex} className="space-y-2">
                        {column.map((genre, index) => {
                          const genreId = Object.keys(genres).find(
                            (key) => genres[key] === genre
                          );
                          const genreURL = `/explore/genres/${genreId}/${genre
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`;
                          return (
                            <Link
                              key={index}
                              to={genreURL}
                              className="block text-(--color-foreground) hover:text-[#668389] text-sm"
                            >
                              {genre}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-1 hover:text-(--color-foreground)"
                onMouseOver={() => handleMouseOver("themes")}
                onMouseOut={() => handleMouseOut("themes")}
              >
                Themes
                <ChevronDown className="h-4 w-4" />
              </button>
              {showThemes && (
                <div
                  className="absolute right-0 top-full mt-1 bg-(--color-background) border border-[#2D3237] rounded-md shadow-lg w-[600px] z-50"
                  onMouseOver={() => handleMouseOver("themes")}
                  onMouseOut={() => handleMouseOut("themes")}
                  style={{ right: "-100px" }}
                >
                  <div className="p-4 grid grid-cols-3 gap-6">
                    {gameThemes.map((column, colIndex) => (
                      <div key={colIndex} className="space-y-2">
                        {column.map((theme, index) => {
                          const themeId = Object.keys(themes).find(
                            (key) => themes[key] === theme
                          );
                          const themeUrl = `/explore/themes/${themeId}/${theme
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`;
                          return (
                            <Link
                              key={index}
                              to={themeUrl}
                              className="block text-(--color-foreground) hover:text-[#668389] text-sm"
                            >
                              {theme}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:block h-6 border-l border-(--color-foreground)/80 mx-2"></div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-(--color-foreground)"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center mr-2 px-2 py-1 bg-(--color-accent-secondary)/10 rounded text-sm">
                  <Wallet className="h-4 w-4 mr-1 text-(--color-accent-secondary)" />
                  <span className="font-bold text-(--color-foreground)">
                    {convertPrice(user?.wallet || 0)}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-(--color-foreground) h-8 px-2 rounded bg-transparent hover:bg-(--color-foreground)/10 focus:outline-none">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-(--color-foreground)/10 text-(--color-foreground)">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block truncate max-w-[100px] text-(--color-foreground)/80">
                      {user?.username}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-(--color-background) text-(--color-light-ed)/80"
                  >
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-muted-foreground text-xs truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-(--color-accent-secondary) mt-1">
                        Wallet: {convertPrice(user?.wallet ?? 0)}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-(--color-foreground)/5"
                      onClick={() => navigate("/cart")}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Cart</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-(--color-foreground)/5"
                      onClick={() => navigate("/inventory")}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      <span>Inventory</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-(--color-foreground)/5"
                      onClick={() => navigate("/wishlist")}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Wishlist</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-(--color-foreground)/5"
                      onClick={() => navigate("/support")}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      <span>Customer Support</span>
                    </DropdownMenuItem>
                    {/* 
                                    <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5">
                                        <Bell className="mr-2 h-4 w-4" />
                                        <span>Notifications</span>
                                    </DropdownMenuItem> */}

                    <ThemeToggle />

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs opacity-60" disabled>
                      Currency:{" "}
                      <span className="ml-1 font-semibold">{currency}</span>
                    </DropdownMenuItem>

                    {availableCurrencies.map((curr) => (
                      <DropdownMenuItem
                        key={curr}
                        onSelect={(e) => {
                          setCurrency(curr);
                          e.preventDefault();
                        }}
                        className={`cursor-pointer ${
                          curr === currency
                            ? "font-bold text-(--color-accent-secondary)"
                            : ""
                        }`}
                      >
                        {curr}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-(--color-foreground)/5"
                      onClick={() => navigate("/account-settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-(--color-foreground)/5 flex justify-between items-center"
                      onClick={logout}
                    >
                      <span>Sign out</span>
                      <LogOut className="h-4 w-4 ml-2" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-(--color-foreground) h-8 px-2 sm:px-5 rounded bg-transparent hover:bg-(--color-foreground)/10 focus:outline-none">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-(--color-foreground) p-0"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline ml-1">Login</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-(--color-background) text-(--color-light-ed)/80"
                >
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-(--color-foreground)/5"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Cart</span>
                  </DropdownMenuItem>

                  <ThemeToggle />

                  <DropdownMenuItem className="text-xs opacity-60" disabled>
                    Currency:{" "}
                    <span className="ml-1 font-semibold">{currency}</span>
                  </DropdownMenuItem>
                  {availableCurrencies.map((curr) => (
                    <DropdownMenuItem
                      key={curr}
                      onSelect={(e) => {
                        e.preventDefault();
                        setCurrency(curr);
                      }}
                      className={`cursor-pointer ${
                        curr === currency
                          ? "font-bold text-(--color-accent-secondary)"
                          : ""
                      }`}
                    >
                      {curr}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <Link to="/login">
                    <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5 flex justify-between items-center ">
                      <span>Login</span>
                      <LogInIcon className="h-4 w-4 ml-2" />
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              style={{ color: "var(--color-foreground)" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-(--color-foreground)/10 pt-4">
            <nav className="flex flex-col space-y-4 text-(--color-foreground)">
              <Link to="/" className={`${isActive("/")} text-lg`}>
                Home
              </Link>
              <Link to="/explore" className={`${isActive("/explore")} text-lg`}>
                Explore
              </Link>

              {/* Mobile Genres Dropdown */}
              <div className="space-y-2">
                <button
                  className="flex items-center justify-between w-full text-lg"
                  onClick={() => setMobileGenresOpen(!mobileGenresOpen)}
                >
                  <span>Genres</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileGenresOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileGenresOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    {gameGenres.flat().map((genre, index) => {
                      const genreId = Object.keys(genres).find(
                        (key) => genres[key] === genre
                      );
                      const genreURL = `/explore/genres/${genreId}/${genre
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`;
                      return (
                        <Link
                          key={index}
                          to={genreURL}
                          className="block text-(--color-foreground)/80 hover:text-(--color-foreground) text-sm py-1"
                        >
                          {genre}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Themes Dropdown */}
              <div className="space-y-2">
                <button
                  className="flex items-center justify-between w-full text-lg"
                  onClick={() => setMobileThemesOpen(!mobileThemesOpen)}
                >
                  <span>Themes</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileThemesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileThemesOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    {gameThemes.flat().map((theme, index) => {
                      const themeId = Object.keys(themes).find(
                        (key) => themes[key] === theme
                      );
                      const themeUrl = `/explore/themes/${themeId}/${theme
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`;
                      return (
                        <Link
                          key={index}
                          to={themeUrl}
                          className="block text-(--color-foreground)/80 hover:text-(--color-foreground) text-sm py-1"
                        >
                          {theme}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Additional Mobile Menu Items */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/inventory"
                    className="text-(--color-foreground)/80 hover:text-(--color-foreground) flex items-center"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    <span>Inventory</span>
                  </Link>
                  <Link
                    to="/support"
                    className="text-(--color-foreground)/80 hover:text-(--color-foreground) flex items-center"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Customer Support</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="text-(--color-foreground)/80 hover:text-(--color-foreground) flex items-center"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-(--color-foreground)/80 hover:text-(--color-foreground) flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-(--color-foreground)/80 hover:text-(--color-foreground) flex items-center"
                >
                  <LogInIcon className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}

              <div className="pt-2">
                <ThemeToggle isMobile={true} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
