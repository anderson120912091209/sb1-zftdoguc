import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: 1,
    title: "註冊",
    description: "填寫興趣與技能，創建個人檔案",
  },
  {
    number: 2,
    title: "探索",
    description: "搜索賽事、投資人或隊友，發現機會",
  },
  {
    number: 3,
    title: "協作",
    description: "在線洽談，組隊，提交成果",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="section bg-gradient-primary">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">如何使用 抱團Vibe</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            簡單三步驟，開始你的創新之旅
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-white/30" />

          {/* Steps */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="w-full md:w-1/3 mb-10 md:mb-0 flex flex-col items-center text-center px-4 relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-neon-mint text-dark-blue flex items-center justify-center font-bold text-2xl mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;