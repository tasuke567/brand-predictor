// src/components/ui/card.tsx
import * as React from "react";
import clsx from "clsx";                 // ถ้าไม่มี cn ใช้ clsx แทน
import styles from "./card.module.css";  // <-- CSS-Module

/* -------------------------------------------------- */
/* 🃏 Base Card                                       */
/* -------------------------------------------------- */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.card, className)} {...props} />
));
Card.displayName = "Card";

/* -------------------------------------------------- */
/* 🏷️  Sub-parts                                      */
/* -------------------------------------------------- */
const CardHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header ref={ref} className={clsx(styles.header, className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={clsx(styles.title, className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={clsx(styles.description, className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.content, className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.footer, className)} {...props} />
));
CardFooter.displayName = "CardFooter";

/* -------------------------------------------------- */
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
