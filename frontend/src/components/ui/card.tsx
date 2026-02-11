import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import type { CardProps, CardContentProps, CardHeaderProps, CardActionsProps } from "@mui/material";

const CustomCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <Card ref={ref} {...props}>
        {children}
      </Card>
    );
  }
);

CustomCard.displayName = "Card";

const CustomCardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subheader, ...props }, ref) => {
    return (
      <CardHeader
        ref={ref}
        title={title}
        subheader={subheader}
        {...props}
      />
    );
  }
);

CustomCardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, ...props }, ref) => {
    return (
      <Typography variant="h5" component="h2" ref={ref} {...props}>
        {children}
      </Typography>
    );
  }
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, ...props }, ref) => {
    return (
      <Typography variant="body2" color="text.secondary" ref={ref} {...props}>
        {children}
      </Typography>
    );
  }
);

CardDescription.displayName = "CardDescription";

const CustomCardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardContent ref={ref} {...props}>
        {children}
      </CardContent>
    );
  }
);

CustomCardContent.displayName = "CardContent";

const CustomCardFooter = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardActions ref={ref} {...props}>
        {children}
      </CardActions>
    );
  }
);

CustomCardFooter.displayName = "CardFooter";

export {
  CustomCard as Card,
  CustomCardHeader as CardHeader,
  CustomCardContent as CardContent,
  CustomCardFooter as CardFooter,
  CardTitle,
  CardDescription,
};
