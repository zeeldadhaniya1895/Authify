"use client"
import { CardWraper } from "./card-wraper";
import {RingLoader} from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect,useState } from "react";
import { newVerification } from "@/actions/new-verificaion";
import { FormError } from "../form-error";
import { FormSuccess } from "@/components/form-success";

export default function NewVerificationForm() {
    const [error,setError]=useState<string|undefined>();
    const[success,setSuccess]=useState<string|undefined>();


    const searchParams=useSearchParams();
    const token =searchParams.get("token");
    const onSubmit=useCallback(()=>{
        if(success||error) return;

        if(!token)
        {
            setError("missing token");
            return ;
        }
        newVerification(token)
        .then((data)=>{
            setSuccess(data.success);
            setError(data.error);
        })
    },[token,success,error])

    useEffect(()=>{
        onSubmit();
    },[onSubmit])
  return (
    <CardWraper
        headrLable="Confirm your verification"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login">
            <div className="flex items-center w-full justify-center">
            {!success&&!error && (<RingLoader />)}
            <FormSuccess message={success}/>
            {!success&&(<FormError message={error}/>)}
            
            </div>

    </CardWraper>
  )
}

