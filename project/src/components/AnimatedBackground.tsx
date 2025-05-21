import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../styles/theme';
import { blobAnimation } from '../styles/animations';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-75">
      {/* Primary color blob */}
      <motion.div
        initial={blobAnimation.initial}
        animate={blobAnimation.animate}
        className="absolute -top-20 -left-20 w-[30rem] h-[30rem] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${colors.primary[700]} 0%, ${colors.primary[800]} 70%, transparent 100%)`,
        }}
      />
      
      {/* Secondary color blob */}
      <motion.div
        initial={blobAnimation.initial}
        animate={{
          ...blobAnimation.animate,
          transition: {
            ...blobAnimation.animate.transition,
            delay: 1.5,
          },
        }}
        className="absolute -bottom-24 -right-24 w-[35rem] h-[35rem] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${colors.secondary[400]} 0%, ${colors.secondary[500]} 70%, transparent 100%)`,
        }}
      />
      
      {/* Small accent blob */}
      <motion.div
        initial={blobAnimation.initial}
        animate={{
          ...blobAnimation.animate,
          transition: {
            ...blobAnimation.animate.transition,
            delay: 3,
          },
        }}
        className="absolute top-1/3 -right-12 w-[18rem] h-[18rem] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${colors.primary[400]} 0%, ${colors.primary[500]} 70%, transparent 100%)`,
        }}
      />
      
      {/* Small gold blob */}
      <motion.div
        initial={blobAnimation.initial}
        animate={{
          ...blobAnimation.animate,
          transition: {
            ...blobAnimation.animate.transition,
            delay: 4.5,
          },
        }}
        className="absolute bottom-1/4 -left-12 w-[15rem] h-[15rem] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${colors.secondary[300]} 0%, ${colors.secondary[400]} 70%, transparent 100%)`,
        }}
      />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/5" />
    </div>
  );
};

export default AnimatedBackground;