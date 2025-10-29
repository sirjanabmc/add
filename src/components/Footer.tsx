import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
  icon: JSX.Element;
}

export const Footer: React.FC = () => {
  const companyName = "Company";
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    { name: "GitHub", href: "https://github.com", icon: <Github className="w-5 h-5" /> },
    { name: "Twitter", href: "https://twitter.com", icon: <Twitter className="w-5 h-5" /> },
    { name: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin className="w-5 h-5" /> },
    { name: "Email", href: "mailto:hello@company.com", icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-zinc-900 dark:bg-zinc-950 text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h2 className="font-bold text-2xl text-white mb-2">{companyName}</h2>
            <p className="text-zinc-400 text-sm">
              © {currentYear} {companyName}. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800/70 dark:hover:bg-zinc-700/70 rounded-full flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-zinc-700/50 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-zinc-400 text-sm hover:text-zinc-200 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Made with ❤️ by {companyName}. Powered by Next.js and Tailwind CSS.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};
