import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container-custom mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left relative z-10"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-cosmic-purple/30 bg-deep-space/50 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-nova-mint mr-2" />
              <span className="text-sm">台灣最大的創新者社群平台</span>
            </div>
            
            <h1 className="font-bold leading-tight mb-6">
              <span className="gradient-text">團結 · 創新</span>
              <br />共創未來
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-star-white/80 max-w-xl mx-auto lg:mx-0">
              抱團Vibe 是你的終極平台：探索黑客松、連結投資人、組建夢幻隊伍
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a 
                href="#signup"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                立刻開始
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
              <motion.a 
                href="#explore" 
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                探索最新活動
              </motion.a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                ['1,000+', '活躍用戶'],
                ['50+', '成功項目'],
                ['100+', '投資人'],
              ].map(([number, label], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{number}</div>
                  <div className="text-sm text-star-white/60">{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-cosmic opacity-20 blur-3xl rounded-full" />
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Team collaboration" 
                className="rounded-2xl shadow-2xl gradient-border"
              />
              
              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-10 -right-10 glass-card p-4 shadow-glow"
              >
                <div className="text-sm">
                  <span className="text-nova-mint">+500</span> 新用戶加入
                </div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 15, 0],
                  x: [0, -10, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -bottom-10 -left-10 glass-card p-4 shadow-blue-glow"
              >
                <div className="text-sm">
                  <span className="text-stellar-blue">98%</span> 滿意度
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;