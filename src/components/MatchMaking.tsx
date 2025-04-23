import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatchMaking: React.FC = () => {
  return (
    <section id="matchmaking" className="section bg-gradient-primary">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Find Your Perfect Team</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Connect with talented developers, designers, and product managers who share your vision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 flex flex-col items-center text-center"
          >
            <div className="mb-6 p-4 rounded-full bg-cosmic-purple text-white">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
            <p className="text-white/70 mb-6">
              Share your skills, interests, and experience to find the best matches
            </p>
            <Link to="/profile" className="btn btn-secondary mt-auto">
              Setup Profile
            </Link>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 flex flex-col items-center text-center"
          >
            <div className="mb-6 p-4 rounded-full bg-cosmic-purple text-white">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Browse Candidates</h3>
            <p className="text-white/70 mb-6">
              Filter by skills, goals, and expertise level to find the perfect match
            </p>
            <Link to="/teams" className="btn btn-primary mt-auto">
              Find Team Members
            </Link>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-8 flex flex-col items-center text-center"
          >
            <div className="mb-6 p-4 rounded-full bg-cosmic-purple text-white">
              <ThumbsUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Connect & Collaborate</h3>
            <p className="text-white/70 mb-6">
              Send match requests, start chatting, and begin working together
            </p>
            <button className="btn btn-secondary mt-auto" disabled>
              Coming Soon
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MatchMaking; 