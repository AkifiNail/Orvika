"use client"    
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';


export default function general() {
    return ( 
       <div className="flex flex-col h-screen bg-gray-100">
        <div className="h-1/3 relative  flex flex-col justify-end ml-8">
        <div className="flex justify-between ">
            <div className="">
                <p className="mb-5">Données issue d'une seule équipe</p>
                <h1 className="text-6xl">Tableau de bord</h1>
            </div>
            <div className="mr-8 mt-10">
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="perso1">Open <ChevronDown /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="{position}" >
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

            </div>

        </div>  
         
        </div>
        <div className="h-2/3">

        </div>
       </div>
    );

}