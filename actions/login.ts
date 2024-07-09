"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>,callbackUrl?:string|null) => {
    const validatesFields = LoginSchema.safeParse(values);
    if (!validatesFields.success) {
        return { error: "invalid fields!" };
    }

    const { email, password, code } = validatesFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "User does not exist!" }
    }
    const passwordsMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordsMatch) {
        return { error: "Wrong password!" }
    }

    if (!existingUser.emailVerified) {

        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )
        return { success: "Confirmation email sent!" }

    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken) {
                return { error: "Invalid Token!" }
            }
            if (twoFactorToken.token !== code) {
                return { error: "Invalid Token!" }
            }
            const hasExpire = new Date(twoFactorToken.expires) < new Date();

            if (hasExpire) {
                return { error: "Token expired" }
            }
            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id },
            })
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        }
        else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            )
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email, password, redirectTo: callbackUrl|| DEFAULT_LOGIN_REDIRECT,
        })//aa same rite google mate pan lakhi sakay pan google vadu client side karva mate alag thi karel 6
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": return { error: "Invalid credentials!" }
                default: {
                   
                    return { error: "Something went wrong!" }
                }
            }
        }
        throw error; // throw karvi jaruri nakar tamne default page upar redirect nai kare
    }
    return { success: "login success" }
}