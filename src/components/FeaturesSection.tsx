import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bike, BookOpen, Home, Wrench, Shield, Users } from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>; // Fix typing
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeaturesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const features: Feature[] = [
    {
      icon: Bike,
      title: 'Bike Services',
      description: 'Find reliable bike repair and maintenance services near you. Quick, professional, and hassle-free.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.2,
    },
    {
      icon: BookOpen,
      title: 'Tuition Services',
      description: 'Connect with qualified tutors for personalized learning experiences across various subjects.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.3,
    },
    {
      icon: Home,
      title: 'Room Rentals',
      description: 'Discover comfortable and affordable rooms with verified listings and detailed information.',
      color: 'from-orange-500 to-red-500',
      delay: 0.4,
    },
    {
      icon: Wrench,
      title: 'Easy Management',
      description: 'Simple tools to list, manage, and track your services. Perfect for service providers.',
      color: 'from-green-500 to-emerald-500',
      delay: 0.5,
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your security is our priority. All transactions and communications are protected.',
      color: 'from-indigo-500 to-purple-500',
      delay: 0.6,
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Build trust with verified reviews and ratings from our active community members.',
      color: 'from-pink-500 to-rose-500',
      delay: 0.7,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={containerRef} className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-50" />

      <div className="container mx-auto max-w-6xl relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need
          </motion.h2>
          <motion.p
            className="text-zinc-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our comprehensive platform features designed to make service sharing simple and secure
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 transition-shadow border border-indigo-100"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
