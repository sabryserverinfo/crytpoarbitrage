import * as React from "react"
import { cn } from "../../utils/cn"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  // Si className contient nos classes visuelles personnalisées, on applique les styles inline
  if (className && className.includes('enhanced-card')) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.9) 0%, rgba(46, 49, 57, 0.8) 100%)',
          border: '1px solid rgba(247, 147, 26, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          ...style
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#f7931a';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(247, 147, 26, 0.3)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.2)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        {...props}
      />
    )
  }
  
  if (className && className.includes('stat-card')) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.95) 0%, rgba(46, 49, 57, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          ...style
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.4)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(247, 147, 26, 0.2)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        {...props}
      />
    )
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl text-white shadow-[0_10px_30px_-15px_rgba(0,163,255,0.35)] backdrop-blur-sm",
        "[background:linear-gradient(#0B1124,#0B1124)_padding-box,linear-gradient(135deg,#0033AD,#00A3FF)_border-box] border border-transparent",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
