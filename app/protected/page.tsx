import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: { username }, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  console.log("Username in protected page: ", username);
  console.log("Error in protected page: ", error);
  // console.log("User: ", user);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 border-2 border-green-500">

    </div>
  );
}



{/* <div className="flex flex-col gap-2 items-start">
  <h2 className="font-bold text-2xl mb-4">Your user details</h2>
  <p className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
    {/* {JSON.stringify(user, null, 2)} */}
    // { username }
  // </p>
// </div>
{/* <div> */}
  // <h2 className="font-bold text-2xl mb-4">Next steps</h2>
  // <FetchDataSteps />
// </div> */}