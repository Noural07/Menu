import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../styles/theme';
import { Loader2 } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="relative"
      >
        <input
          className={`w-full px-4 py-3 bg-white/70 backdrop-blur-sm 
            border border-neutral-200 rounded-lg shadow-sm
            focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700
            transition-all duration-200 ease-out
            placeholder:text-neutral-400 ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </motion.div>
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number, label: string }>;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  options,
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="relative"
      >
        <select
          className={`w-full px-4 py-3 bg-white/70 backdrop-blur-sm 
            border border-neutral-200 rounded-lg shadow-sm appearance-none
            focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700
            transition-all duration-200 ease-out ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </motion.div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  
  const variantStyles = {
    primary: `bg-primary-800 text-white hover:bg-primary-700 active:bg-primary-900 disabled:bg-primary-800/60 focus:ring-primary-700/50`,
    secondary: `bg-secondary-500 text-white hover:bg-secondary-400 active:bg-secondary-600 disabled:bg-secondary-500/60 focus:ring-secondary-500/50`,
    outline: `bg-transparent border border-primary-800 text-primary-800 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-700/30`,
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>Loading...</span>
        </>
      ) : children}
    </motion.button>
  );
};