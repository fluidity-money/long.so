import { useWriteContract as baseUseWriteContract } from "wagmi";
import { useErrorReportingStore } from "@/stores/useErrorReport";
import { useCallback } from "react";

export default function useWriteContract() {
  const {
    writeContractAsync: baseWriteContractAsync,
    writeContract,
    ...props
  } = baseUseWriteContract();
  const setIsOpen = useErrorReportingStore((s) => s.setIsOpen);
  const setError = useErrorReportingStore((s) => s.setError);

  const handleError = useCallback(
    function (error: unknown) {
      if (error instanceof Error && error.message.includes("User rejected"))
        return;
      setError(error);
      setIsOpen(true);
    },
    [setError, setIsOpen],
  );

  const writeContractAsync = useCallback<typeof baseWriteContractAsync>(
    async function (props) {
      try {
        return await baseWriteContractAsync(props);
      } catch (error) {
        handleError(error);
        return "0x";
      }
    },
    [baseWriteContractAsync, handleError],
  );

  return {
    ...props,
    // do not export a sync write to be able to handle error
    // writeContract,
    writeContractAsync,
  };
}
