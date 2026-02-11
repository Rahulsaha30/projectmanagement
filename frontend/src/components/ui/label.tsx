import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import type { InputLabelProps } from "@mui/material/InputLabel";

const Label = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <InputLabel ref={ref} {...props}>
        {children}
      </InputLabel>
    );
  }
);

Label.displayName = "Label";

export { Label };
export default Label;
