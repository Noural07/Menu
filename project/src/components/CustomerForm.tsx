import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTableList } from '../hooks/useTable';
import { startOrder } from '../services/api';
import { FormCard } from './FormCard';
import { Input, Select, Button } from './FormElements';
import AnimatedBackground from './AnimatedBackground';
import { floatingAnimation, fadeIn } from '../styles/animations';

const CustomerForm: React.FC = () => {
  const { tables, loading: tablesLoading, error: tablesError } = useTableList();
  const { dispatch } = useCart();

  const [tableId, setTableId] = useState<number>();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Mouse follow effect for the logo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;
      
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableId) {
      setError('Please select a table');
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      const res = await startOrder({ tableId, customerName: name.trim() });
      
      if (!res.success || !res.data) {
        setError(res.error || 'Failed to start your order. Please try again.');
        return;
      }
      
      dispatch({ type: 'SET_ORDER_ID', payload: res.data });
      dispatch({ type: 'SET_TABLE_ID', payload: tableId });
      dispatch({ type: 'SET_CUSTOMER_NAME', payload: name.trim() });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tableOptions = [
    { value: '', label: '– Select a table –' },
    ...(tables || []).map(table => ({
      value: table.id,
      label: table.label
    }))
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Floating logo */}
      <motion.div
        className="mb-8 relative z-10"
        style={{ rotateX, rotateY, perspective: 1000 }}
        animate={floatingAnimation}
      >
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-800 mb-2"
              style={{ textShadow: '0 2px 10px rgba(255,255,255,0.3)' }}>
            Bella Cucina
          </h1>
          <p className="text-sm text-neutral-700 tracking-wider uppercase">Authentic Italian Experience</p>
        </motion.div>
      </motion.div>
      
      {/* Main form */}
      <FormCard 
        title="Welcome"
        error={error || tablesError || undefined}
        loading={tablesLoading}
      >
        {!tablesLoading && (
          <form onSubmit={handleSubmit}>
            <motion.div variants={fadeIn} custom={1} className="mb-4">
              <Select
                options={tableOptions}
                value={tableId ?? ''}
                onChange={e => setTableId(Number(e.target.value) || undefined)}
                placeholder="Select your table"
                aria-label="Table selection"
              />
            </motion.div>
            
            <motion.div variants={fadeIn} custom={2} className="mb-6">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                aria-label="Your name"
              />
            </motion.div>
            
           <motion.div variants={fadeIn} custom={3}>
   <Button 
     type="submit"
     variant="primary"
     loading={submitting}
     disabled={submitting}
     className="w-full bg-[#8B0000]" // Tilføj baggrundsfarven her
   >
     Start ordering
   </Button>
</motion.div>

          </form>
        )}
      </FormCard>
      
      {/* Footer note */}
      <motion.p 
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={5}
        className="mt-6 text-sm text-neutral-600 text-center max-w-xs"
      >
        Our staff will be with you shortly after you submit your information.
      </motion.p>
    </div>
  );
};

export default CustomerForm;