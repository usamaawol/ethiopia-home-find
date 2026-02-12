import React from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, ArrowRight, CheckCircle, Shield, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ethiopianCities, mockHouses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CityCard from '@/components/cards/CityCard';
import HouseCard from '@/components/cards/HouseCard';
import heroBg from '@/assets/hero-bg.jpg';

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();

  const approvedHouses = mockHouses.filter((h) => h.status === 'approved');
  const featuredCities = ethiopianCities.slice(0, 6);

  const features = [
    { icon: CheckCircle, title: 'Verified Listings', desc: 'All houses verified by admin' },
    { icon: Shield, title: 'No Brokers', desc: 'Direct owner connection' },
    { icon: Users, title: 'Trusted Community', desc: 'Real users, real homes' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -m-4 md:-m-6 lg:-m-8 mb-8">
        <div className="relative h-[480px] md:h-[540px] overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">
                    <Building2 className="w-4 h-4" />
                    {t('app.tagline')}
                  </span>
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                  <span className="text-foreground">{t('hero.title').split(' ').slice(0, -2).join(' ')}</span>{' '}
                  <span className="text-gradient-gold">{t('hero.title').split(' ').slice(-2).join(' ')}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-muted-foreground max-w-xl">
                  {t('hero.subtitle')}
                </p>

                {/* Search bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t('hero.searchPlaceholder')}
                      className="pl-10 h-12 bg-card/80 backdrop-blur-sm border-border"
                    />
                  </div>
                  <Button size="lg" className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity">
                    {t('hero.search')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-6 pt-4"
                >
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <feature.icon className="w-5 h-5 text-secondary" />
                      <span className="text-muted-foreground">{feature.title}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t('cities.title')}
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore houses across major Ethiopian cities
            </p>
          </div>
          <Button variant="ghost" className="text-primary">
            {t('cities.viewAll')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCities.map((city, idx) => (
            <CityCard key={city.id} city={city} index={idx} />
          ))}
        </div>
      </section>

      {/* Featured Houses Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t('houses.featured')}
            </h2>
            <p className="text-muted-foreground mt-1">
              Hand-picked quality listings
            </p>
          </div>
          <Button variant="ghost" className="text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {approvedHouses.slice(0, 6).map((house, idx) => (
            <HouseCard key={house.id} house={house} index={idx} />
          ))}
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t('houses.recent')}
            </h2>
            <p className="text-muted-foreground mt-1">
              Latest additions to our platform
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {approvedHouses
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 3)
            .map((house, idx) => (
              <HouseCard key={house.id} house={house} index={idx} />
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="cta-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#cta-pattern)" />
          </svg>
        </div>
        
        <div className="relative p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            Have a house to rent?
          </h3>
          <p className="text-white/80 max-w-lg mx-auto mb-6">
            List your property for free and connect with verified renters looking for homes in Ethiopia.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            List Your Property
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
