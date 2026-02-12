import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { City } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CityCardProps {
  city: City;
  index: number;
  onClick?: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, index, onClick }) => {
  const { language } = useLanguage();

  // Generate a gradient based on city index for visual variety
  const gradients = [
    'from-primary/80 to-accent/60',
    'from-secondary/80 to-warning/60',
    'from-accent/80 to-primary/60',
    'from-success/80 to-accent/60',
    'from-warning/80 to-secondary/60',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-40 rounded-xl overflow-hidden card-hover">
        {/* Gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br',
            gradients[index % gradients.length]
          )}
        />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id={`pattern-${city.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill={`url(#pattern-${city.id})`} />
          </svg>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white/90" />
            <span className="text-xs text-white/80 uppercase tracking-wider">Ethiopia</span>
          </div>
          
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-1">
              {city.name[language as keyof typeof city.name] || city.name.en}
            </h3>
            <div className="flex items-center gap-1.5 text-white/80">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">{city.houseCount.toLocaleString()} houses</span>
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default CityCard;
