import NextAuth, {AuthOptions} from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import axios from "axios";
import {authOptions} from "@/lib/auth";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};