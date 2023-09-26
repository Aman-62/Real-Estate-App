"use client";
import {
  OrganizationSwitcher,
  SignedIn,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        {/* <Image src="assets/logo.svg" alt="logo" width={28} height={28} /> */}
        <p className="text-heading3-bold text-light-1">real-estate</p>
      </Link>

      <div className="flex items-center gap-4">
        <Link href={"/submit-property"} className="cursor-pointer text-light-1">
          Submit Property
        </Link>
        <div className="block">
          <SignedIn>
            <SignOutButton
              signOutCallback={() => {
                router.push("/sign-in");
              }}
            >
              <div className="cursor-pointer text-light-1">Sign out</div>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        /> */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};
export default Navbar;
