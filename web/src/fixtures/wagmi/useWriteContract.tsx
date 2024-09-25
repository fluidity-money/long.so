import { useWriteContract as baseUseWriteContract, Config } from "wagmi";
import { WriteContractMutateAsync } from "wagmi/query";
import { useErrorReportingStore } from "@/stores/useErrorReport";
import { useCallback } from "react";

type VariablesType<T> = T extends (variables: infer V, ...args: any[]) => void
  ? V
  : never;

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

  const writeContractAsync = useCallback(
    async function (props: VariablesType<WriteContractMutateAsync<Config>>) {
      try {
        return await baseWriteContractAsync(props);
      } catch (error) {
        handleError(error);
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
