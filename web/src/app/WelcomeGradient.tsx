import { useWelcomeStore } from "@/stores/useWelcomeStore";

export const WelcomeGradient = () => {
  const { setWelcome, welcome, setHovering } = useWelcomeStore();

  if (!welcome) return null;

  return (
    <div className="absolute top-[calc(50%-8rem)] z-[60] flex h-32 w-full flex-row justify-center bg-gradient-to-b from-transparent to-white">
      <div
        className="h-32 cursor-pointer sm:w-[400px] lg:w-[450px]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => setWelcome(false)}
      />
    </div>
  );
};
