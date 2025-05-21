import React from 'react';
import { motion } from 'framer-motion';
import { shadows } from '../styles/theme';
import { staggerContainer, fadeIn } from '../styles/animations';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
  error?: string;
  loading?: boolean;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  children,
  error,
  loading
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full max-w-md mx-auto bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden"
      style={{
        boxShadow: shadows.glass,
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Header */}
      <motion.div
        variants={fadeIn}
        custom={0}
        className="px-8 pt-8 pb-6 border-b border-neutral-100"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
          className="text-3xl font-serif font-bold text-center text-primary-800"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.6
          }}
          className="mt-2 h-0.5 w-24 bg-secondary-400 mx-auto"
        />
      </motion.div>

      {/* Content */}
      <div className="px-8 py-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600 text-center">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center justify-center text-neutral-600"
          >
            <div className="w-12 h-12 mb-4 border-4 border-t-primary-600 border-neutral-200 rounded-full animate-spin" />
            <p>Loading...</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FormCard;

export { FormCard }