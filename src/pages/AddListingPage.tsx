import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, Sparkles, X, Loader2, Plus,
} from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ethiopianCities, environmentOptions } from '@/data/mockData';
import { uploadImage } from '@/lib/cloudinary';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CUSTOM_CITY_VALUE = '__custom__';

const AddListingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isOwner, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isImproving, setIsImproving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cityMode, setCityMode] = useState<'select' | 'custom'>('select');
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    customCity: '',
    area: '',
    price: '',
    rooms: '',
    maxPeople: '',
    environment: [] as string[],
    description: '',
    phone: '',
    availabilityDuration: '30', // days
  });
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoggedIn || !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You must be logged in as a House Owner to add listings.</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEnvironment = (envId: string) => {
    setFormData((prev) => ({
      ...prev,
      environment: prev.environment.includes(envId)
        ? prev.environment.filter((e) => e !== envId)
        : [...prev.environment, envId],
    }));
  };

  const handleCityChange = (value: string) => {
    if (value === CUSTOM_CITY_VALUE) {
      setCityMode('custom');
      handleChange('city', '');
    } else {
      setCityMode('select');
      handleChange('city', value);
      handleChange('customCity', '');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 5 - images.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    setUploadingImage(true);
    try {
      for (const file of filesToUpload) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);
          continue;
        }
        const url = await uploadImage(file);
        setImages((prev) => [...prev, url]);
      }
      toast.success('Images uploaded!');
    } catch (error) {
      toast.error('Image upload failed. Make sure your Cloudinary upload preset is configured.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImproveDescription = async () => {
    if (!formData.description.trim()) {
      toast.error('Please enter a description first');
      return;
    }
    setIsImproving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: formData.description, type: 'improve_description' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI request failed');
      setFormData((prev) => ({ ...prev, description: data.result }));
      toast.success('Description improved with AI!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to improve description. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      const cityValue = cityMode === 'custom' ? formData.customCity : formData.city;
      
      // Validate required fields
      if (!formData.title || !cityValue || !formData.area || !formData.price || !formData.rooms || !formData.maxPeople || !formData.phone || !formData.description) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Number(formData.availabilityDuration));

      console.log('Submitting listing with data:', {
        title: formData.title,
        city: cityValue,
        area: formData.area,
        price: Number(formData.price),
        rooms: Number(formData.rooms),
        maxPeople: Number(formData.maxPeople),
        environment: formData.environment,
        description: formData.description,
        images,
        ownerPhone: formData.phone,
        ownerId: user!.uid,
        ownerName: user!.displayName || user!.email || '',
        status: 'pending',
        availabilityDuration: Number(formData.availabilityDuration),
        expiryDate: Timestamp.fromDate(expiryDate),
      });

      await addDoc(collection(db, 'listings'), {
        title: formData.title,
        city: cityValue,
        area: formData.area,
        price: Number(formData.price),
        rooms: Number(formData.rooms),
        maxPeople: Number(formData.maxPeople),
        environment: formData.environment,
        description: formData.description,
        images,
        ownerPhone: formData.phone,
        ownerId: user!.uid,
        ownerName: user!.displayName || user!.email || '',
        status: 'pending',
        hidden: false,
        availabilityDuration: Number(formData.availabilityDuration),
        expiryDate: Timestamp.fromDate(expiryDate),
        createdAt: Timestamp.now(),
      });
      toast.success('Listing submitted for review!');
      navigate('/my-listings');
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      const errorMessage = error?.message || 'Failed to submit listing';
      toast.error(`Failed to submit: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t('nav.addListing')}</h1>
          <p className="text-muted-foreground">Fill in the details to list your property</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
          <h2 className="font-display font-semibold text-foreground">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">{t('form.title')}</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g., Modern 2BR Apartment in Bole" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('form.city')}</Label>
              {cityMode === 'select' ? (
                <Select value={formData.city} onValueChange={handleCityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select or type a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {ethiopianCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name[language as keyof typeof city.name] || city.name.en}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_CITY_VALUE}>
                      <span className="flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Type a custom city
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={formData.customCity}
                    onChange={(e) => handleChange('customCity', e.target.value)}
                    placeholder="Type your city name"
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => { setCityMode('select'); handleChange('customCity', ''); }}>
                    List
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">{t('form.area')}</Label>
              <Input id="area" value={formData.area} onChange={(e) => handleChange('area', e.target.value)} placeholder="e.g., Bole, CMC, Piassa" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t('form.price')}</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="e.g., 15000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms">{t('form.rooms')}</Label>
              <Select value={formData.rooms} onValueChange={(v) => handleChange('rooms', v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} {n === 1 ? 'Room' : 'Rooms'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPeople">{t('form.maxPeople')}</Label>
              <Input id="maxPeople" type="number" value={formData.maxPeople} onChange={(e) => handleChange('maxPeople', e.target.value)} placeholder="e.g., 4" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+251 9XX XXX XXX" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availabilityDuration">Availability Duration (Days)</Label>
              <Select value={formData.availabilityDuration} onValueChange={(v) => handleChange('availabilityDuration', v)}>
                <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days (1 Week)</SelectItem>
                  <SelectItem value="14">14 Days (2 Weeks)</SelectItem>
                  <SelectItem value="30">30 Days (1 Month)</SelectItem>
                  <SelectItem value="60">60 Days (2 Months)</SelectItem>
                  <SelectItem value="90">90 Days (3 Months)</SelectItem>
                  <SelectItem value="180">180 Days (6 Months)</SelectItem>
                  <SelectItem value="365">365 Days (1 Year)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Your listing will be visible for this duration after approval</p>
            </div>
          </div>
        </div>

        {/* Environment */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
          <h2 className="font-display font-semibold text-foreground">{t('form.environment')}</h2>
          <div className="flex flex-wrap gap-3">
            {environmentOptions.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => toggleEnvironment(env.id)}
                className={cn(
                  'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                  formData.environment.includes(env.id)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                )}
              >
                {env.label[language as keyof typeof env.label] || env.label.en}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground">{t('form.description')}</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleImproveDescription} disabled={isImproving} className="gap-2">
              {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-secondary" />}
              {t('action.improve')}
            </Button>
          </div>
          <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe your property in detail..." rows={6} required />
        </div>

        {/* Images */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
          <h2 className="font-display font-semibold text-foreground">{t('form.images')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg bg-muted overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                {uploadingImage ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                <span className="text-xs">{uploadingImage ? 'Uploading...' : 'Add Photo'}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Upload up to 5 images (max 5MB each)</p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t('action.cancel')}</Button>
          <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {t('action.submit')}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddListingPage;
