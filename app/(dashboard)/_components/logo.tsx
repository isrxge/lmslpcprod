"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
const Logo = () => {
  const { theme } = useTheme();
  return (
    <Link href="/">
      <Image height={130} width={130} alt="logo" src="/LPC_Logo_white.png" />
    </Link>
  );
};
export default Logo;
