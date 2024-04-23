'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUp.schema"
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Bot, Loader2 } from "lucide-react"

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounce = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // implementing zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  // api call to check whether unique username
  const checkUniqueUsername = async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get(`/api/check-unique-username?username=${username}`);
        setUsernameMessage(response.data.message);

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username");
      }
      finally {
        setIsCheckingUsername(false);
      }
    }
  }



  // api call to register user
  async function onSubmit(data: z.infer<typeof signUpSchema>) {

    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("ERROR WHILE REGISTERING USER", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message ?? "Error while Registering user";
      toast({
        title: "Sign-up Failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
    finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkUniqueUsername();
  }, [username]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-6 bg-black">
      <div className="p-4 w-[40%]">
        <div className="flex flex-col items-center justify-center gap-3 text-white">
          <h1 className="text-4xl font-bold text-center text-balance">Be a Ghost Messenger</h1>
          <Bot className="animate-spin" />
          <p className="text-center mt-2 text-lg">Create an account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-white">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field}
                    className="text-black"
                      onChange={(e) => {
                        field.onChange(e)
                        debounce(e.target.value);
                      }}
                    />
                  </FormControl>
                  {
                    isCheckingUsername && <Loader2 className="animate-spin" />
                  }
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="email" {...field} className="text-black"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : ("SignUp")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-white">
            Already a member ? {' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-600">
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterUser
