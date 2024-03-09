import { useWelcomeStore } from "@/stores/useWelcomeStore";

export const WelcomeGradient = () => {
  const { setWelcome, welcome, setHovering } = useWelcomeStore();

  if (!welcome) return null;

  return (
    <div
      className="absolute top-[calc(50%-8rem)] z-[60] h-32 w-full cursor-pointer bg-gradient-to-b from-transparent to-white"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => setWelcome(false)}
    />
  );
};
