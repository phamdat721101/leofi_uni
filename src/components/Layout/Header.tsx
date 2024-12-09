import leofiLogo from "@/assets/leofi.png";
import leofiNoTextLogo from "@/assets/leofi_notext.png";
import Link from "next/link";
import Image from "next/image";
import { WalletButton } from "../Button/WalletBtn";

export default function Header() {
  return (
    <header className="max-w-screen-2xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4 text-sm xl:text-base">
      {/* Logo */}
      <div>
        <Link href="/">
          <Image
            src={leofiLogo}
            alt="leofi logo"
            height={50}
            className="hidden sm:block"
          />
        </Link>
        <Link href="/">
          <Image
            src={leofiNoTextLogo}
            alt="leofi logo"
            className="sm:hidden object-fit"
            width={60}
          />
        </Link>
      </div>
      <WalletButton />
    </header>
  );
}
