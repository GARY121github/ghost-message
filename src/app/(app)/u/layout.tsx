"use client"
import React from 'react'

const layout = ({children}: {children : React.ReactNode}) => {
  return (
    <div className='container mx-auto px-4 flex flex-col justify-center items-center text-white bg-black h-screen'>
        {children}
    </div>
  )
}

export default layout