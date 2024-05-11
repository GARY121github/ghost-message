'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import {  useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
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
import { signInSchema } from "@/schemas/signIn.schema"
import { signIn } from "next-auth/react"

const loginUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // implementing zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  // api call to login user
  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false
    })

    if(result?.error){
      toast({
        title: "Login Failed",
        description: "Invalid credentials" + result.error,
        variant: "destructive"
      })
    }

    if(result?.url){
      toast({
        title: "Login Success",
        description: "You are now logged in"
      })
      router.replace('/dashboard');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-6 bg-black">
      <div className="p-4 w-[40%]">
        <div className="flex flex-col items-center justify-center gap-3 text-white">
          <h1 className="text-4xl font-bold text-center text-balance">Ghost Messenger</h1>
          <Bot className="animate-spin" />
          <p className="text-center mt-2 text-lg">Login to account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-white">
            <FormField
              control={form.control}
              name="identifier"
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
                    <Input type="password" placeholder="password" {...field} className="text-black"/>
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
                ) : ("Login")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <Button 
          className="w-full"
          onClick={() => signIn('google')}
          >
           <img src="/google.svg" alt="google" className="h-5 w-5 mr-2" /> SignIn with Google
          </Button>
        </div>
        <div className="text-center mt-4">
          <p className="text-white">
            Create a new account ?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-600">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default loginUser
