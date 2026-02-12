import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Building2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import HouseCard from '@/components/cards/HouseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ListingDoc {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  rooms: number;
  maxPeople: number;
  environment: string[];
  description: string;
  images: string[];
  ownerPhone: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: any;
}

const MyListingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, isLoggedIn, isOwner } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'listings'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ListingDoc));
      setListings(docs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching listings:', error);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (!isLoggedIn || !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You must be logged in as a House Owner.</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  const pendingHouses = listings.filter((h) => h.status === 'pending');
  const approvedHouses = listings.filter((h) => h.status === 'approved');
  const rejectedHouses = listings.filter((h) => h.status === 'rejected');

  const renderHouseList = (houses: ListingDoc[]) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    if (houses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No listings in this category</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {houses.map((house, idx) => (
          <div key={house.id} className="space-y-2">
            <HouseCard
              house={{
                ...house,
                createdAt: house.createdAt?.toDate?.() || new Date(),
              }}
              index={idx}
            />
            {house.status === 'rejected' && house.rejectionReason && (
              <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-xs font-medium text-destructive">Rejection Reason:</p>
                <p className="text-xs text-muted-foreground">{house.rejectionReason}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('nav.myListings')}</h1>
            <p className="text-muted-foreground">{listings.length} total listings</p>
          </div>
        </div>
        <Button onClick={() => navigate('/add-listing')} className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          {t('nav.addListing')}
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="all">All ({listings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingHouses.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedHouses.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedHouses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderHouseList(listings)}</TabsContent>
        <TabsContent value="pending"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderHouseList(pendingHouses)}</motion.div></TabsContent>
        <TabsContent value="approved"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderHouseList(approvedHouses)}</motion.div></TabsContent>
        <TabsContent value="rejected"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderHouseList(rejectedHouses)}</motion.div></TabsContent>
      </Tabs>
    </div>
  );
};

export default MyListingsPage;
