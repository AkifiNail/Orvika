"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { motion } from "framer-motion"

import { RegisterForm } from "@/components/register-form"


export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <motion.div 
        className="flex w-full max-w-sm flex-col gap-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          staggerChildren: 0.2
        }}
      >
        <motion.a 
          href="#" 
          className="flex items-center gap-2 self-center font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
            whileHover={{ 
              rotate: 360,
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            <GalleryVerticalEnd className="size-4" />
          </motion.div>
          Orvika
        </motion.a>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <RegisterForm />
        </motion.div>
      </motion.div>
    </div>
  )
}