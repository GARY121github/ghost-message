"use client"
 import React from 'react'

 interface layoutProps{
    children: React.ReactNode
 }
 
 const layout:React.FC<layoutProps> = ({children}) => {
   return (
     <div className="flex flex-col items-center h-screen justify-center bg-black text-white">
        {children}
     </div>
   )
 }
 
 export default layout