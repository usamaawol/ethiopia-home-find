import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ethiopianCities } from '@/data/mockData';
import CityCard from '@/components/cards/CityCard';
import { Button } from '@/components/ui/button';

const CitiesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {t('nav.cities')}
          </h1>
          <p className="text-muted-foreground">
            Browse rental houses by city
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 p-4 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{ethiopianCities.length}</span> cities available
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            {ethiopianCities.reduce((acc, city) => acc + city.houseCount, 0).toLocaleString()}
          </span>{' '}
          total listings
        </div>
      </motion.div>

      {/* Cities grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ethiopianCities.map((city, idx) => (
          <CityCard
            key={city.id}
            city={city}
            index={idx}
            onClick={() => navigate(`/browse?city=${city.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default CitiesPage;
