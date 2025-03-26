import Discord from "@/assets/icons/discord.svg";
import DiscordWhite from "@/assets/icons/discord-white.svg";
import { cn } from "@/lib/utils";
const gitHash = process.env.NEXT_PUBLIC_GIT_HASH;

export default function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer className={cn(isDark && "text-white", "w-full self-end p-8")}>
      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-x-[10px]">
          <a href="https://x.com/superpositionso">𝕏</a>
          <a href="https://discord.gg/VjUWjRQP8y">
            {isDark ? <DiscordWhite /> : <Discord />}
          </a>
          <small>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/fluidity-money/long.so/tree/development/audits"
            >
              Audits
            </a>
          </small>
          <small>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://docs.long.so"
            >
              Docs/addresses
            </a>
          </small>
          <small>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://bridge.superposition.so"
            >
              Bridge to Superposition
            </a>
          </small>
        </div>
        <div className="flex items-center gap-x-[10px]">
          <small>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://issues.superposition.so"
            >
              TODO board
            </a>
          </small>
          <small>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`https://github.com/fluidity-money/long.so/commit/${gitHash}`}
            >
              Commit {gitHash}
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
}
