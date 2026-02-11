import { useToast } from '../context/ToastContext';

// MUI Components
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'info':
        return <InfoIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getSeverity = (type: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {toasts.map((toast) => (
        <Slide key={toast.id} direction="left" in={true} mountOnEnter unmountOnExit>
          <Alert
            severity={getSeverity(toast.type)}
            icon={getIcon(toast.type)}
            action={
              <IconButton
                size="small"
                onClick={() => removeToast(toast.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: 300,
            }}
          >
            {toast.message}
          </Alert>
        </Slide>
      ))}
    </Box>
  );
};

export default ToastContainer;
