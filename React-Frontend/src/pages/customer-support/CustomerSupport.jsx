import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/auth-context";
import { ChevronDown, ChevronRight, MessageSquare, Loader2, Send, Plus, Clock, CheckCircle, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTicket, fetchUserTickets, sendTicketReply, closeTicket } from "@/src/api/ticket";
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
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerSupport() {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: ""
  });
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user tickets
  const handleFetchTickets = async () => {
    if (!isAuthenticated) return;
    
    try {
      setRefreshing(true);
      setError(null);
      
      const response = await fetchUserTickets();
      setTickets(response);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError("Failed to load tickets. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Create a new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;
    
    try {
      setCreatingTicket(true);
      setError(null);
      
      const response = await createTicket(newTicket);
      
      // Add new ticket to state
      setTickets(prev => [response, ...prev]);
      setNewTicket({ subject: "", message: "" });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setError("Failed to create ticket. Please try again later.");
    } finally {
      setCreatingTicket(false);
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
      setTickets(prev => 
        prev.map(ticket => 
          ticket._id === selectedTicket._id ? response : ticket
        )
      );
      
      setNewReply("");
    } catch (error) {
      console.error("Failed to send reply:", error);
      setError("Failed to send reply. Please try again later.");
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
      
      // Update the selected ticket with closed status
      setSelectedTicket(response);
      
      // Update tickets list
      setTickets(prev => 
        prev.map(ticket => 
          ticket._id === selectedTicket._id ? response : ticket
        )
      );
    } catch (error) {
      console.error("Failed to close ticket:", error);
      setError("Failed to close ticket. Please try again later.");
    } finally {
      setClosingTicket(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter tickets based on active tab
  const getFilteredTickets = () => {
    if (!Array.isArray(tickets)) return [];
    
    if (activeTab === "all") return tickets;
    if (activeTab === "open") return tickets.filter(ticket => ticket.status === "open");
    if (activeTab === "in-progress") return tickets.filter(ticket => ticket.status === "in-progress");
    if (activeTab === "closed") return tickets.filter(ticket => ticket.status === "closed");
    return tickets;
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Open</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">In Progress</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
            <CardTitle className="text-2xl text-(--color-foreground)">Customer Support</CardTitle>
            <CardDescription className="text-(--color-foreground)/70">
              Please login to create support tickets and view your existing ones.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80" onClick={() => window.location.href = '/login'}>
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
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Tickets List */}
          <div className="w-full lg:w-1/3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-(--color-foreground)">Support Tickets</h1>
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
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <DialogHeader>
                      <DialogTitle>Create New Support Ticket</DialogTitle>
                      <DialogDescription className="text-(--color-foreground)/70">
                        Fill out the form below to create a new support ticket.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTicket}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium text-(--color-foreground)">
                            Subject
                          </label>
                          <Input
                            id="subject"
                            placeholder="Brief description of your issue"
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                            className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-(--color-foreground)">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Describe your issue in detail"
                            value={newTicket.message}
                            onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                            className="min-h-[150px] bg-(--color-background) border-[#2D3237] text-(--color-foreground)"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80"
                          disabled={creatingTicket}
                        >
                          {creatingTicket && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Submit Ticket
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="mb-4" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-(--color-background) border border-[#2D3237] mb-4 w-full grid grid-cols-4">
                <TabsTrigger value="all" className="data-[state=active]:bg-(--color-accent-primary) text-(--color-foreground) data-[state=active]:text-white">
                  All
                </TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-(--color-accent-primary) text-(--color-foreground) data-[state=active]:text-white">
                  Open
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="data-[state=active]:bg-(--color-accent-primary) text-(--color-foreground) data-[state=active]:text-white">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="closed" className="data-[state=active]:bg-(--color-accent-primary) text-(--color-foreground) data-[state=active]:text-white">
                  Closed
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-(--color-foreground)" />
              </div>
            ) : getFilteredTickets().length === 0 ? (
              <div className="text-center py-16 border border-[#2D3237] rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto text-(--color-foreground)/40" />
                <h3 className="mt-4 text-lg font-medium text-(--color-foreground)">No tickets found</h3>
                <p className="mt-2 text-(--color-foreground)/70">
                  {activeTab === "all" ? "You haven't created any support tickets yet." : `You don't have any ${activeTab} tickets.`}
                </p>
                <Button 
                  className="mt-4 bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {getFilteredTickets().map((ticket) => (
                  <div 
                    key={ticket._id} 
                    className={`cursor-pointer p-4 border rounded-lg transition-colors ${
                      selectedTicket && selectedTicket._id === ticket._id 
                        ? "border-(--color-accent-primary) bg-(--color-accent-primary)/5" 
                        : "border-[#2D3237] hover:border-(--color-accent-primary)/50"
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-(--color-foreground) truncate flex-1">{ticket.subject}</h3>
                      {renderStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-(--color-foreground)/70 mt-2 line-clamp-2">
                      {ticket.message}
                    </p>
                    <div className="flex justify-between items-center mt-3 text-xs text-(--color-foreground)/60">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(ticket.createdAt)}
                      </div>
                      <div>
                        {ticket.replies?.length || 0} {ticket.replies?.length === 1 ? 'reply' : 'replies'}
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
                      <CardTitle className="text-xl text-(--color-foreground)">{selectedTicket.subject}</CardTitle>
                      <CardDescription className="text-(--color-foreground)/70 mt-1">
                        Ticket ID: {selectedTicket._id}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(selectedTicket.status)}
                      
                      {/* Close Ticket Button - Only show for open or in-progress tickets */}
                      {selectedTicket.status !== 'closed' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Close Ticket
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Close this ticket?</AlertDialogTitle>
                              <AlertDialogDescription className="text-(--color-foreground)/70">
                                Are you sure you want to close this ticket? This action cannot be undone.
                                Once closed, you won't be able to add new replies.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={handleCloseTicket}
                                disabled={closingTicket}
                              >
                                {closingTicket && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Close Ticket
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Initial message */}
                  <div className="p-4 rounded-lg bg-(--color-foreground)/5 border border-[#2D3237]">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-(--color-foreground)">You</div>
                      <div className="text-xs text-(--color-foreground)/60">{formatDate(selectedTicket.createdAt)}</div>
                    </div>
                    <p className="text-(--color-foreground)/90 whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>
                  
                  {/* Replies */}
                  {selectedTicket.replies && selectedTicket.replies.map((reply, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        reply.sender === 'admin' 
                          ? "bg-(--color-accent-primary)/10 border border-(--color-accent-primary)/20" 
                          : "bg-(--color-foreground)/5 border border-[#2D3237]"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-(--color-foreground)">
                          {reply.sender === 'admin' ? 'Support Agent' : 'You'}
                        </div>
                        <div className="text-xs text-(--color-foreground)/60">{formatDate(reply.createdAt)}</div>
                      </div>
                      <p className="text-(--color-foreground)/90 whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  ))}
                  
                  {/* Reply input */}
                  {selectedTicket.status !== 'closed' && (
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
                  {selectedTicket.status === 'closed' && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                      <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <p className="text-(--color-foreground)">This ticket has been resolved and closed.</p>
                      <p className="text-sm text-(--color-foreground)/70 mt-1">
                        If you need further assistance, please create a new ticket.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 border border-[#2D3237] rounded-lg">
                <AlertCircle className="h-16 w-16 text-(--color-foreground)/30" />
                <h3 className="mt-6 text-xl font-medium text-(--color-foreground)">No ticket selected</h3>
                <p className="mt-2 text-(--color-foreground)/70 text-center max-w-md">
                  Select a ticket from the list to view its details or create a new ticket to get support.
                </p>
                <Button 
                  className="mt-4 bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}