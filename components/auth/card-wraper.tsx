"use client"

import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "../ui/card"
import Header from "./header";
import Social from "./Social";
import BackButton from "./back-button";

interface CardWraperProps {
    children: React.ReactNode;
    headrLable: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWraper = ({
    children,
    headrLable,
    backButtonLabel,
    backButtonHref,
    showSocial,
}: CardWraperProps) => {
    return (
        <Card className="w-[400px] shadow-md" >
            <CardHeader>
                <Header label={headrLable} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>

        </Card>
    )
}