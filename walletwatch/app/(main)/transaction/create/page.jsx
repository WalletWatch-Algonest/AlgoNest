import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
// import { getTransaction } from "@/actions/transactions";

export default async function AddTransactionPage(props) {
  const { edit: editId } = await props.searchParams;

  const accounts = await getUserAccounts();

  let initialData = null;
  if (editId) {
    // const transaction = await getTransaction(editId);
    // initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title">Add Transaction</h1>
      </div>

      {/* You can render the form here using accounts and initialData if needed */}
    </div>
  );
}
