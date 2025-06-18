import React from "react";
import {  
        Card,
        CardContent,
        CardHeader,
        CardFooter,
        CardTitle,
       } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
const  AccountCard= ({ account })=> {
  const { name,type,balance,id,isDefault}=account;

  return (
    <Card>
  <CardHeader>
    <CardTitle>{name}</CardTitle>
    <Switch/>
    
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">${parseFloat(balance).toFixed(2)}</div>
    <p className="text-xs text-muted-foreground capitalize">{type.charAt(0)+type.slice(1).toLowerCase()}Account</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
  );
};

export default AccountCard;
