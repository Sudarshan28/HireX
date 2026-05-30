import { useCountUp } from '../../hooks/useCountUp';

const AnimatedNumber = ({ value, duration = 1000, prefix = '', suffix = '' }) => {
  const count = useCountUp(value, duration);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
};

export default AnimatedNumber;
