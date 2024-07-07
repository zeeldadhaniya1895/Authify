import Header from "@/components/auth/header";
import BackButton from "@/components/auth/back-button";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "../ui/card"
import { TriangleAlert } from "lucide-react";

export default function ErrorCard() {
  return (
    <Card className="w-[400px] shadow-md">
        <CardHeader>
        <span className="text-destructive"><Header label="OOps! Something went wrong!"/></span>

        </CardHeader>
        <div className="flex justify-center items-center text-destructive mb-2 ">< TriangleAlert/></div>
        <CardFooter>
            <BackButton
                label="Back to login"
                href="/auth/login"
        />
        </CardFooter>
    </Card>
  )
}
