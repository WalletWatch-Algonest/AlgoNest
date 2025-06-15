"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,   // ✅ Add this
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "./ui/drawer";
const CreateAccountDrawer=({children})=> {

const [open,setOpen]=useState(false);

 return (
 <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Create New Account</DrawerTitle>
    </DrawerHeader>
    <div>
      <form>
        
      </form>
    </div>
    
  </DrawerContent>
</Drawer>
    );
};
export default CreateAccountDrawer