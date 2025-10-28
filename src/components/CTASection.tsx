import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useRef } from 'react';

export const CTASection: React.FC = () => {
  const title = 'Let’s Connect';
  const description = 'Have questions or want to work together? Reach out and we’ll get back to you soon.';

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: 'hello@company.com',
      href: 'mailto:hello@company.com',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Address',
      value: 'San Francisco, CA',
      href: '#',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-24 px-6 bg-gradient-to-b from-zinc-50 to-white overflow-hidden"
    >
      {/* Subtle background gradient shapes */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(147,197,253,0.25),transparent_50%)]" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_bottom_left,rgba(216,180,254,0.2),transparent_60%)]" />

      <div className="relative container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Contact Form */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-zinc-900 mb-6">
              Send us a message
            </h3>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all duration-200"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <div>
              <h3 className="text-2xl font-semibold text-zinc-900 mb-4">
                Get in touch
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                We’d love to hear from you. Whether you have a question, idea, or project — our team is just one message away.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="flex items-center p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-zinc-200 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-md text-white bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 text-base">{item.label}</div>
                    <div className="text-zinc-600 group-hover:text-zinc-800 transition-colors">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
