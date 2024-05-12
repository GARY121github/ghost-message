"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const session = useSession()
    const user: User = session.data?.user;
    const onSignOutHandler = async () => {
        signOut({ redirect: true, callbackUrl: '/' })
    }
    return (
        <header className="relative text-white p-4">
            <nav className='fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-gray-800'>
                <Link href='/'>
                    <p className="text-white text-center text-3xl font-bold">Ghost Messenger</p>
                </Link>
                {
                    !user ? (
                        <div className='flex items-center gap-5'>
                            <Link href='/sign-in'>
                                <Button
                                    variant="outline"
                                    className='bg-white text-black hover:bg-slate-200'>
                                    Login
                                </Button>
                            </Link>
                            <Link href='/sign-up'>
                                <Button className='bg-white text-black hover:bg-slate-200'>Sign Up</Button>
                            </Link>
                        </div>
                    ) : (
                        <Button
                            className="bg-white hover:bg-slate-200 text-black"
                            onClick={onSignOutHandler}
                        >Sign Out</Button>
                    )
                }
            </nav>
        </header>
    )
}

export default Navbar