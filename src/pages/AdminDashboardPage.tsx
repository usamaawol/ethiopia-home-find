import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, Eye, EyeOff, Sparkles, Building2, Users, Loader2, Trash2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ListingDoc {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  rooms: number;
  description: string;
  images: string[];
  ownerPhone: string;
  ownerId: string;
  ownerName?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: any;
  expiryDate?: any;
  availabilityDuration?: number;
  hidden?: boolean;
}

const AdminDashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; listingId: string }>({ open: false, listingId: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; listingId: string; title: string }>({ open: false, listingId: '', title: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [aiReview, setAiReview] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ListingDoc)));
      setLoading(false);
    });

    // Get user count
    getCountFromServer(collection(db, 'users')).then((snap) => {
      setUserCount(snap.data().count);
    }).catch(() => {});

    return () => unsub();
  }, []);

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Admin Access Required</h2>
        <p className="text-muted-foreground">You must be logged in as an Admin.</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  const pendingListings = listings.filter((l) => l.status === 'pending');
  const approvedListings = listings.filter((l) => l.status === 'approved');
  const rejectedListings = listings.filter((l) => l.status === 'rejected');

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: Building2, color: 'text-primary' },
    { label: 'Pending Review', value: pendingListings.length, icon: Clock, color: 'text-warning' },
    { label: 'Approved', value: approvedListings.length, icon: CheckCircle, color: 'text-success' },
    { label: 'Registered Users', value: userCount, icon: Users, color: 'text-accent' },
  ];

  const handleAiReview = async (listing: ListingDoc) => {
    setAiLoading((prev) => ({ ...prev, [listing.id]: true }));
    try {
      const prompt = `Review this rental listing:\nTitle: ${listing.title}\nCity: ${listing.city}, ${listing.area}\nPrice: ${listing.price} ETB/month\nRooms: ${listing.rooms}\nDescription: ${listing.description}`;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'admin_review' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI review failed');
      setAiReview((prev) => ({ ...prev, [listing.id]: data.result }));
    } catch (error) {
      toast.error('AI review failed');
    } finally {
      setAiLoading((prev) => ({ ...prev, [listing.id]: false }));
    }
  };

  const handleApprove = async (id: string) => {
    try {
      console.log('Attempting to approve listing:', id);
      await updateDoc(doc(db, 'listings', id), { 
        status: 'approved', 
        rejectionReason: null 
      });
      toast.success('Listing approved!');
    } catch (e: any) {
      console.error('Error approving listing:', e);
      toast.error(`Failed to approve: ${e.message || 'Unknown error'}`);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      console.log('Attempting to reject listing:', rejectDialog.listingId);
      await updateDoc(doc(db, 'listings', rejectDialog.listingId), {
        status: 'rejected',
        rejectionReason: rejectReason,
      });
      toast.success('Listing rejected');
      setRejectDialog({ open: false, listingId: '' });
      setRejectReason('');
    } catch (e: any) {
      console.error('Error rejecting listing:', e);
      toast.error(`Failed to reject: ${e.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Attempting to delete listing:', deleteDialog.listingId);
      await deleteDoc(doc(db, 'listings', deleteDialog.listingId));
      toast.success('Listing deleted successfully');
      setDeleteDialog({ open: false, listingId: '', title: '' });
    } catch (e: any) {
      console.error('Error deleting listing:', e);
      toast.error(`Failed to delete: ${e.message || 'Unknown error'}`);
    }
  };

  const handleToggleHidden = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'listings', id), { hidden: !current });
      toast.success(!current ? 'Listing hidden' : 'Listing visible');
    } catch (e: any) {
      console.error('Error toggling visibility:', e);
      toast.error(`Failed to update visibility: ${e.message || 'Unknown error'}`);
    }
  };

  const isExpired = (listing: ListingDoc) => {
    if (!listing.expiryDate) return false;
    const expiryDate = listing.expiryDate.toDate();
    return expiryDate < new Date();
  };

  const getDaysRemaining = (listing: ListingDoc) => {
    if (!listing.expiryDate) return null;
    const expiryDate = listing.expiryDate.toDate();
    const today = new Date();
    const diffTime = expiryDate - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t('nav.adminDashboard')}</h1>
          <p className="text-muted-foreground">Review and manage house listings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={cn('w-8 h-8', stat.color)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Pending Reviews ({pendingListings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingListings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">All caught up! No pending reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-lg border border-border bg-muted/30 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{listing.title}</h3>
                        <Badge variant="outline" className="badge-pending">{t('status.pending')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {listing.city}, {listing.area} • {listing.rooms} rooms • {listing.price.toLocaleString()} ETB/month
                      </p>
                      <p className="text-sm text-foreground line-clamp-2">{listing.description}</p>
                      {listing.ownerName && (
                        <p className="text-xs text-muted-foreground">Owner: {listing.ownerName}</p>
                      )}
                      {listing.images?.[0] && (
                        <img src={listing.images[0]} alt="" className="w-32 h-20 rounded-lg object-cover" />
                      )}
                      {aiReview[listing.id] && (
                        <div className="mt-2 p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-foreground whitespace-pre-wrap">
                          <p className="font-semibold text-accent mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Review</p>
                          {aiReview[listing.id]}
                        </div>
                      )}
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAiReview(listing)}
                        disabled={aiLoading[listing.id]}
                      >
                        {aiLoading[listing.id] ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                        AI Review
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => handleApprove(listing.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t('action.approve')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => setRejectDialog({ open: true, listingId: listing.id })}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {t('action.reject')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({listings.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedListings.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedListings.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">City</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium text-foreground">{listing.title}</td>
                        <td className="py-3 px-4 text-muted-foreground">{listing.city}</td>
                        <td className="py-3 px-4 text-foreground">{listing.price?.toLocaleString()} ETB</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={cn(
                            listing.status === 'approved' && 'badge-approved',
                            listing.status === 'pending' && 'badge-pending',
                            listing.status === 'rejected' && 'badge-rejected'
                          )}>
                            {t(`status.${listing.status}`)}
                          </Badge>
                        {isExpired(listing) && (
                          <Badge variant="outline" className="ml-2 badge-rejected">Expired</Badge>
                        )}
                        {listing.hidden && (
                          <Badge variant="outline" className="ml-2">Hidden</Badge>
                        )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {listing.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </td>
                      <td className="py-3 px-4">
                        {listing.status === 'approved' && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleHidden(listing.id, !!listing.hidden)}
                            >
                              {listing.hidden ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                              {listing.hidden ? 'Show' : 'Hide'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, listingId: listing.id, title: listing.title })}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <p className="text-muted-foreground text-center py-8">{approvedListings.length} approved listings</p>
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <p className="text-muted-foreground text-center py-8">{rejectedListings.length} rejected listings</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => { setRejectDialog({ open, listingId: open ? rejectDialog.listingId : '' }); setRejectReason(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Please provide a reason for rejection. The owner will see this.</p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Incomplete information, unclear images..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, listingId: '' })}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;
