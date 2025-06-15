"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,   
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from "./ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; 
import { Switch } from "@/components/ui/switch"; 
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "@/components/ui/input"; 

const CreateAccountDrawer=({children})=> {

const [open,setOpen]=useState(false);

const onSubmit =async(data)=>{
    console.log(data);
}  ;
const {register,
    handleSubmit,
    formState:{errors},
    setValue,
    watch,
    reset,
      } = useForm( {
    resolver:zodResolver(accountSchema),
    defaultValues:{
        name:"",
        type:"CURRENT",
        balance:"",
        isDefault:false,
    },
});
 return (
 <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Create New Account</DrawerTitle>
    </DrawerHeader>

    <div className="px-4 pb-4">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
         <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium" 
            >Account Name</label>
            <Input id="name" placeholder="e.g.,Main Checking"
            {...register("name")}
            />
            {errors.name &&(
                <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
         </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium" 
            >Account Type</label>
             <Select onValueChange={(value)=>setValue("type,value")}
                defaultValue={watch("type")}>
                 <SelectTrigger  id="type">
                 <SelectValue placeholder="Select Type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="CURRENT">CURRENT</SelectItem>
                 <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                
               </SelectContent>
             </Select>
             {errors.type &&(
                <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
         </div>


          <div className="space-y-2">
            <label htmlFor="balance" className="text-sm font-medium" 
            >Initial Balance</label>
            <Input id="balance" type="number" step="0.01"
            placeholder="0.00"
            {...register("balance")}
            />
            {errors.balance &&(
                <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
         </div>

         <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer" 
            >Set as default</label>
            <p className="text-sm text-muted-foreground"> This account will be selected by default for transactions</p>
            </div>
            <Switch id="isDefault"
            onCheckedChange={(checked)=>setValue("isDefault,checked")}
                defaultValue={watch("isDefault")}
              /> 
         </div>

         <div className="flex gap-4 pt-4">
            <DrawerClose asChild>
                <Button variant="outline" type="button" className="flex-1">
                    Cancel
                </Button>
            </DrawerClose>
            <Button type="submit" className="flex-1"> 
                Create Account</Button>
         </div>
      </form>
    </div>
    
  </DrawerContent>
</Drawer>
    );
};
export default CreateAccountDrawer