import * as React from "react";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

const Input = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        variant="outlined"
        size="small"
        fullWidth
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;
