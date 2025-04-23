"use client"

import { useState, useEffect } from "react"
import { fetchData } from "../hooks/api/api-gamevault"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useNavigate } from "react-router-dom"
import { Edit, LayoutGrid, List, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { GameModal } from "./EditGameModal"

function ViewGames() {
    const [viewMode, setViewMode] = useState("compact")
    const [inStoreGames, setInStoreGames] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState(null)
    const [search, setSearch] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [loading, setLoading] = useState(true)

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [gamesPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [totalGamesCount, setTotalGamesCount] = useState(0)

    // Remove debounce-related states since we want search on Enter only
    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate()

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const searchGames = async () => {
        if (!search || search.trim() === "") {
            fetchGames()
            return
        }

        setIsSearching(true)
        try {
            const searchQuery = encodeURIComponent(search.trim())
            const instoreGames = await fetchData(`store/games/search?q=${searchQuery}`)

            if (instoreGames.success === "true") {
                console.log("no search results found")
                setInStoreGames([])
            } else {
                setInStoreGames(instoreGames.games)
                console.log("Search results:", instoreGames)
            }
        } catch (error) {
            console.error("Error searching games:", error)
        } finally {
            setIsSearching(false)
        }
    }

    const fetchGames = async () => {
        setLoading(true)
        setIsSearching(true)
        try {
            // Build query parameters for pagination
            const queryParams = new URLSearchParams()
            queryParams.append("limit", gamesPerPage.toString())
            queryParams.append("page", currentPage.toString())

            // Add search parameter if it exists
            if (searchQuery) {
                searchGames()
                return
            }

            const queryString = queryParams.toString()
            // Fix the endpoint construction - there was a bug here
            const endpoint = `store/games/get-all${queryString ? "?" + queryString : ""}`

            const response = await fetchData(endpoint)

            if (response && response.success === "true" && !response.games) {
                console.log("no data fetched")
                setInStoreGames([])
                setTotalGamesCount(0)
                setTotalPages(1)
            } else if (response && response.games) {
                setInStoreGames(response.games)
                setTotalGamesCount(response.total || response.games.length)
                setTotalPages(Math.ceil((response.total || response.games.length) / gamesPerPage) || 1)
                console.log("Fetched games:", response)
            } else {
                console.error("Unexpected response format:", response)
                setInStoreGames([])
                setTotalGamesCount(0)
                setTotalPages(1)
            }
        } catch (error) {
            console.error("Error fetching games:", error)
            setInStoreGames([])
        } finally {
            setIsSearching(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGames()
    }, [currentPage, searchQuery])

    const toggleViewMode = () => {
        setViewMode(viewMode === "compact" ? "list" : "compact")
    }

    const openModal = (game) => {
        setSelectedGame(game)
        setIsModalOpen(true)
    }

    const closeModal = (isChange) => {
        if (isChange) {
            console.log("is change ", isChange, "refreshing")
            fetchGames()
        }
        setIsModalOpen(false)
        setSelectedGame(null)
    }

    const handleSearchInputChange = (e) => {
        setSearch(e.target.value)
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            // Only trigger search on Enter key
            setSearchQuery(search)
        }
    }

    const handleSearchClick = () => {
        setSearchQuery(search)
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
            window.scrollTo(0, 0)
        }
    }

    // Get pagination numbers with ellipsis
    const getPaginationNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // If we have less than maxVisiblePages, just show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push({ number: i, isEllipsis: false })
            }
        } else {
            pageNumbers.push({ number: 1, isEllipsis: false })

            if (currentPage <= 3) {
                pageNumbers.push({ number: 2, isEllipsis: false })
                pageNumbers.push({ number: 3, isEllipsis: false })
                pageNumbers.push({ number: 4, isEllipsis: false })
                pageNumbers.push({ number: null, isEllipsis: true })
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push({ number: null, isEllipsis: true })
                pageNumbers.push({ number: totalPages - 3, isEllipsis: false })
                pageNumbers.push({ number: totalPages - 2, isEllipsis: false })
                pageNumbers.push({ number: totalPages - 1, isEllipsis: false })
            } else {
                pageNumbers.push({ number: null, isEllipsis: true })
                pageNumbers.push({ number: currentPage - 1, isEllipsis: false })
                pageNumbers.push({ number: currentPage, isEllipsis: false })
                pageNumbers.push({ number: currentPage + 1, isEllipsis: false })
                pageNumbers.push({ number: null, isEllipsis: true })
            }

            pageNumbers.push({ number: totalPages, isEllipsis: false })
        }

        return pageNumbers
    }

    return (
        <div className="mt-4 sm:mt-6 md:mt-8 px-3 sm:px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
                <div className="relative flex-1 w-full">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-500" />
                        </span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-16 py-2 border-2 border-(--color-light-ed)/50 rounded-full text-[#DDD9FE] focus:outline-none hover:border-(--color-light-ed) bg-transparent"
                            placeholder="Search store games..."
                            value={search}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <button
                            onClick={handleSearchClick}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-white rounded-r-full"
                            disabled={isSearching}
                        >
                            {isSearching ? "..." : "Search"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <div className="pl-2 pr-2 border-2 rounded-2xl border-[#5A5D5F] flex items-center">
                        <button
                            onClick={() => setViewMode("compact")}
                            className={`p-2 rounded-2xl ${viewMode === "compact" ? "text-[#668389]" : "text-gray-50"}`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-2xl ${viewMode === "list" ? "text-[#668389]" : "text-gray-50"}`}
                            aria-label="List view"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search results count display */}
            {searchQuery && (
                <div className="mb-4 text-(--color-foreground)/70 text-sm">
                    Found {inStoreGames?.length || 0} results for "{searchQuery}"
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px] w-full">
                    <div className="loader border-t-4 border-white"></div>
                </div>
            ) : (
                <div className="list-view">
                    {inStoreGames === null ? (
                        <div className="flex justify-center items-center min-h-[200px] w-full">
                            <div className="loader"></div>
                        </div>
                    ) : inStoreGames.length === 0 ? (
                        <div className="text-center py-10 text-[#EDEDED]">No games found</div>
                    ) : viewMode === "list" ? (
                        <div className="bg-(--color-background) shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200/50">
                                {inStoreGames.map((item) => (
                                    <li key={item.id} className="hover:bg-[#2D3237]/30 transition-colors">
                                        <div className="px-3 py-3 sm:px-4 sm:py-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                                <div className="flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20">
                                                    <img
                                                        className="h-full w-full rounded-lg object-cover"
                                                        src={item.cover_url || "/placeholder.svg"}
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base sm:text-lg font-medium text-(--color-foreground) truncate">
                                                                {item.name}
                                                            </p>
                                                            <div className="flex pt-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-white text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => openModal(item)}
                                                                >
                                                                    <Edit className="mr-1 h-3 w-3" /> Edit
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                                            <div className="flex-shrink-0">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    In Stock: {item.copies}
                                                                </p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                    Price: ${item.price}
                                                                </p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                    Discount: {item.discountPercentage ? `${item.discountPercentage}%` : "None"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {inStoreGames.map((game) => (
                                <Card key={game.id} className="bg-[#1D2127] border-[#2D3237] text-white overflow-hidden">
                                    <div className="p-2">
                                        <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md">
                                            <img
                                                src={game.cover_url || "/placeholder.svg"}
                                                alt={game.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </AspectRatio>
                                    </div>
                                    <CardContent className="p-3 sm:p-4">
                                        <h3 className="font-semibold mb-1 sm:mb-2 line-clamp-1 text-sm sm:text-base">{game.name}</h3>
                                        <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">Price: ${game.price}</div>
                                        <Button
                                            className="w-full bg-(--color-accent)/100 hover:bg-(--color-accent)/50 text-xs sm:text-sm py-1 h-auto sm:h-8"
                                            onClick={() => openModal(game)}
                                        >
                                            <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden xs:inline">Edit</span>
                                            <span className="xs:hidden">Edit</span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Updated Pagination Controls */}
                    {!searchQuery && inStoreGames && inStoreGames.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2 items-center">
                            {/* Previous page button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${currentPage === 1
                                        ? "bg-[#1A1F2E]/50 text-gray-500 cursor-not-allowed"
                                        : "bg-[#1A1F2E] text-gray-400 hover:bg-[#2563EB]/50"
                                    }`}
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>

                            {/* Page numbers with ellipsis - responsive version */}
                            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                                {getPaginationNumbers().map((page, index) =>
                                    page.isEllipsis ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="text-gray-400 w-7 sm:w-8 flex justify-center items-center"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={`page-${page.number}`}
                                            onClick={() => handlePageChange(page.number)}
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${page.number === currentPage
                                                    ? "bg-[#2563EB] text-white"
                                                    : "bg-[#1A1F2E] text-gray-400 hover:bg-[#2563EB]/50"
                                                }`}
                                        >
                                            {page.number}
                                        </button>
                                    ),
                                )}
                            </div>

                            {/* Mobile pagination indicator */}
                            <div className="sm:hidden text-gray-400 text-sm">
                                {currentPage} / {totalPages}
                            </div>

                            {/* Next page button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${currentPage === totalPages
                                        ? "bg-[#1A1F2E]/50 text-gray-500 cursor-not-allowed"
                                        : "bg-[#1A1F2E] text-gray-400 hover:bg-[#2563EB]/50"
                                    }`}
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                    )}

                    {/* Results count and page indicator */}
                    {!searchQuery && inStoreGames && inStoreGames.length > 0 && totalPages > 1 && (
                        <div className="text-center mt-3 sm:mt-4 text-(--color-foreground)/60 text-xs sm:text-sm">
                            Showing page {currentPage} of {totalPages}
                            {totalGamesCount > 0 && <span> ({totalGamesCount} total results)</span>}
                        </div>
                    )}
                </div>
            )}

            {selectedGame && isModalOpen && (
                <GameModal isOpen={isModalOpen} onClose={closeModal} game={selectedGame} inStore={true} />
            )}
        </div>
    )
}

export default ViewGames
