"use client";
import { Toaster } from "../ui/toaster";
import Header from "./Header";
import { Web3Provider } from "@/provider/Web3Provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3Provider>
      <Header />
      {children}
      <Toaster />
    </Web3Provider>
  );
}
