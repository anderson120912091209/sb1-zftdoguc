import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';

const Hero: React.FC = () => {
  const { user, profile } = useAuth();
  
  // Check if user is logged in but doesn't have a complete profile
  const needsOnboarding = user && !profile;
  
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container-custom mx-auto relative">
        {/* Add the prominent CTA for users who need to complete their profile */}
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-4 rounded-lg border border-cosmic-purple bg-deep-space/80 backdrop-blur-md shadow-lg"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-cosmic-purple/20 p-2">
                  <UserPlus className="w-6 h-6 text-cosmic-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stellar-blue">完成您的資料</h3>
                  <p className="text-star-white/80">填寫您的信息以找到您的夢幻團隊</p>
                </div>
              </div>
              <Link 
                to="/onboarding" 
                className="btn btn-primary whitespace-nowrap"
              >
                完成設定
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl relative z-10"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-cosmic-purple/30 bg-deep-space/50 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-nova-mint mr-2" />
              <span className="text-sm">台灣創新者社群平台</span>
            </div>
            
            <h1 className="font-bold leading-tight mb-6 text-6xl md:text-7xl">
              <span className="gradient-text">抱團Vibe</span>
            </h1>
            
            <h1 className="gap-5 font-bold text-4xl md:text-4xl mt-4">
              找項目 • 找團隊 • 找資金
            </h1>
            
            <p className="gap-5 text-xl md:text-1xl mb-8 mt-6 text-star-white/80">
              有想法，缺人脈?....來抱團，我們幫你找！
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                needsOnboarding ? (
                  <motion.div 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/onboarding" className="flex items-center">
                      設定您的資料
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/teams" className="flex items-center">
                      探索團隊
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </motion.div>
                )
              ) : (
                <motion.div 
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/auth/signup" className="flex items-center">
                    立刻開始
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
              )}
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
                ['0', '活躍用戶'],
                ['0', '成功項目'],
                ['0', '投資人'],
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
              
              
              {/* Floating Elements */}
              
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;