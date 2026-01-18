
import { Button } from "@/components/ui/button";
import { requireNoAuth } from "@/module/auth/utils/authUtills";
import Logout from "@/module/auth/components/logout";
import { redirect } from "next/navigation";
import HeroSection from "@/components/hero-section";

export default async function Home() {

  
  
  return (
    <>
      <HeroSection />
    </>
  );
}
