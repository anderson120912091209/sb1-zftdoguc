import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Github, MessageCircle, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-blue pt-16 pb-8">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="w-8 h-8 text-neon-mint" />
              <span className="text-xl font-bold">抱團Vibe</span>
            </div>
            <p className="text-white/70 mb-4">
              連結台灣創新者的終極平台，幫助你找到黑客松、投資人和隊友，一起實現創意。
            </p>
          </motion.div>

          {/* Column 2: Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-4">平台</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hackathons" className="text-white/70 hover:text-neon-mint flex items-center">
                  Hackathons <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a href="#investors" className="text-white/70 hover:text-neon-mint flex items-center">
                  Investors <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a href="#teams" className="text-white/70 hover:text-neon-mint flex items-center">
                  Teams <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/70 hover:text-neon-mint flex items-center">
                  Pricing <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </li>
              <li>
                <a href="#docs" className="text-white/70 hover:text-neon-mint flex items-center">
                  Docs <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-4">社群</h4>
            <ul className="space-y-2">
              <li>
                <a href="#discord" className="text-white/70 hover:text-neon-mint flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" /> Discord
                </a>
              </li>
              <li>
                <a href="#telegram" className="text-white/70 hover:text-neon-mint flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" /> Telegram
                </a>
              </li>
              <li>
                <a href="#github" className="text-white/70 hover:text-neon-mint flex items-center">
                  <Github className="w-5 h-5 mr-2" /> GitHub
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-4">法律</h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-white/70 hover:text-neon-mint">
                  隱私政策
                </a>
              </li>
              <li>
                <a href="#terms" className="text-white/70 hover:text-neon-mint">
                  服務條款
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/60">
          <p>© 2025 抱團Vibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;