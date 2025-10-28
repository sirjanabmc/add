
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export const TestimonialsSection: React.FC = () => {
  const title = 'What Our Users Say';
  const [isHovered, setIsHovered] = useState(false);
  
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Bike Owner',
      location: 'New York',
      content: 'Found an amazing bike repair service through this platform. Quick, professional, and very convenient!',
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Student',
      location: 'Boston',
      content: 'The tutoring services I found here helped me ace my exams. Great selection of qualified tutors!',
      avatar: 'MC',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Room Owner',
      location: 'San Francisco',
      content: 'As a landlord, I love how easy it is to list and manage my property. The platform is super intuitive.',
      avatar: 'ED',
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Service Provider',
      location: 'Chicago',
      content: 'Been offering my services here for 6 months. The platform makes it easy to connect with customers!',
      avatar: 'DW',
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section
      ref={containerRef}
      className="py-20 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="container mx-auto max-w-4xl">
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-zinc-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join thousands of satisfied users who've found the perfect services for their needs
          </motion.p>
        </motion.div>

        {/* Marquee Testimonials */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <motion.div
            className="flex gap-2"
            animate={isHovered ? {} : {
              x: [0, -100 * testimonials.length],
            }}
            transition={isHovered ? {} : {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            style={{
              width: `${200 * testimonials.length}%`,
            }}
          >
            {/* First set of testimonials */}
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="flex-shrink-0 w-80 bg-zinc-50 border border-zinc-200 rounded-lg p-6 mx-3"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-zinc-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-indigo-600 text-xs font-medium">
                      {testimonial.role}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <blockquote className="text-zinc-700 text-sm leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial) => (
              <motion.div
                key={`duplicate-${testimonial.id}`}
                className="flex-shrink-0 w-80 bg-white border border-indigo-100 rounded-lg p-6 mx-3 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg shadow-indigo-500/30">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-zinc-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-indigo-600 text-xs font-medium">
                      {testimonial.role}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <blockquote className="text-zinc-800 text-sm leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};