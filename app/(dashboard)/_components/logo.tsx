"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
const Logo = () => {
  const { theme } = useTheme();
  return (
    <Link href="/">
<<<<<<< HEAD
      <Image
        height={130}
        width={130}
        alt="logo"
        src={theme == "dark" ? "/LPC_Logo_black.png" : "/LPC_Logo_white.png"}
      />
=======
      <Image height={130} width={130} alt="logo" src="/LPC_Logo_white.png" />
>>>>>>> 8b13b57 (commit)
    </Link>
  );
};
export default Logo;
