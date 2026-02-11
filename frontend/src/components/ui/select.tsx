import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { SelectProps } from "@mui/material/Select";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select provider");
  }
  return context;
};

interface CustomSelectProps extends Omit<SelectProps<string>, 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onValueChange, 
  children, 
  disabled,
  ...props 
}) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled }}>
      <FormControl fullWidth disabled={disabled}>
        {children}
      </FormControl>
    </SelectContext.Provider>
  );
};

const SelectTrigger: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  return <InputLabel>{placeholder}</InputLabel>;
};

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value, onValueChange, disabled } = useSelect();

  const handleChange = (event: any) => {
    onValueChange(event.target.value as string);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      displayEmpty
    >
      {children}
    </Select>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectItem: React.FC<SelectItemProps> = ({ value: itemValue, children }) => {
  return <MenuItem value={itemValue}>{children}</MenuItem>;
};

export {
  CustomSelect as Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
