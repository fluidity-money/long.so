"use client";

import Link from "next/link";
import { TypographyH3 } from "@/components/ui/typography";
import { motion } from "framer-motion";

const Stake = () => {
  return (
    <div className="z-10 flex flex-col items-center">
      <motion.div
        layoutId="modal"
        className="flex w-[500px] flex-col gap-4 rounded-lg bg-black p-4 pt-0 text-white"
      >
        <TypographyH3>Manage Pools</TypographyH3>
        <ul>
          <Link href={`/stake/pool/123`}>
            <li>123</li>
          </Link>
        </ul>
        <ul>
          <Link href={`/stake/pool/456`}>
            <li>456</li>
          </Link>
        </ul>
      </motion.div>
    </div>
  );
};

export default Stake;
