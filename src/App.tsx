// src/App.tsx
import { useState, useEffect } from 'react';
import { Plus, Home, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FC, ReactElement } from 'react';

import { ServiceProvider, useServices } from './context/ServiceContext';
import { ServiceCategory, ServiceType } from './types/service';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import CategoryFilter from './components/CategoryFilter';

type View = 'browse' | 'my-services' | 'create' | 'search';

const AppContent: FC = (): ReactElement => {
  const [currentView, setCurrentView] = useState<View>('browse');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [selectedType, setSelectedType] = useState<ServiceType | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchServices } = useServices(); // Only fetchServices exists now

  // Fetch initial services
  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      if (!mounted) return;
      setIsLoading(true);
      setError(null);

      try {
        await fetchServices(); // fetch all services
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error loading services');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();
    return () => {
      mounted = false;
    };
  }, [fetchServices]);

  // Handlers
  const handleCategoryChange = (category: ServiceCategory | undefined) => {
    setSelectedCategory(category);
  };

  const handleTypeChange = (type: ServiceType | undefined) => {
    setSelectedType(type);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(undefined);
    setSelectedType(undefined);
    setCurrentView('browse');
  };

  return (
    <div className="w-full min-h-dvh bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Main Layout */}
      <div
        className="relative w-full min-h-dvh flex flex-col"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Header */}
        <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-6 shadow-xl">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black tracking-tight"
            >
              Service Share ✨
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-purple-100 mt-1 font-medium"
            >
              Community Marketplace
            </motion.p>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-indigo-50/30" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="p-4 mx-4 my-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {currentView === 'browse' && (
              <motion.div
                key="browse"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  selectedType={selectedType}
                  onCategoryChange={handleCategoryChange}
                  onTypeChange={handleTypeChange}
                />
                <ServiceList type="all" />
              </motion.div>
            )}

            {currentView === 'my-services' && (
              <motion.div
                key="my-services"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ServiceList type="my" />
              </motion.div>
            )}

            {currentView === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                <ServiceForm onSuccess={() => setCurrentView('browse')} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-2xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex justify-around items-center h-16">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('browse')}
              className={`flex flex-col items-center justify-center flex-1 min-h-touch transition-all duration-300 ${
                currentView === 'browse' ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <Home size={24} className={currentView === 'browse' ? 'fill-current' : ''} />
              <span className="text-xs mt-1 font-semibold">Browse</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('my-services')}
              className={`flex flex-col items-center justify-center flex-1 min-h-touch transition-all duration-300 ${
                currentView === 'my-services' ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <User size={24} className={currentView === 'my-services' ? 'fill-current' : ''} />
              <span className="text-xs mt-1 font-semibold">My Services</span>
            </motion.button>
          </div>
        </nav>

        {/* Floating Action Button */}
        {currentView === 'browse' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentView('create')}
            className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 flex items-center justify-center z-10"
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            aria-label="Add new service"
          >
            <Plus size={32} strokeWidth={3} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ServiceProvider>
      <AppContent />
    </ServiceProvider>
  );
}

export default App;
