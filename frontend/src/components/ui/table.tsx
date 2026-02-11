import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const CustomTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table ref={ref} {...props}>
          {children}
        </Table>
      </TableContainer>
    );
  }
);

CustomTable.displayName = "Table";

const CustomTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableHead ref={ref} {...props}>
        {children}
      </TableHead>
    );
  }
);

CustomTableHeader.displayName = "TableHeader";

const CustomTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableBody ref={ref} {...props}>
        {children}
      </TableBody>
    );
  }
);

CustomTableBody.displayName = "TableBody";

const CustomTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableRow ref={ref} {...props}>
        {children}
      </TableRow>
    );
  }
);

CustomTableRow.displayName = "TableRow";

const CustomTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableCell ref={ref} component="th" {...props}>
        {children}
      </TableCell>
    );
  }
);

CustomTableHead.displayName = "TableHead";

const CustomTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableCell ref={ref} {...props}>
        {children}
      </TableCell>
    );
  }
);

CustomTableCell.displayName = "TableCell";

export {
  CustomTable as Table,
  CustomTableHeader as TableHeader,
  CustomTableBody as TableBody,
  CustomTableRow as TableRow,
  CustomTableHead as TableHead,
  CustomTableCell as TableCell,
};
