"use client"
import { CardWraper } from "./card-wraper";
import {RingLoader} from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect,useState } from "react";
import { newVerification } from "@/actions/new-verificaion";
import { set } from "zod";
import { FormError } from "../form-error";
import { FormSucess } from "../form-sucess";

export default function NewVerificationForm() {
    const [error,setError]=useState<string|undefined>();
    const[sucess,setSucess]=useState<string|undefined>();


    const searchParams=useSearchParams();
    const token =searchParams.get("token");
    const onSubmit=useCallback(()=>{
        if(sucess||error) return;
        if(!token)
        {
            setError("missing token");
            return ;
        }
        newVerification(token)
        .then((data)=>{
            setSucess(data.sucess);
            setError(data.error);
        })
    },[token,sucess,error])

    useEffect(()=>{
        onSubmit();
    },[onSubmit])
  return (
    <CardWraper
        headrLable="Confirm your verification"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login">
            <div className="flex items-center w-full justify-center">
            {!sucess&&!error && (<RingLoader />)}
            <FormSucess message={sucess}/>
            {!sucess&&(<FormError message={error}/>)}
            
            </div>

    </CardWraper>
  )
}

