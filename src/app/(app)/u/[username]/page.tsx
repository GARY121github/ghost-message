"use client"
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { messageSchema } from '@/schemas/message.schema'
import { Separator } from '@/components/ui/separator'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const SendMessage = () => {
  const pathname = usePathname()
  const username = decodeURIComponent(pathname.split("/").pop() || "").substring(1);

  const { toast } = useToast();

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const sendMessage = async ({ content }: z.infer<typeof messageSchema>) => {
    setIsSendingMessage(true);
    try {
      await axios.post('/api/send-message', {username, content});
      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response
        ?.data?.message || error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSendingMessage(false);
    }
  }
  return (
    <div className='flex flex-col items-center justify-center gap-10'>
      <h1 className="text-4xl font-bold">
        Send a {" "}
        <span className="text-5xl text-rose-400 cursor-pointer hover:animate-ping">Ghost</span> {" "}
        <span className='text-5xl text-blue-400 cursor-pointer hover:animate-ping'>Message</span>{" "} to {" "}
        <span className="text-[#ffafcc] text-5xl underline decoration-wavy decoration-amber-500">{username.toUpperCase().split(" ")[0]}</span></h1>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(sendMessage)} className="flex gap-4 items-start w-full">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className='w-4/5'>
                <FormControl>
                  <Input
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                    placeholder="send a wonderfull message"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="secondary" type="submit">
            {
              isSendingMessage ? (
                <>
                <Loader2 className='h-4 w-4 animate-spin' /> {" "} Sending Message
                </>
              ) : "Send Message"
            }
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default SendMessage