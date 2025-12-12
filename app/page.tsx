
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "@/lib/authClient";
import { requireAuth } from "@/module/auth/utils/authUtills";
import Logout from "@/module/auth/components/logout";

export default async function Home() {

  await requireAuth();
  return (
    <div className="flex items-center justify-center h-screen">
      <Logout><Button>Logout</Button></Logout>
    </div>
  );
}
