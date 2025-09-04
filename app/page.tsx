"use client"; 

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button
      variant={"outline"}
        className="cursor-pointer"
        onClick={() => router.push("/login")}
      >
        Welcome to Orvika
      </Button>
    </div>
  );
}
