import Token from "@/assets/icons/token.svg";
import Image, { ImageProps } from "next/image";
interface TokenIconProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  size?: number;
  sizeMd?: number;
}

const TokenIcon = ({
  src,
  size = 20,
  sizeMd = 25,
  ...props
}: TokenIconProps) => (
  <>
    {src ? (
      <Image
        data-test="token-icon-image"
        alt=""
        width={0}
        height={0}
        src={src}
        className={`size-[${size}px] md:size-[${size}px]`}
        {...props}
      />
    ) : (
      <Token
        data-test="token-icon-svgr"
        className={`size-[${size}px] md:size-[${sizeMd}px]`}
        {...props}
      />
    )}
  </>
);

export { TokenIcon };
