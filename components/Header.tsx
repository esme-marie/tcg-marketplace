import type { NextComponentType, NextPageContext } from "next";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import Logo from "../assets/images/Logo.svg";
import { poppins } from "@/assets/fonts";

interface Props {
  Logo: any;
}

const Header: NextComponentType<NextPageContext, {}, Props> = (
  _props: Props
) => {
  return (
    <div className={styles.header}>
      <div className={poppins.className}>
        <span className={styles.title}>TCG Marketplace</span>
      </div>
      <div className={styles.logo_container}>
        <div className={styles.logo}>
          <Image src={Logo} alt={"pokemon"} />
        </div>
      </div>
    </div>
  );
};

export default Header;
