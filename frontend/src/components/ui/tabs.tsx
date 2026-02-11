import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const TabsComponent: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <Box className={className}>{children}</Box>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  const { value, onValueChange } = useTabs();
  
  const tabs = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === TabsTrigger) {
      return <Tab {...child.props} />;
    }
    return null;
  });

  const tabValues = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return child.props.value;
    }
    return null;
  }) || [];

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onValueChange(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      className={className}
      variant="fullWidth"
    >
      {tabs}
    </Tabs>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  return <Tab value={value} label={children} />;
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ value: contentValue, children, className }) => {
  const { value } = useTabs();
  
  if (value !== contentValue) {
    return null;
  }

  return <Box className={className}>{children}</Box>;
};

export { TabsComponent as Tabs, TabsList, TabsTrigger, TabsContent };
