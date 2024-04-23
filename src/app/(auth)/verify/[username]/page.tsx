"use client"

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verify.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { z } from "zod"
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

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            });
            router.replace('sign-in');
        } catch (error) {
            console.log("ERROR WHILE VERIFYING USER", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? "Error while Registering user";
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full gap-6 bg-black">
            <div className="p-4 w-[40%]">
                <div className="flex flex-col items-center justify-center gap-3 text-white">
                    <h1 className="text-4xl font-bold text-center text-balance">Verify Account</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount