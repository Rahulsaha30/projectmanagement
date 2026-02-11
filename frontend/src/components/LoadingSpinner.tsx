import CircularProgress from '@mui/material/CircularProgress';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32
};

const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  return (
    <CircularProgress size={sizeMap[size]} />
  );
};

export default LoadingSpinner;
