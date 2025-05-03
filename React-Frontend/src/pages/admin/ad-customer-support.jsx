import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/auth-context";
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Loader2,
  Send,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchAllTickets,
  sendTicketReply,
  closeTicket,
  updateTicketStatus,
} from "@/src/api/ticket";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  processGameRefund,
  replaceGameKey,
  getOrderDetails,
} from "@/src/api/refund";
import {
  ArrowLeftRight,
  RefreshCw,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminCustomerSupport() {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [closingTicket, setClosingTicket] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [showRefundSection, setShowRefundSection] = useState(true);
  const [processingRefund, setProcessingRefund] = useState(false);
  const [processingReplace, setProcessingReplace] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  // Fetch all tickets
  const handleFetchTickets = async () => {
    if (!isAuthenticated) return;

    try {
      setRefreshing(true);
      setError(null);

      const response = await fetchAllTickets();
      setTickets(response);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError("Failed to load tickets. Please try again later.");
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reply to a ticket
  const handleSendReply = async () => {
    if (!newReply.trim() || !selectedTicket) return;

    try {
      setSendingReply(true);
      setError(null);

      const response = await sendTicketReply(selectedTicket._id, newReply);

      // Update the selected ticket with the new reply
      setSelectedTicket(response);

      // Update tickets list
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id ? response : ticket
        )
      );

      setNewReply("");
      toast.success("Reply sent successfully");
    } catch (error) {
      console.error("Failed to send reply:", error);
      setError("Failed to send reply. Please try again later.");
      toast.error("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  // Close a ticket
  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      setClosingTicket(true);
      setError(null);

      const response = await closeTicket(selectedTicket._id);

      setSelectedTicket(response);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id ? response : ticket
        )
      );

      toast.success("Ticket closed successfully");
    } catch (error) {
      console.error("Failed to close ticket:", error);
      setError("Failed to close ticket. Please try again later.");
      toast.error("Failed to close ticket");
    } finally {
      setClosingTicket(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTicket) return;

    try {
      const response = await updateTicketStatus(selectedTicket._id, status);

      setSelectedTicket(response);

      // Update tickets list
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id ? response : ticket
        )
      );

      toast.success(`Ticket status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter tickets based on active tab and search query
  const getFilteredTickets = () => {
    if (!Array.isArray(tickets)) return [];

    // Filter by search query
    let filtered = tickets.filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.userId &&
          ticket.userId.email &&
          ticket.userId.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (ticket.userId &&
          ticket.userId.name &&
          ticket.userId.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    return filtered;
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            Open
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            In Progress
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const sortedTickets = () => {
    const filtered = getFilteredTickets();

    return [...filtered].sort((a, b) => {
      const statusPriority = { open: 0, "in-progress": 1, closed: 2 };

      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }

      return (
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
      );
    });
  };

  const handleOrderLookup = async () => {
    if (!orderSearchQuery.trim()) return;

    try {
      setLoadingOrder(true);
      setOrderDetails(null);

      const details = await getOrderDetails(orderSearchQuery.trim());
      setOrderDetails(details);
    } catch (error) {
      toast.error("Failed to find order");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleRefund = async () => {
    if (!orderDetails || !selectedGame || !selectedKey) return;

    try {
      setProcessingRefund(true);

      await processGameRefund(
        orderDetails._id,
        selectedGame.gameId,
        selectedKey
      );

      // Refresh order details after refund
      const refreshedOrder = await getOrderDetails(orderDetails._id);
      setOrderDetails(refreshedOrder);

      toast.success("Refund processed successfully");
      setSelectedGame(null);
      setSelectedKey(null);
    } catch (error) {
      toast.error("Failed to process refund");
    } finally {
      setProcessingRefund(false);
    }
  };

  const handleReplaceKey = async () => {
    if (!orderDetails || !selectedGame || !selectedKey) return;

    try {
      setProcessingReplace(true);

      await replaceGameKey(orderDetails._id, selectedGame.gameId, selectedKey);

      // Refresh order details after key replacement
      const refreshedOrder = await getOrderDetails(orderDetails._id);
      setOrderDetails(refreshedOrder);

      toast.success("Game key replaced successfully");
      setSelectedGame(null);
      setSelectedKey(null);
    } catch (error) {
      toast.error("Failed to replace game key");
    } finally {
      setProcessingReplace(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleFetchTickets();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-(--color-background) py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-(--color-background) border border-[#2D3237]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-(--color-foreground)">
              Admin Customer Support
            </CardTitle>
            <CardDescription className="text-(--color-foreground)/70">
              Please login with admin credentials to manage support tickets.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button
              className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80"
              onClick={() => (window.location.href = "/login")}
            >
              Login to Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-background) py-8">
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 ">
          {/* Left Side - Tickets List */}
          <div className="w-full lg:w-1/3 ">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-(--color-foreground)">
                Support Tickets
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-[#2D3237] text-(--color-foreground)"
                  size="sm"
                  onClick={handleFetchTickets}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>

            <div className="mb-4 flex gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search tickets, users..."
                  className="pl-3 bg-(--color-background) border-[#2D3237] text-(--color-foreground)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-(--color-foreground)" />
              </div>
            ) : sortedTickets().length === 0 ? (
              <div className="text-center py-16 border border-[#2D3237] rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto text-(--color-foreground)/40" />
                <h3 className="mt-4 text-lg font-medium text-(--color-foreground)">
                  No tickets found
                </h3>
                <p className="mt-2 text-(--color-foreground)/70">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "There are no support tickets to display"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
                {sortedTickets().map((ticket) => (
                  <div
                    key={ticket._id}
                    className={` cursor-pointer p-4 mr-4 border rounded-lg transition-colors ${
                      selectedTicket && selectedTicket._id === ticket._id
                        ? "border-(--color-accent-primary) bg-(--color-accent-primary)/5"
                        : "border-[#2D3237] hover:border-(--color-accent-primary)/50"
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-(--color-foreground) truncate flex-1">
                        {ticket.subject}
                      </h3>
                      {renderStatusBadge(ticket.status)}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-xs text-(--color-foreground)/70">
                      <User className="h-3 w-3" />
                      <span>
                        {ticket.userId && ticket.userId.email
                          ? ticket.userId.email
                          : "Unknown User"}
                      </span>
                    </div>

                    <p className="text-sm text-(--color-foreground)/70 mt-2 line-clamp-2">
                      {ticket.message}
                    </p>

                    <div className="flex justify-between items-center mt-3 text-xs text-(--color-foreground)/60">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(ticket.updatedAt || ticket.createdAt)}
                      </div>
                      <div>
                        {ticket.replies?.length || 0}{" "}
                        {ticket.replies?.length === 1 ? "reply" : "replies"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Ticket Details */}
          <div className="w-full lg:w-2/3">
            {selectedTicket ? (
              <Card className="border-[#2D3237] bg-(--color-background)">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-(--color-foreground)">
                        {selectedTicket.subject}
                      </CardTitle>
                      <CardDescription className="text-(--color-foreground)/70 mt-1">
                        Ticket ID: {selectedTicket._id}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(selectedTicket.status)}

                      {/* Status Dropdown */}
                      {selectedTicket.status !== "closed" && (
                        <Select
                          value={selectedTicket.status}
                          onValueChange={(value) => handleUpdateStatus(value)}
                          disabled={closingTicket}
                        >
                          <SelectTrigger className="h-8 px-3 w-40 bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                            <SelectItem value="open">Set to Open</SelectItem>
                            <SelectItem value="in-progress">
                              Set to In Progress
                            </SelectItem>
                            <SelectItem value="closed">Close Ticket</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mt-4 mb-1">
                    <Button
                      variant="outline"
                      className="text-xs h-7 border-[#2D3237] text-(--color-foreground)"
                      onClick={() => setShowUserInfo(!showUserInfo)}
                    >
                      <User className="h-3 w-3 mr-1" />
                      <span>Customer Details</span>
                      {showUserInfo ? (
                        <ChevronDown className="h-3 w-3 ml-1" />
                      ) : (
                        <ChevronRight className="h-3 w-3 ml-1" />
                      )}
                    </Button>

                    {showUserInfo && (
                      <div className="bg-(--color-foreground)/5 p-3 rounded-md mt-2 text-sm border border-[#2D3237]">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-(--color-foreground)/70">
                              Name:
                            </span>
                            <span className="ml-1 text-(--color-foreground)">
                              {selectedTicket.userId &&
                              selectedTicket.userId.name
                                ? selectedTicket.userId.name
                                : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-(--color-foreground)/70">
                              Email:
                            </span>
                            <span className="ml-1 text-(--color-foreground)">
                              {selectedTicket.userId &&
                              selectedTicket.userId.email
                                ? selectedTicket.userId.email
                                : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-(--color-foreground)/70">
                              Created:
                            </span>
                            <span className="ml-1 text-(--color-foreground)">
                              {formatDate(selectedTicket.createdAt)}
                            </span>
                          </div>
                          <div>
                            <span className="text-(--color-foreground)/70">
                              Last Update:
                            </span>
                            <span className="ml-1 text-(--color-foreground)">
                              {formatDate(
                                selectedTicket.updatedAt ||
                                  selectedTicket.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Initial message */}
                  <div className="p-4 rounded-lg bg-(--color-foreground)/5 border border-[#2D3237]">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-(--color-foreground)">
                        {selectedTicket.userId && selectedTicket.userId.name
                          ? selectedTicket.userId.name
                          : "Customer"}
                      </div>
                      <div className="text-xs text-(--color-foreground)/60">
                        {formatDate(selectedTicket.createdAt)}
                      </div>
                    </div>
                    <p className="text-(--color-foreground)/90 whitespace-pre-wrap">
                      {selectedTicket.message}
                    </p>
                  </div>

                  {/* Replies */}
                  {selectedTicket.replies &&
                    selectedTicket.replies.map((reply, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          reply.sender === "admin"
                            ? "bg-(--color-accent-primary)/10 border border-(--color-accent-primary)/20"
                            : "bg-(--color-foreground)/5 border border-[#2D3237]"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-(--color-foreground)">
                            {reply.sender === "admin"
                              ? "Merchant"
                              : selectedTicket.userId &&
                                selectedTicket.userId.name
                              ? selectedTicket.userId.name
                              : "Customer"}
                          </div>
                          <div className="text-xs text-(--color-foreground)/60">
                            {formatDate(reply.createdAt)}
                          </div>
                        </div>
                        <p className="text-(--color-foreground)/90 whitespace-pre-wrap">
                          {reply.message}
                        </p>
                      </div>
                    ))}

                  {/* Reply input */}
                  {selectedTicket.status !== "closed" && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Type your reply here..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="min-h-[100px] bg-(--color-background) border-[#2D3237] text-(--color-foreground)"
                        disabled={sendingReply}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handleSendReply}
                          className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80"
                          disabled={!newReply.trim() || sendingReply}
                        >
                          {sendingReply ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Closed ticket message */}
                  {selectedTicket.status === "closed" && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                      <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <p className="text-(--color-foreground)">
                        This ticket has been resolved and closed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 border border-[#2D3237] rounded-lg">
                <MessageSquare className="h-16 w-16 text-(--color-foreground)/30" />
                <h3 className="mt-6 text-xl font-medium text-(--color-foreground)">
                  No ticket selected
                </h3>
                <p className="mt-2 text-(--color-foreground)/70 text-center max-w-md">
                  Select a ticket from the list to view its details and respond
                  to the customer.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Refund & Key Replacement Section */}
        <div className="mt-4 px-2 sm:px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-(--color-foreground)">
              Order Management
            </h2>
            <Button
              variant="outline"
              className="border-[#2D3237] text-(--color-foreground) w-full sm:w-auto"
              size="sm"
              onClick={() => setShowRefundSection(!showRefundSection)}
            >
              {showRefundSection ? "Hide" : "Show"} Refund & Key Management
            </Button>
          </div>

          {showRefundSection && (
            <Card className="border-[#2D3237] bg-(--color-background)">
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-lg text-(--color-foreground)">
                  Refund & Key Replacement
                </CardTitle>
                <CardDescription className="text-(--color-foreground)/70">
                  Process refunds or replace game keys for customer orders
                </CardDescription>
              </CardHeader>

              <CardContent className="px-3 sm:px-6">
                {/* Order Search */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Enter Order ID"
                      className="pl-3 bg-(--color-background) border-[#2D3237] text-(--color-foreground) w-full"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleOrderLookup}
                    className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80 w-full sm:w-auto"
                    disabled={loadingOrder || !orderSearchQuery.trim()}
                  >
                    {loadingOrder ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Look Up Order"
                    )}
                  </Button>
                </div>

                {/* Order Details */}
                {orderDetails ? (
                  <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="p-3 rounded-lg bg-(--color-foreground)/5 border border-[#2D3237]">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <h3 className="font-medium text-(--color-foreground) text-sm break-all">
                          Order #{orderDetails._id}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-500 border-blue-500/20 mt-1 sm:mt-0"
                        >
                          {orderDetails.status}
                        </Badge>
                      </div>

                      <div className="mt-2 text-sm text-(--color-foreground)/70">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <div className="truncate">
                            Customer: {orderDetails.userId?.email || "N/A"}
                          </div>
                          <div>Date: {formatDate(orderDetails.createdAt)}</div>
                          <div>
                            Total: $
                            {orderDetails.totalAmount?.toFixed(2) || "0.00"}
                          </div>
                          <div>Items: {orderDetails.items?.length || 0}</div>
                        </div>
                      </div>
                    </div>

                    {/* Games List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-(--color-foreground)">
                        Purchased Games
                      </h4>
                      {orderDetails.items?.length > 0 ? (
                        orderDetails.items.map((item) => (
                          <div
                            key={item._id}
                            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                              selectedGame && selectedGame._id === item._id
                                ? "border-(--color-accent-primary) bg-(--color-accent-primary)/5"
                                : "border-[#2D3237] hover:border-(--color-accent-primary)/50"
                            }`}
                            onClick={() => {
                              setSelectedGame(item);
                              setSelectedKey(null);
                            }}
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start">
                              <div>
                                <h5 className="font-medium text-(--color-foreground)">
                                  {item.title || "Unknown Game"}
                                </h5>
                                <p className="text-xs text-(--color-foreground)/70 mt-1">
                                  Platform: {item.platform || "N/A"} • Keys:{" "}
                                  {item.keys?.length || 0}
                                </p>
                              </div>
                              <div className="text-sm text-(--color-foreground) mt-2 sm:mt-0">
                                ${item.price?.toFixed(2) || "0.00"}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 border border-[#2D3237] rounded-lg text-(--color-foreground)/70">
                          No games found in this order
                        </div>
                      )}
                    </div>

                    {/* Keys List - Show when a game is selected */}
                    {selectedGame &&
                      selectedGame.keys &&
                      selectedGame.keys.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-(--color-foreground) mb-2">
                            Game Keys
                          </h4>
                          <div className="space-y-2">
                            {selectedGame.keys.map((key, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                                  selectedKey === key.code
                                    ? "border-(--color-accent-primary) bg-(--color-accent-primary)/5"
                                    : "border-[#2D3237]"
                                }`}
                                onClick={() => setSelectedKey(key.code)}
                              >
                                <div className="flex items-center w-full sm:w-auto">
                                  <KeyRound className="h-4 w-4 mr-2 flex-shrink-0 text-(--color-foreground)/70" />
                                  <div className="text-sm font-mono text-(--color-foreground) break-all">
                                    {key.code}
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`mt-1 sm:mt-0 ${
                                    key.isUsed
                                      ? "bg-gray-500/10"
                                      : "bg-green-500/10 text-green-500"
                                  }`}
                                >
                                  {key.isUsed ? "Used" : "Active"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    {selectedGame && selectedKey && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 w-full sm:w-auto"
                              disabled={processingRefund}
                            >
                              {processingRefund ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Process Refund
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-(--color-background) border-[#2D3237] text-(--color-foreground) w-[95%] max-w-md mx-auto">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Refund
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will process a refund for the selected game
                                key. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                              <AlertDialogCancel className="bg-(--color-background) border-[#2D3237] text-(--color-foreground) w-full sm:w-auto">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleRefund}
                                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                              >
                                Process Refund
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-[#2D3237] text-(--color-foreground) w-full sm:w-auto"
                              disabled={processingReplace}
                            >
                              {processingReplace ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <ArrowLeftRight className="h-4 w-4 mr-2" />
                              )}
                              Replace Key
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-(--color-background) border-[#2D3237] text-(--color-foreground) w-[95%] max-w-md mx-auto">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Key Replacement
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will invalidate the current key and
                                generate a new one for the customer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                              <AlertDialogCancel className="bg-(--color-background) border-[#2D3237] text-(--color-foreground) w-full sm:w-auto">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleReplaceKey}
                                className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80 w-full sm:w-auto"
                              >
                                Replace Key
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ) : loadingOrder ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-(--color-foreground)" />
                  </div>
                ) : (
                  <div className="text-center py-8 border border-[#2D3237] rounded-lg">
                    <AlertTriangle className="h-10 w-10 mx-auto text-(--color-foreground)/40" />
                    <h3 className="mt-3 text-lg font-medium text-(--color-foreground)">
                      No Order Selected
                    </h3>
                    <p className="mt-2 text-(--color-foreground)/70 max-w-md mx-auto px-4">
                      Enter an order ID to view details and process refunds or
                      key replacements.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
