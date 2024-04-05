import CopyToClipboard from "react-copy-to-clipboard";
import { Check } from "lucide-react";
import { useAccount, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { useEffect, useState } from "react";

export const Address = () => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const [copied, setCopied] = useState(false);

  /**
   * When copied is set to true this will reset
   * the state after 2 seconds
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  return (
    <div className="flex items-center justify-center gap-1">
      <CopyToClipboard
        text={ensName ?? address ?? ""}
        onCopy={() => setCopied(true)}
      >
        {copied ? (
          <Check className="h-[8.54px] w-2 text-black" />
        ) : (
          <div className="relative h-[8.54px] w-2">
            <div className="absolute left-0 top-0 h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900" />
            <div className="absolute left-[2.10px] top-[2px] h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900 bg-gray-200" />
          </div>
        )}
      </CopyToClipboard>

      <div className="text-[10px] font-medium text-stone-900">
        {ensName ? (
          ensName
        ) : (
          <>
            {address?.slice(0, 5)} ... {address?.slice(-3)}
          </>
        )}
      </div>
    </div>
  );
};
