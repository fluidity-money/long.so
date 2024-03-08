import { Box, Input, Text, Token } from "@/components";
import { Button } from "@/components/ui/button";
import Search from "@/assets/icons/Search.svg";
import { TokenList } from "@/util/tokens";
import { ActiveModalToken } from "@/util/types";
import { useActiveTokenStore } from "@/stores/useActiveTokenStore";
import create from "zustand";

interface ModalStore {
  // whether the modal is enabled
  enabled: boolean;
  // to disable the modal
  disable: () => void;
  activeModalToken?: ActiveModalToken;
  setActiveModalToken: (activeModalToken?: ActiveModalToken) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  enabled: false,
  disable: () => set({ enabled: false }),
  activeModalToken: undefined,
  setActiveModalToken: (activeModalToken) =>
    set({ activeModalToken, enabled: true }),
}));

export const TokenModal = () => {
  const { setToken0, setToken1 } = useActiveTokenStore();

  const { enabled, disable, setActiveModalToken, activeModalToken } =
    useModalStore();

  const setToken = activeModalToken === "token0" ? setToken0 : setToken1;

  if (!enabled) return null;

  return (
    <div className="flex flex-col items-center">
      <Box size="large" className="flex max-w-screen-sm flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <Text>Select Token</Text>
          <Button color="light" onClick={() => setActiveModalToken(undefined)}>
            <Text>Esc</Text>
          </Button>
        </div>
        <Text>Filter</Text>
        <Text className="flex flex-row items-center justify-between border-b pb-2">
          <Input
            value=""
            onChange={() => {
              return;
            }}
            placeholder="e.g. Ether, ARB, 0x0bafe8babf38bf3ba83fb80a82..."
          />
          <Search height={22} />
        </Text>
        {/* Placeholders */}
        <Text>Highest Rewarders</Text>
        <div className="flex flex-row gap-2">
          {TokenList.map((token, i) => (
            <Box
              key={i}
              outline
              pill
              background="light"
              onClick={() => {
                setToken(token.address);
                disable();
              }}
            >
              <Token />
              <Text weight="semibold">{token.symbol}</Text>
            </Box>
          ))}
        </div>
      </Box>
    </div>
  );
};
