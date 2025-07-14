import { getUserAccounts } from "@/actions/dashboard";
import React from "react";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/transaction-form";
// import { getTransaction } from "@/actions/transactions";

// export default async function AddTransactionPage(props) {
//   const { edit: editId } = await props.searchParams;

const AddTransactionPage=async()=>{


  const accounts = await getUserAccounts();

  // let initialData = null;
  // if (editId) {
  //   // const transaction = await getTransaction(editId);
  //   // initialData = transaction;
  // }

  return (
    <div className="max-w-3xl mx-auto px-5">
      {/* <h1 className="flex justify-center md:justify-normal mb-8"> */}
        <h1 className="text-5xl gradient-title mb-8">Add Transaction</h1>
     
    <AddTransactionForm accounts={accounts} categories={defaultCategories}/>
    {/* </h1> */}
      {/* You can render the form here using accounts and initialData if needed */}
    </div>
  );
};
export default AddTransactionPage;
