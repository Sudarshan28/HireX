import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-display font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary";
  
  const variants = {
    primary: "bg-accent-primary text-bg-primary hover:bg-accent-secondary shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]",
    secondary: "bg-bg-surface text-text-primary border border-border hover:border-accent-primary",
    danger: "bg-danger text-white hover:bg-red-600",
    outline: "border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
