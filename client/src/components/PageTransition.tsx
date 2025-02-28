import React from 'react'
import "./PageTransition.scss";

export default function PageTransition({ children } : { children: React.ReactNode}) {
  return (
    <div className="page-transition">
      {children}
    </div>
  )
}
