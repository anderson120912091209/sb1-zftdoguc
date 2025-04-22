import React from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Users, BookOpen } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="glass-card p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-card"
    >
      <div className="mb-6 p-4 rounded-full bg-gradient-primary text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "發現黑客松",
      description: "搜索海內外線上/線下賽事，參與最熱門的創新活動",
      delay: 0.1,
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "投資人媒合",
      description: "精準對接早期投資人，讓你的創意獲得資金支持",
      delay: 0.2,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "隊友配對",
      description: "基於技能、興趣與時區，找到最合適的開發夥伴",
      delay: 0.3,
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "資源中心",
      description: "教程、開源項目、社群文章，一站式獲取所有資源",
      delay: 0.4,
    },
  ];

  return (
    <section id="features" className="section bg-dark-blue">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">專為創新者打造的平台</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            抱團Vibe 提供所有你需要的功能，幫助你從創意走向成功
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;