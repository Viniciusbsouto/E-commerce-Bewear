import React from "react";
import { Button } from "@/components/ui/button";

const home = () => {
  return (
    <div className="m-8 flex flex-col items-center justify-center gap-4">
      <h1 className="inline rounded-md bg-red-500 p-2 text-3xl font-bold">
        Home
      </h1>
      <Button>Clique aqui</Button>
    </div>
  );
};

export default home;
