import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Users, Phone, ChevronRight } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { House, ethiopianCities, environmentOptions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface HouseCardProps {
  house: House;
  index: number;
  onClick?: () => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, index, onClick }) => {
  const { language, t } = useLanguage();
  const [showPhone, setShowPhone] = useState(false);

  const handleContactOwner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPhone(true);
    toast.success('Phone number revealed!');
  };

  const city = ethiopianCities.find((c) => c.id === house.city);
  const cityName = city?.name[language as keyof typeof city.name] || city?.name.en || house.city;

  const getStatusBadge = () => {
    switch (house.status) {
      case 'pending':
        return <Badge variant="outline" className="badge-pending">{t('status.pending')}</Badge>;
      case 'approved':
        return <Badge variant="outline" className="badge-approved">{t('status.approved')}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="badge-rejected">{t('status.rejected')}</Badge>;
    }
  };

  const envLabels = house.environment.slice(0, 2).map((envId) => {
    const env = environmentOptions.find((e) => e.id === envId);
    return env?.label[language as keyof typeof env.label] || env?.label.en || envId;
  });

  // Generate gradient based on index
  const cardGradients = [
    'from-primary/5 to-accent/5',
    'from-secondary/5 to-warning/5',
    'from-accent/5 to-success/5',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div
        className={cn(
          'relative rounded-xl overflow-hidden cursor-pointer',
          'bg-card border border-border',
          'card-hover',
          'bg-gradient-to-br',
          cardGradients[index % cardGradients.length]
        )}
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {house.images && house.images.length > 0 ? (
            <img 
              src={house.images[0]} 
              alt={house.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <BedDouble className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          {/* Price badge */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
              <span className="text-lg font-bold text-primary">
                {house.price.toLocaleString()} ETB
              </span>
              <span className="text-xs text-muted-foreground">{t('houses.perMonth')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {house.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{cityName}, {house.area}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{house.rooms} {t('houses.rooms')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{house.maxPeople}</span>
            </div>
          </div>

          {/* Environment tags */}
          <div className="flex flex-wrap gap-1.5">
            {envLabels.map((label, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-primary"
              onClick={handleContactOwner}
            >
              <Phone className="w-4 h-4 mr-1.5" />
              {showPhone ? (house.ownerPhone || 'N/A') : t('houses.contactOwner')}
            </Button>
            <Button variant="ghost" size="sm" className="text-primary group-hover:translate-x-1 transition-transform">
              {t('houses.viewDetails')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HouseCard;
