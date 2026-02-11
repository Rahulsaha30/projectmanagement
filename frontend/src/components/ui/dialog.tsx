import * as React from "react";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <Dialog 
        open={open} 
        onClose={() => onOpenChange(false)}
        maxWidth="sm"
        fullWidth
      >
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
};

const DialogTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const CustomDialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return (
    <DialogContent className={className}>
      {children}
    </DialogContent>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <MuiDialogTitle sx={className ? { className } : undefined}>
      {children}
    </MuiDialogTitle>
  );
};

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <DialogActions className={className}>
      {children}
    </DialogActions>
  );
};

const DialogTitleText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Typography variant="h6" component="h2">
      {children}
    </Typography>
  );
};

const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  );
};

export {
  CustomDialog as Dialog,
  DialogTrigger,
  CustomDialogContent as DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitleText as DialogTitle,
  DialogDescription,
};
