"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "./components/Navbar";

const ClientLayout = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <Navbar></Navbar>
        {children}
      </QueryClientProvider>
    </>
  );
};

export default ClientLayout;
