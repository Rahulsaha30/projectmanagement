import * as React from "react";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";

export interface CustomButtonProps extends ButtonProps {
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} {...props}>
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "Button";

export { CustomButton as Button };
export default CustomButton;
