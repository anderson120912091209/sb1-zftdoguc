import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingPlanProps {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  isPro?: boolean;
  delay: number;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  features,
  buttonText,
  isPro = false,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-8 ${
        isPro
          ? 'border-neon-mint transform scale-105 z-10'
          : 'border-white/10'
      }`}
    >
      {isPro && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neon-mint text-dark-blue px-4 py-1 rounded-full text-sm font-bold">
          最受歡迎
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
      <div className="text-center mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Contact us' && <span className="text-white/60">/月</span>}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-neon-mint shrink-0 mr-2 mt-0.5" />
            <span className="text-white/80">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="text-center">
        <a
          href="#pricing-action"
          className={`btn ${
            isPro ? 'btn-primary' : 'btn-secondary'
          } w-full`}
        >
          {buttonText}
        </a>
      </div>
    </motion.div>
  );
};

const Pricing: React.FC = () => {
  const plans = [
    {
      title: 'Free',
      price: '0 TWD',
      features: [
        '基本黑客松搜索',
        '社群聊天室',
        '個人檔案',
        '公開活動參與',
      ],
      buttonText: '免費註冊',
      isPro: false,
      delay: 0.1,
    },
    {
      title: 'Pro',
      price: '499 TWD',
      features: [
        '投資人媒合',
        '高級搜索過濾',
        '團隊管理工具',
        '優先客服支援',
        '專屬社群活動',
      ],
      buttonText: '立即升級',
      isPro: true,
      delay: 0.2,
    },
    {
      title: 'Enterprise',
      price: 'Contact us',
      features: [
        'API 接入',
        '白標解決方案',
        '專屬顧問服務',
        '客製化功能',
        '無限用戶席位',
      ],
      buttonText: '聯繫我們',
      isPro: false,
      delay: 0.3,
    },
  ];

  return (
    <section id="pricing" className="section bg-gradient-primary">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">選擇最適合你的方案</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            無論你是個人創業者還是大型企業，我們都有合適的解決方案
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {plans.map((plan, index) => (
            <PricingPlan key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;