"use client"

import { useState } from "react"
import {
    BookOpen,
    Search,
    Plus,
    Edit,
    Key,
    ShoppingCart,
    ChevronDown,
    ChevronRight,
    Home,
    HelpCircle,
    LayoutGrid,
    List,
} from "lucide-react"

function Help() {
    const [openSection, setOpenSection] = useState("navigation")

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    return (
        <div className="mt-8 text-[#EDEDED]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Help Center</h1>
                <p className="text-[#DDD9FE]">
                    Welcome to the admin dashboard help page. Here you'll find information about how to navigate and use the admin
                    features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="col-span-1">
                    <div className="bg-[#1D2127] border-[#2D3237] rounded-lg p-4 sticky top-4">
                        <h2 className="font-semibold mb-4 flex items-center">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Help Topics
                        </h2>
                        <nav className="space-y-2">
                            <button
                                onClick={() => toggleSection("navigation")}
                                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${openSection === "navigation" ? "bg-[#2D3237] text-[#DDD9FE]" : "hover:bg-[#2D3237]/50"}`}
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard Navigation
                            </button>
                            <button
                                onClick={() => toggleSection("addgame")}
                                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${openSection === "addgame" ? "bg-[#2D3237] text-[#DDD9FE]" : "hover:bg-[#2D3237]/50"}`}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adding Games
                            </button>
                            <button
                                onClick={() => toggleSection("viewgames")}
                                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${openSection === "viewgames" ? "bg-[#2D3237] text-[#DDD9FE]" : "hover:bg-[#2D3237]/50"}`}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Managing Games
                            </button>
                            <button
                                onClick={() => toggleSection("keys")}
                                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${openSection === "keys" ? "bg-[#2D3237] text-[#DDD9FE]" : "hover:bg-[#2D3237]/50"}`}
                            >
                                <Key className="mr-2 h-4 w-4" />
                                Managing Game Keys
                            </button>
                            <button
                                onClick={() => toggleSection("purchases")}
                                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${openSection === "purchases" ? "bg-[#2D3237] text-[#DDD9FE]" : "hover:bg-[#2D3237]/50"}`}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Viewing Purchases
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-3">
                    {/* Navigation Section */}
                    {openSection === "navigation" && (
                        <div className="bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <Home className="mr-2 h-6 w-6" />
                                Dashboard Navigation
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Overview</h3>
                                    <p className="mb-4 text-[#DDD9FE]">
                                        The admin dashboard provides a comprehensive interface to manage your game store. The main
                                        navigation menu gives you access to all administrative functions.
                                    </p>

                                    <div className="bg-[#2D3237]/50 p-4 rounded-lg mb-4">
                                        <h4 className="font-semibold mb-2">Main Navigation Areas:</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-[#DDD9FE]">
                                            <li>
                                                <strong>Dashboard</strong> - Overview of store statistics and recent activity
                                            </li>
                                            <li>
                                                <strong>Add Games</strong> - Search for and add new games to your store
                                            </li>
                                            <li>
                                                <strong>View Games</strong> - Browse, search, and edit games in your store
                                            </li>
                                            <li>
                                                <strong>Game Keys</strong> - Manage game activation keys
                                            </li>
                                            <li>
                                                <strong>Purchases</strong> - View and filter customer purchase history
                                            </li>
                                            <li>
                                                <strong>Settings</strong> - Configure store settings and preferences
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Quick Tips</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Navigation Shortcuts</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Use the sidebar for quick access to all major sections of the admin dashboard.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Search Functionality</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Most pages include search functionality to help you quickly find specific items.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Game Section */}
                    {openSection === "addgame" && (
                        <div className="bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <Plus className="mr-2 h-6 w-6" />
                                Adding Games
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">How to Add Games</h3>
                                    <p className="mb-4 text-[#DDD9FE]">
                                        The Add Games section allows you to search for games from a database and add them to your store.
                                    </p>

                                    <div className="bg-[#2D3237]/50 p-4 rounded-lg mb-6">
                                        <h4 className="font-semibold mb-2">Step-by-Step Guide:</h4>
                                        <ol className="list-decimal pl-5 space-y-4 text-[#DDD9FE]">
                                            <li>
                                                <strong>Search for a Game</strong>
                                                <p className="mt-1">
                                                    Enter the game title in the search bar and press Enter or click the search icon.
                                                </p>
                                                <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                    <div className="flex items-center">
                                                        <Search className="h-4 w-4 mr-2 text-gray-500" />
                                                        <div className="text-sm text-gray-400">Search for games...</div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>Browse Search Results</strong>
                                                <p className="mt-1">
                                                    The search results will display games matching your query, sorted by rating.
                                                </p>
                                                <div className="mt-2 grid grid-cols-2 gap-2">
                                                    <div className="border border-[#3D4247] rounded-lg p-2 bg-[#1D2127]/70">
                                                        <div className="bg-gray-800 h-24 rounded mb-2"></div>
                                                        <div className="text-sm font-medium">Game Title</div>
                                                        <button className="mt-2 w-full text-xs bg-[#668389]/80 hover:bg-[#668389] text-white py-1 px-2 rounded flex items-center justify-center">
                                                            <Plus className="h-3 w-3 mr-1" /> Add to Store
                                                        </button>
                                                    </div>
                                                    <div className="border border-[#3D4247] rounded-lg p-2 bg-[#1D2127]/70">
                                                        <div className="bg-gray-800 h-24 rounded mb-2"></div>
                                                        <div className="text-sm font-medium">Game Title</div>
                                                        <button className="mt-2 w-full text-xs bg-[#668389]/80 hover:bg-[#668389] text-white py-1 px-2 rounded flex items-center justify-center">
                                                            <Plus className="h-3 w-3 mr-1" /> Add to Store
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>Add Game to Store</strong>
                                                <p className="mt-1">
                                                    Click the "Add to Store" button on the game you want to add. This will open a modal with game
                                                    details.
                                                </p>
                                            </li>

                                            <li>
                                                <strong>Configure Game Details</strong>
                                                <p className="mt-1">
                                                    In the modal, you can set the price, number of copies, and other details before adding the
                                                    game to your store.
                                                </p>
                                                <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                    <div className="text-sm font-medium mb-2">Game Details</div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                            <div className="w-20 text-xs text-gray-400">Price:</div>
                                                            <div className="text-xs">$29.99</div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-20 text-xs text-gray-400">Copies:</div>
                                                            <div className="text-xs">10</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>Save Game</strong>
                                                <p className="mt-1">
                                                    Click "Save" to add the game to your store. The game will now appear in the "View Games"
                                                    section.
                                                </p>
                                            </li>
                                        </ol>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Tips for Adding Games</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Accurate Pricing</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Set competitive prices based on market research and game popularity.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Inventory Management</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Set the correct number of copies available to avoid overselling.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Games Section */}
                    {openSection === "viewgames" && (
                        <div className="bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <Edit className="mr-2 h-6 w-6" />
                                Managing Games
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Viewing and Editing Games</h3>
                                    <p className="mb-4 text-[#DDD9FE]">
                                        The View Games section allows you to manage games that are already in your store.
                                    </p>

                                    <div className="bg-[#2D3237]/50 p-4 rounded-lg mb-6">
                                        <h4 className="font-semibold mb-2">Features:</h4>
                                        <ul className="list-disc pl-5 space-y-3 text-[#DDD9FE]">
                                            <li>
                                                <strong>Search Store Games</strong>
                                                <p className="mt-1">Use the search bar to quickly find games in your store inventory.</p>
                                                <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                    <div className="flex items-center">
                                                        <Search className="h-4 w-4 mr-2 text-gray-500" />
                                                        <div className="text-sm text-gray-400">Search store games...</div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>View Modes</strong>
                                                <p className="mt-1">Toggle between grid view and list view using the view mode buttons.</p>
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <button className="p-2 rounded-lg bg-[#1D2127] border border-[#3D4247]">
                                                        <LayoutGrid className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-[#1D2127] border border-[#3D4247]">
                                                        <List className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>Edit Game Details</strong>
                                                <p className="mt-1">Click the "Edit Details" button on any game to modify its information.</p>
                                                <div className="mt-2 grid grid-cols-2 gap-2">
                                                    <div className="border border-[#3D4247] rounded-lg p-2 bg-[#1D2127]/70">
                                                        <div className="bg-gray-800 h-24 rounded mb-2"></div>
                                                        <div className="text-sm font-medium">Game Title</div>
                                                        <div className="text-xs text-gray-400 mb-2">Price: $29.99</div>
                                                        <button className="w-full text-xs bg-[#668389]/80 hover:bg-[#668389] text-white py-1 px-2 rounded flex items-center justify-center">
                                                            <Edit className="h-3 w-3 mr-1" /> Edit Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>Update Game Information</strong>
                                                <p className="mt-1">
                                                    In the edit modal, you can update the price, available copies, description, and other details.
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Managing Game Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Regular Updates</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Keep game information up-to-date, especially prices and availability.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Bulk Actions</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Use list view for quick edits across multiple games when needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Keys Section */}
                    {openSection === "keys" && (
                        <div className="bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <Key className="mr-2 h-6 w-6" />
                                Managing Game Keys
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Game Keys Management</h3>
                                    <p className="mb-4 text-[#DDD9FE]">
                                        Game keys are unique activation codes that customers receive after purchase. Keys are managed
                                        directly through the game edit modals.
                                    </p>

                                    <div className="bg-[#2D3237]/50 p-4 rounded-lg mb-6">
                                        <h4 className="font-semibold mb-2">Key Management Methods:</h4>
                                        <p className="mb-4 text-[#DDD9FE]">
                                            There are two ways to manage game keys, depending on whether you're adding a new game or editing
                                            an existing one:
                                        </p>

                                        <div className="space-y-6">
                                            <div>
                                                <h5 className="font-semibold text-[#DDD9FE] mb-2">Method 1: Using the Game Edit Modal</h5>
                                                <p className="mb-2 text-[#DDD9FE]">
                                                    When editing an existing game from the View Games section, you can manage keys through the
                                                    "Game Keys" tab.
                                                </p>
                                                <ol className="list-decimal pl-5 space-y-4 text-[#DDD9FE]">
                                                    <li>
                                                        <strong>Access the Game Keys Tab</strong>
                                                        <p className="mt-1">
                                                            From the View Games section, click "Edit Details" on any game to open the edit modal, then
                                                            select the "Game Keys" tab.
                                                        </p>
                                                        <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                            <div className="flex space-x-2 mb-2">
                                                                <div className="px-3 py-1 bg-[#2D3237] rounded-md">Details</div>
                                                                <div className="px-3 py-1 bg-[#668389] rounded-md">Game Keys</div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <strong>View Existing Keys</strong>
                                                        <p className="mt-1">The current game keys are displayed in a scrollable list.</p>
                                                        <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                            <div className="text-sm font-medium mb-2">Game Keys (5)</div>
                                                            <div className="max-h-[100px] overflow-y-auto bg-[#2D3237] p-2 rounded-md">
                                                                <ul className="space-y-1">
                                                                    <li className="text-sm font-mono bg-[#3D4247] p-1 rounded">XXXX-XXXX-XXXX-XXXX</li>
                                                                    <li className="text-sm font-mono bg-[#3D4247] p-1 rounded">XXXX-XXXX-XXXX-XXXX</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <strong>Add Individual Keys</strong>
                                                        <p className="mt-1">
                                                            You can add keys one by one using the input field and "Add Key" button.
                                                        </p>
                                                        <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                            <div className="flex space-x-2">
                                                                <div className="flex-grow bg-[#2D3237] rounded-md p-2 text-sm">Add new game key</div>
                                                                <div className="px-3 py-2 bg-[#668389] rounded-md text-sm">Add Key</div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <strong>Bulk Upload Keys</strong>
                                                        <p className="mt-1">You can upload multiple keys at once using a CSV file.</p>
                                                        <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                            <div className="text-sm bg-[#2D3237] border border-[#3D4247] rounded p-2">
                                                                <span className="bg-[#575757] px-4 py-2 rounded-l">Choose File</span>
                                                                <span className="px-2">No file chosen</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <strong>Download Keys</strong>
                                                        <p className="mt-1">
                                                            You can download all keys for a game as a CSV file for backup or reference.
                                                        </p>
                                                        <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                            <div className="px-3 py-2 bg-[#668389] rounded-md text-sm inline-flex items-center">
                                                                <svg
                                                                    className="w-4 h-4 mr-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                    />
                                                                </svg>
                                                                Download Keys (.csv)
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ol>
                                            </div>

                                            <div>
                                                <h5 className="font-semibold text-[#DDD9FE] mb-2">Method 2: Using the Add Game Modal</h5>
                                                <p className="mb-2 text-[#DDD9FE]">
                                                    When adding a new game to the store, you can upload keys through the add game modal.
                                                </p>
                                                <ol className="list-decimal pl-5 space-y-4 text-[#DDD9FE]">
                                                    <li>
                                                        <strong>Set Game Price</strong>
                                                        <p className="mt-1">Enter the price for the game.</p>
                                                    </li>

                                                    <li>
                                                        <strong>Upload Keys via CSV</strong>
                                                        <p className="mt-1">Upload a CSV file containing the game keys.</p>
                                                        <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                            <div className="text-sm bg-[#2D3237] border border-[#3D4247] rounded p-2">
                                                                <span className="bg-[#575757] px-4 py-2 rounded-l">Choose File</span>
                                                                <span className="px-2">No file chosen</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <strong>Add to Store</strong>
                                                        <p className="mt-1">Click the "Add" button to add the game with its keys to your store.</p>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Key Management Best Practices</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">CSV Format</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Prepare your CSV files with one key per line. The system will automatically extract the first
                                                column if your CSV has multiple columns.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Key Backup</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Regularly download your game keys as CSV files for backup. This ensures you have a copy of all
                                                keys in case of system issues.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Inventory Management</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                The system automatically updates the number of copies based on the number of keys. Make sure to
                                                add enough keys to meet demand.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Key Security</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Keep your key CSV files secure and delete them after uploading to prevent unauthorized access to
                                                game keys.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Purchases Section */}
                    {openSection === "purchases" && (
                        <div className="bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <ShoppingCart className="mr-2 h-6 w-6" />
                                Viewing Purchases
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Purchase History</h3>
                                    <p className="mb-4 text-[#DDD9FE]">
                                        The Purchases section allows you to view and filter customer purchase history.
                                    </p>

                                    <div className="bg-[#2D3237]/50 p-4 rounded-lg mb-6">
                                        <h4 className="font-semibold mb-2">Using the Purchase History:</h4>
                                        <ul className="list-disc pl-5 space-y-3 text-[#DDD9FE]">
                                            <li>
                                                <strong>View Recent Purchases</strong>
                                                <p className="mt-1">The purchase history table shows recent transactions by default.</p>
                                                <div className="mt-2 border border-[#3D4247] rounded-lg p-3 bg-[#1D2127]/70">
                                                    <table className="w-full text-sm">
                                                        <thead className="text-left border-b border-[#3D4247]">
                                                            <tr>
                                                                <th className="pb-2">Game</th>
                                                                <th className="pb-2">Customer</th>
                                                                <th className="pb-2">Date</th>
                                                                <th className="pb-2">Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="py-2">Game Title 1</td>
                                                                <td className="py-2">user@example.com</td>
                                                                <td className="py-2">01/15/2023</td>
                                                                <td className="py-2">$29.99</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2">Game Title 2</td>
                                                                <td className="py-2">another@example.com</td>
                                                                <td className="py-2">01/14/2023</td>
                                                                <td className="py-2">$19.99</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>Filter Purchases</strong>
                                                <p className="mt-1">
                                                    Use the filter options to search for specific purchases by user email or date.
                                                </p>
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        className="bg-[#1D2127] border border-[#3D4247] rounded-full px-4 py-1 text-sm"
                                                        placeholder="User"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="bg-[#1D2127] border border-[#3D4247] rounded-full px-4 py-1 text-sm"
                                                        placeholder="Date (MM/DD/YY)"
                                                    />
                                                    <button className="p-1 rounded-full bg-[#668389]">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </li>

                                            <li>
                                                <strong>View Purchase Details</strong>
                                                <p className="mt-1">
                                                    Each purchase entry shows the game, customer email, purchase date, and price.
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Purchase Management Tips</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Regular Monitoring</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Check purchase history regularly to track sales trends and popular games.
                                            </p>
                                        </div>
                                        <div className="bg-[#2D3237]/30 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <HelpCircle className="h-5 w-5 mr-2 text-[#668389]" />
                                                <h4 className="font-semibold">Customer Support</h4>
                                            </div>
                                            <p className="text-sm text-[#DDD9FE]">
                                                Use purchase history to assist with customer inquiries and resolve issues quickly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <div className="border-b border-[#2D3237] pb-4">
                        <button
                            className="flex justify-between items-center w-full text-left font-medium"
                            onClick={() => toggleSection("faq1")}
                        >
                            <span>How do I update game information after adding it to the store?</span>
                            {openSection === "faq1" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>

                        {openSection === "faq1" && (
                            <div className="mt-2 pl-4 text-[#DDD9FE]">
                                <p>
                                    Go to the "View Games" section, find the game you want to update, and click the "Edit Details" button.
                                    This will open a modal where you can modify the game's information, including price, description, and
                                    available copies.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-[#2D3237] pb-4">
                        <button
                            className="flex justify-between items-center w-full text-left font-medium"
                            onClick={() => toggleSection("faq2")}
                        >
                            <span>How do I add keys to a game?</span>
                            {openSection === "faq2" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>

                        {openSection === "faq2" && (
                            <div className="mt-2 pl-4 text-[#DDD9FE]">
                                <p>
                                    Go to the "View Games" section, find the game you want to add keys to, and click the "Edit Details"
                                    button. In the modal that opens, select the "Game Keys" tab. From there, you can add individual keys
                                    using the input field or upload multiple keys at once using a CSV file. The system will automatically
                                    update the number of available copies based on the number of keys.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-[#2D3237] pb-4">
                        <button
                            className="flex justify-between items-center w-full text-left font-medium"
                            onClick={() => toggleSection("faq3")}
                        >
                            <span>How can I see which customers purchased a specific game?</span>
                            {openSection === "faq3" ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>

                        {openSection === "faq3" && (
                            <div className="mt-2 pl-4 text-[#DDD9FE]">
                                <p>
                                    In the "Purchases" section, you can use the search functionality to filter purchases by game title.
                                    This will show you all customers who have purchased that specific game, along with the purchase date
                                    and price.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Support Contact */}
            <div className="mt-8 bg-[#1D2127] border-[#2D3237] rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
                <p className="text-[#DDD9FE] mb-4">
                    If you need additional assistance with the admin dashboard, please contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-4 py-2 bg-[#668389] text-white rounded-md hover:bg-[#668389]/80 flex items-center justify-center">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        Contact Support
                    </button>
                    <button className="px-4 py-2 bg-transparent border border-[#668389] text-[#668389] rounded-md hover:bg-[#668389]/10 flex items-center justify-center">
                        <BookOpen className="mr-2 h-5 w-5" />
                        View Documentation
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Help

