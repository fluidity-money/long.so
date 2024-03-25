import Link from "next/link";

export default function SequenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <ul className="z-10 mb-6 text-2xs">
        <Link href={"/swap/sequence/enable-spending"}>
          <li>Enable Spending USDC</li>
        </Link>
        <Link href={"/swap/sequence/allow-swapping"}>
          <li>Allow USDC for Swapping</li>
        </Link>
        <Link href={"/swap/sequence/confirm-swap"}>
          <li>Confirm Swap</li>
        </Link>
        <Link href={"/swap/sequence/fail"}>
          <li>Fail</li>
        </Link>
        <Link href={"/swap/sequence/pending"}>
          <li>Pending</li>
        </Link>
        <Link href={"/swap/sequence/success"}>
          <li>Success</li>
        </Link>
      </ul>

      {children}
    </div>
  );
}
