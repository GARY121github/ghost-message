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
import { useCompletion } from 'ai/react';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import Link from 'next/link'
const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const SendMessage = () => {
  const pathname = usePathname()
  const username = decodeURIComponent(pathname.split("/").pop() || "").substring(1);

  const { toast } = useToast();

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const sendMessage = async ({ content }: z.infer<typeof messageSchema>) => {
    setIsSendingMessage(true);
    try {
      await axios.post('/api/send-message', { username, content });
      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });
      form.setValue('content', '');
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

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

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
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 w-full"
            disabled={isSuggestLoading}
          >
            {
              isSuggestLoading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin mr-4' /> {" "} Fetching Messages
                </>
              ) : "Suggest Messages"
            }
          </Button>
          <p className='text-center'>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-center">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SendMessage