import Link from "next/link";
import { TypographyH3 } from "@/components/ui/typography";

const poolId = "123";

const Stake = () => {
  return (
    <div className="z-10 flex flex-col items-center">
      <div>
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
      </div>
    </div>
  );
};

export default Stake;
