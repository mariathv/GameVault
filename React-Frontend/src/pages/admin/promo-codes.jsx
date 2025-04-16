"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, Calendar, Percent, AlertCircle, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'
import { createNewPromoCode, deletePromoCode, getPromoCodes } from "@/src/api/promos"

export default function PromoCodes() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCode, setSelectedCode] = useState(null)
    const [filterType, setFilterType] = useState("all")
    const [loading, setLoading] = useState(true)
    const [promoCodes, setPromoCodes] = useState([])
    const [newPromoCode, setNewPromoCode] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxUses: "",
        expiryDate: "",
        isActive: true,
        description: "",
    })

    const fetchPromoCodes = async () => {
        setLoading(true);
        const promosFetched = await getPromoCodes();
        setPromoCodes(promosFetched);
        setLoading(false)
    }

    useEffect(() => {
        fetchPromoCodes();
    }, [])

    const handleAddPromoCode = async () => {
        if (!newPromoCode.code || !newPromoCode.discountValue || !newPromoCode.expiryDate) {
            toast.error("Missing Information, please fill all fields");
            return
        }


        const newCode = {
            id: promoCodes.length + 1,
            ...newPromoCode,
            usedCount: 0,
        }

        const reqCreate = await createNewPromoCode(newCode);
        if (reqCreate?.status == true) {

            setPromoCodes([...promoCodes, newCode])
            setIsAddDialogOpen(false)

            setNewPromoCode({
                code: "",
                discountType: "percentage",
                discountValue: "",
                maxUses: "",
                expiryDate: "",
                isActive: true,
                description: "",
            })

            toast.success("Promo code added successfully")
        } else {
            toast.success("Error Occured, please try again.")
        }

    }

    const handleDeletePromoCode = async () => {
        if (!selectedCode) return

        const reqDeletePromo = await deletePromoCode(selectedCode._id);
        if (reqDeletePromo.status == true) {
            setPromoCodes(promoCodes.filter((code) => code._id !== selectedCode._id))
            setIsDeleteDialogOpen(false)
            setSelectedCode(null)
            toast.success("Promo code deleted successfully")
        } else {
            toast.success("Failed to delete promo code")
        }




    }

    const handleToggleActive = (id) => {
        setPromoCodes(promoCodes.map((code) => (code.id === id ? { ...code, isActive: !code.isActive } : code)))
    }

    const filteredCodes = promoCodes.filter((code) => {

        const matchesSearch =
            code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.description.toLowerCase().includes(searchQuery.toLowerCase())

        if (filterType === "all") return matchesSearch
        if (filterType === "active") return matchesSearch && code.isActive
        if (filterType === "inactive") return matchesSearch && !code.isActive
        if (filterType === "expired") {
            const isExpired = new Date(code.expiryDate) < new Date()
            return matchesSearch && isExpired
        }

        return matchesSearch
    })

    const getStatusBadge = (code) => {
        const isExpired = new Date(code.expiryDate) < new Date()
        const isMaxedOut = code.usedCount >= code.maxUses

        if (!code.isActive) {
            return (
                <Badge variant="outline" className="bg-[#2D3237]/90 text-[#DDD9FE]">
                    Inactive
                </Badge>
            )
        } else if (isExpired) {
            return (
                <Badge variant="outline" className="bg-[#3D2D37]/90 text-[#FE9A9A]">
                    Expired
                </Badge>
            )
        } else if (isMaxedOut) {
            return (
                <Badge variant="outline" className="bg-[#3D3D27]/90 text-[#FEFE9A]">
                    Maxed Out
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="bg-[#2D3D37]/90 text-[#9AFEA9]">
                    Active
                </Badge>
            )
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-(--color-background-secondary) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-foreground)"></div> {/* Loader */}
            </div>
        )
    }


    return (
        <div className="mt-4 sm:mt-6 md:mt-8 px-3 sm:px-4 md:px-6 text-(--color-light-ed)">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-0">Promo Codes</h1>
                <Button
                    className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80 text-(--color-light-ed) w-full sm:w-auto"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Promo Code
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#668389]" />
                    <Input
                        placeholder="Search promo codes..."
                        className="pl-10 bg-(--color-background)  text-(--color-light-ed) w-full focus-visible:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-(--color-accent-primary)" />
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[140px] bg-(--color-background) border-[#2D3237] text-(--color-light-ed)">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--color-background) border-[#2D3237] text-(--color-light-ed)">
                            <SelectItem value="all">All Codes</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Promo Codes Table */}
            <Card className="bg-(--color-background) border-[#2D3237] text-(--color-light-ed)">
                <CardHeader className="pb-2">
                    <CardTitle>Promo Codes</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredCodes.length === 0 ? (
                        <div className="text-center py-8 text-[#DDD9FE]/70">
                            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                            <p>No promo codes found</p>
                            {searchQuery && <p className="text-sm mt-1">Try adjusting your search or filters</p>}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#2D3237] hover:bg-[#2D3237]/50">
                                        <TableHead className="text-(--color-foreground) font-bold">Code</TableHead>
                                        <TableHead className="text-(--color-foreground) font-bold">Discount</TableHead>
                                        <TableHead className="text-(--color-foreground) font-bold min-w-10">Usage</TableHead>
                                        <TableHead className="text-(--color-foreground) font-bold">Expiry Date</TableHead>
                                        <TableHead className="text-(--color-foreground) font-bold">Status</TableHead>
                                        <TableHead className="text-(--color-foreground) font-bold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCodes.map((code) => (
                                        <TableRow key={code.id} className="border-[#2D3237] hover:bg-[#2D3237]/50">
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="font-mono">{code.code}</span>
                                                    <span className="text-xs text-(--color-foreground)/40 mt-1">{code.description}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {code.discountType === "percentage" ? (
                                                    <span className="flex items-center">
                                                        <Percent className="h-3 w-3 mr-1 text-[#668389]" />
                                                        {code.discountValue}%
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <span className="mr-1 text-[#668389]">$</span>
                                                        {code.discountValue}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center">
                                                                <div className="w-full bg-[#2D3237] rounded-full h-2 mr-2">
                                                                    <div
                                                                        className="bg-[#668389] h-2 rounded-full"
                                                                        style={{ width: `${(code.usedCount / code.maxUses) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs whitespace-nowrap">
                                                                    {code.usedCount}/{code.maxUses}
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-[#2D3237] text-(--color-light-ed) border-[#3D4247]">
                                                            <p>{((code.usedCount / code.maxUses) * 100).toFixed(1)}% used</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1 text-[#668389]" />
                                                    {new Date(code.expiryDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(code)}</TableCell>

                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-[#FE9A9A] hover:text-[#FE9A9A]/80 hover:bg-[#3D2D37]"
                                                    onClick={() => {
                                                        setSelectedCode(code)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Promo Code Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-(--color-background) text-(--color-light-ed) border-[#2D3237] sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Promo Code</DialogTitle>
                        <DialogDescription className="text-(--color-light-ed)/70">
                            Create a new promotional code for your store.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code*
                            </Label>
                            <Input
                                id="code"
                                placeholder="SUMMER2023"
                                className="col-span-3 focus-visible:ring-0 bg-(--color-background) border-[#3D4247] text-(--color-light-ed)"
                                value={newPromoCode.code}
                                onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="discountType" className="text-right">
                                Type
                            </Label>
                            <Select
                                value={newPromoCode.discountType}
                                onValueChange={(value) => setNewPromoCode({ ...newPromoCode, discountType: value })}
                            >
                                <SelectTrigger id="discountType" className="col-span-3 bg-(--color-background)  border-[#3D4247] text-(--color-light-ed)">
                                    <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                                <SelectContent className="bg-(--color-background)  border-[#2D3237] text-(--color-light-ed)">
                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="discountValue" className="text-right">
                                Value*
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    id="discountValue"
                                    type="number"
                                    placeholder={newPromoCode.discountType === "percentage" ? "15" : "20"}
                                    className="bg-(--color-background) focus-visible:ring-0  border-[#3D4247] text-(--color-light-ed) pl-7"
                                    value={newPromoCode.discountValue}
                                    onChange={(e) => setNewPromoCode({ ...newPromoCode, discountValue: e.target.value })}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#668389]">
                                    {newPromoCode.discountType === "percentage" ? "%" : "$"}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maxUses" className="text-right">
                                Max Uses
                            </Label>
                            <Input
                                id="maxUses"
                                type="number"
                                placeholder="100"
                                className="col-span-3 focus-visible:ring-0 bg-(--color-background)  border-[#3D4247] text-(--color-light-ed)"
                                value={newPromoCode.maxUses}
                                onChange={(e) => setNewPromoCode({ ...newPromoCode, maxUses: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expiryDate" className="text-right">
                                Expiry Date*
                            </Label>
                            <Input
                                id="expiryDate"
                                type="date"
                                className="col-span-3 focus-visible:ring-0 bg-(--color-background)  border-[#3D4247] text-(--color-light-ed)"
                                value={newPromoCode.expiryDate}
                                onChange={(e) => setNewPromoCode({ ...newPromoCode, expiryDate: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                placeholder="Summer sale discount"
                                className="col-span-3 focus-visible:ring-0 bg-(--color-background)  border-[#3D4247] text-(--color-light-ed)"
                                value={newPromoCode.description}
                                onChange={(e) => setNewPromoCode({ ...newPromoCode, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isActive" className="text-right">
                                Active
                            </Label>
                            <div className="flex items-center col-span-3">
                                <Switch
                                    id="isActive"
                                    checked={newPromoCode.isActive}
                                    onCheckedChange={(checked) => setNewPromoCode({ ...newPromoCode, isActive: checked })}
                                    className="data-[state=checked]:bg-[#668389]"
                                />
                                <Label htmlFor="isActive" className="ml-2">
                                    {newPromoCode.isActive ? "Yes" : "No"}
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="border-[#3D4247] text-(--color-light-ed) hover:bg-[#2D3237]"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddPromoCode} className="bg-[#668389] hover:bg-[#668389]/80 text-(--color-light-ed)">
                            Add Promo Code
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#1D2127] text-(--color-light-ed) border-[#2D3237] sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Promo Code</DialogTitle>
                        <DialogDescription className="text-[#DDD9FE]/70">
                            Are you sure you want to delete this promo code? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCode && (
                        <div className="bg-[#2D3237]/50 p-4 rounded-md my-4">
                            <div className="flex justify-between items-center">
                                <div className="font-mono font-bold">{selectedCode.code}</div>
                                {getStatusBadge(selectedCode)}
                            </div>
                            <div className="text-sm text-[#DDD9FE]/70 mt-1">{selectedCode.description}</div>
                            <div className="flex items-center mt-2 text-sm">
                                <div className="flex items-center mr-4">
                                    {selectedCode.discountType === "percentage" ? (
                                        <span className="flex items-center">
                                            <Percent className="h-3 w-3 mr-1 text-[#668389]" />
                                            {selectedCode.discountValue}%
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <span className="mr-1 text-[#668389]">$</span>
                                            {selectedCode.discountValue}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-[#668389]" />
                                    {new Date(selectedCode.expiryDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="border-[#3D4247] text-(--color-light-ed) hover:bg-[#2D3237]"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleDeletePromoCode} className="bg-[#FE9A9A]/80 hover:bg-[#FE9A9A] text-[#1D2127]">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
