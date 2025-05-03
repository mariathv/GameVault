import { useEffect, useState } from "react";
// Using the existing import structure from the original file
import { getAllOrders } from "../api/order";
import {
  ArrowRight,
  Search,
  Calendar,
  Filter,
  ShoppingBag,
  User,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

function Purchases() {
  const [purchases, setPurchases] = useState(null);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedPurchase, setExpandedPurchase] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchData = async (email = "", date = "") => {
    setLoading(true);

    let formattedDate = null;

    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed)) {
        formattedDate = parsed.toISOString().split("T")[0]; // "2025-05-02"
      }
    }

    console.log("Formatted date for API:", formattedDate);

    const fetched = await getAllOrders(email, formattedDate);
    console.log("fetched", fetched);

    setPurchases(fetched.orders);
    console.log("orders", fetched.orders);
    // Calculate summary data
    if (fetched.orders) {
      setTotalPurchases(fetched.orders.length);
      setTotalRevenue(
        fetched.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      );
    }

    setLoading(false);
  };

  const filteredSearch = () => {
    setLoading(true);
    fetchData(email, date);
    setLoading(false);
    setFilterOpen(false); // Close filter panel after search on mobile
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePurchaseDetails = (id) => {
    if (expandedPurchase === id) {
      setExpandedPurchase(null);
    } else {
      setExpandedPurchase(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Filter purchases based on status
  const filteredPurchases = statusFilter
    ? purchases?.filter((purchase) => purchase.status === statusFilter)
    : purchases;

  return (
    <div className="min-h-screen bg-gradient-to-b from-(--color-background-secondary) to-(--color-background-secondary)/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-(--color-foreground) mb-2">
            Purchase Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and manage customer game purchases
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-(--color-background) rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
                <h3 className="text-xl sm:text-2xl font-bold text-(--color-foreground)/80">
                  {totalPurchases}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-(--color-background) rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Total Revenue
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-(--color-foreground)/80">
                  ${totalRevenue.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-(--color-background) rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Games Sold</p>
                <h3 className="text-xl sm:text-2xl font-bold text-(--color-foreground)/80">
                  {purchases?.reduce(
                    (total, purchase) => total + purchase.games.length,
                    0
                  ) || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilter}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-(--color-background) text-(--color-foreground)/80 rounded-lg border border-gray-200 shadow-sm"
          >
            {filterOpen ? (
              <>
                <X className="h-5 w-5" />
                <span>Close Filters</span>
              </>
            ) : (
              <>
                <Filter className="h-5 w-5" />
                <span>Show Filters</span>
              </>
            )}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div
          className={`bg-(--color-background-secondary) rounded-xl mb-6 ${
            filterOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-lg font-semibold text-(--color-foreground) mb-2 md:mb-0 md:mr-4">
                Filters
              </h2>

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-foreground)/40 h-4 w-4 sm:h-5 sm:w-5 pointer-events-none" />
                  <Input
                    type="text"
                    className="pl-10 pr-4 py-2 bg-transparent border border-gray-600 rounded-lg text-(--color-foreground) focus-visible:ring-0 focus:border-indigo-500 transition-colors w-full"
                    placeholder="Search by user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative w-full md:w-64">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-foreground)/40 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    type="date"
                    className="pl-10 pr-4 py-2 bg-transparent border border-gray-600 rounded-lg text-(--color-foreground) focus-visible:ring-0 focus:border-indigo-500 transition-colors w-full appearance-none"
                    placeholder="mm / dd / yyyy"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto"
                  onClick={filteredSearch}
                >
                  <span>Search</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-(--color-background) rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-(--color-foreground)">
              Purchase Records
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 border-b-indigo-200 border-l-indigo-200 animate-spin"></div>
            </div>
          ) : (
            <>
              {filteredPurchases && filteredPurchases.length > 0 ? (
                <div className="divide-y text-(--color-foreground)/5">
                  {filteredPurchases.map((purchase) => (
                    <div
                      key={purchase._id}
                      className="bg-(--color-background) hover:bg-(--color-background-t)/50 transition-colors"
                    >
                      {/* Purchase Summary Row */}
                      <div
                        className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col cursor-pointer"
                        onClick={() => togglePurchaseDetails(purchase._id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                            </div>
                            <div className="truncate max-w-xs">
                              <h3 className="font-medium text-sm sm:text-base text-(--color-foreground)/75 truncate">
                                {purchase.user.email}
                              </h3>
                            </div>
                          </div>

                          <div>
                            {expandedPurchase === purchase._id ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">
                              {formatDate(purchase.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                purchase.status
                              )}`}
                            >
                              {purchase.status}
                            </span>

                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-sm font-semibold text-(--color-foreground)/40">
                                ${purchase.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedPurchase === purchase._id && (
                        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-(--color-background-secondary) border-t border-gray-200">
                          {/* Payment Info */}
                          <div className="mb-4 sm:mb-6">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                              Payment Information
                            </h4>
                            <div className="bg-(--color-background) rounded-lg p-3 sm:p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Payment Method
                                  </p>
                                  <p className="text-sm font-medium text-(--color-foreground)/80">
                                    {purchase.paymentInfo?.method ||
                                      "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Transaction ID
                                  </p>
                                  <p className="text-sm font-medium text-(--color-foreground)/80 break-all">
                                    {purchase.paymentInfo?.transactionId ||
                                      "Not available"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Games List */}
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                            Purchased Games
                          </h4>

                          {/* Mobile Game Cards */}
                          <div className="md:hidden space-y-3">
                            {purchase.games.map((game, index) => (
                              <div
                                key={`${purchase.id}-mobile-game-${index}`}
                                className="bg-(--color-background) rounded-lg p-3"
                              >
                                <div className="flex gap-3 mb-2">
                                  {game.cover_url && (
                                    <img
                                      src={game.cover_url}
                                      alt={game.title}
                                      className="h-12 w-12 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium text-sm text-(--color-foreground)/80">
                                      {game.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Released:{" "}
                                      {game.releaseDate
                                        ? new Date(
                                            game.releaseDate
                                          ).getFullYear()
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">
                                      Price:
                                    </span>{" "}
                                    ${game.price?.toFixed(2) || "N/A"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Quantity:
                                    </span>{" "}
                                    {game.quantity || 1}
                                  </div>
                                </div>

                                {game.gameKeys && game.gameKeys.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Game Keys:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {game.gameKeys.map((key, keyIndex) => (
                                        <code
                                          key={keyIndex}
                                          className="bg-(--color-background-secondary) px-2 py-1 rounded text-xs break-all"
                                        >
                                          {key}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Desktop Table */}
                          <div className="hidden md:block bg-(--color-background) rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-(--color-background/80)">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Game
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Keys
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {purchase.games.map((game, index) => (
                                  <tr key={`${purchase.id}-game-${index}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        {game.cover_url && (
                                          <img
                                            src={game.cover_url}
                                            alt={game.title}
                                            className="h-10 w-10 rounded object-cover mr-3"
                                          />
                                        )}
                                        <div>
                                          <p className="font-medium text-(--color-foreground)/80">
                                            {game.title}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Released:{" "}
                                            {game.releaseDate
                                              ? new Date(
                                                  game.releaseDate
                                                ).getFullYear()
                                              : "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      ${game.price?.toFixed(2) || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {game.quantity || 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {game.gameKeys &&
                                      game.gameKeys.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                          {game.gameKeys.map(
                                            (key, keyIndex) => (
                                              <div
                                                key={keyIndex}
                                                className="flex items-center"
                                              >
                                                <code className="bg-(--color-background-secondary) px-2 py-1 rounded text-xs">
                                                  {key}
                                                </code>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">
                                          No keys available
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                    <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  </div>
                  <p className="text-lg sm:text-xl font-medium text-gray-700">
                    No purchases found
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchases;
