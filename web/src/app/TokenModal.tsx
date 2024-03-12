"use client";

import { Box, Text, Token } from "@/components";
import { Button } from "@/components/ui/button";
import { TokenList } from "@/util/tokens";
import { ActiveModalToken } from "@/util/types";
import { useActiveTokenStore } from "@/stores/useActiveTokenStore";
import { create } from "zustand";
import { useHotkeys } from "react-hotkeys-hook";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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

  useHotkeys("esc", () => disable());

  if (!enabled) return null;

  return (
    <div className="z-10 flex flex-col items-center">
      <motion.div
        layoutId="modal"
        className="flex max-w-screen-sm flex-col gap-4 rounded-lg bg-black p-4 text-white"
      >
        <div className="flex flex-row items-center justify-between">
          <Text>Swap</Text>
          <Button
            variant="secondary"
            onClick={() => disable()}
            className="px-2 py-0"
          >
            {"<-"} Esc
          </Button>
        </div>

        <div className="flex flex-col gap-4 p-2">
          <Label htmlFor="filter">Filter</Label>
          <Input
            id="filter"
            placeholder="e.g. Ether, ARB, 0x0bafe8babf38bf3ba83fb80a82..."
          />

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
        </div>
      </motion.div>
    </div>
  );
};
