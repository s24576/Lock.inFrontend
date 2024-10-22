"use client";
import React from "react";
import Duo from "../components/team/Duo";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Duo></Duo>
    </QueryClientProvider>
  );
};

export default page;
