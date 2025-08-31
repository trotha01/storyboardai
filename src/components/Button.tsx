import React from 'react';

interface Props {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  [key: string]: any;
}

export default function Button({ variant, children, className = '', ...rest }: Props) {
  const classes = ['btn'];
  if (variant === 'primary') classes.push('btn-primary');
  if (variant === 'ghost') classes.push('btn-ghost');
  if (className) classes.push(className);
  return (
    <button className={classes.join(' ')} {...rest}>
      {children}
    </button>
  );
}
