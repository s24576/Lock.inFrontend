"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "sonner";

const ClientLayout = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <Toaster richColors position="top-center"></Toaster>
        <Navbar></Navbar>
        {children}
      </QueryClientProvider>
    </>
  );
};

export default ClientLayout;
