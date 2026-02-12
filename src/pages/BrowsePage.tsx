import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Building2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { ethiopianCities, environmentOptions } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import HouseCard from '@/components/cards/HouseCard';
import { cn } from '@/lib/utils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

const BrowsePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedRooms, setSelectedRooms] = useState<string>('all');
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'listings'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const fetchedHouses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouses(fetchedHouses);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const approvedHouses = houses.filter((h) => {
    if (h.hidden) return false;
    const ed = h.expiryDate;
    if (!ed) return true;
    const d = ed?.toDate ? ed.toDate() : new Date(ed);
    return d >= new Date();
  });

  const filteredHouses = approvedHouses.filter((house) => {
    // City filter
    if (selectedCity !== 'all' && house.city !== selectedCity) return false;
    
    // Price filter
    if (house.price < priceRange[0] || house.price > priceRange[1]) return false;
    
    // Rooms filter
    if (selectedRooms !== 'all' && house.rooms !== parseInt(selectedRooms)) return false;
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        house.title.toLowerCase().includes(term) ||
        house.area.toLowerCase().includes(term) ||
        house.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const clearFilters = () => {
    setSelectedCity('all');
    setPriceRange([0, 50000]);
    setSelectedRooms('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {t('nav.browse')}
          </h1>
          <p className="text-muted-foreground">
            {filteredHouses.length} houses available
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && 'border-primary')}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search and filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 'auto' }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('hero.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-card border border-border space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('form.city')}</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {ethiopianCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name[language as keyof typeof city.name] || city.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rooms select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('form.rooms')}</label>
                <Select value={selectedRooms} onValueChange={setSelectedRooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1 Room</SelectItem>
                    <SelectItem value="2">2 Rooms</SelectItem>
                    <SelectItem value="3">3 Rooms</SelectItem>
                    <SelectItem value="4">4+ Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">{t('filter.priceRange')}</label>
                  <span className="text-sm text-muted-foreground">
                    {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ETB
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={50000}
                  step={1000}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Clear filters */}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading listings...</p>
        </div>
      ) : filteredHouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHouses.map((house, idx) => (
            <HouseCard key={house.id} house={house} index={idx} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No houses found</h3>
          <p className="text-muted-foreground max-w-md">
            Try adjusting your filters or search term to find more results.
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear all filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default BrowsePage;
