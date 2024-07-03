import Token from "@/assets/icons/token.svg";
import Image from "next/image";
interface TokenIconProps {
  src?: string;
  size?: number;
  sizeMd?: number;
}

const TokenIcon = ({ src, size = 20, sizeMd = 25 }: TokenIconProps) => (
  <>
    {src ?
      <Image
        alt=""
        width={0}
        height={0}
        src={src}
        className={`size-[${size}px] md:size-[${sizeMd}px]`}
      /> :
      <Token className={`size-[${size}px] md:size-[${sizeMd}px]`} />
    }
  </>
)

export {
  TokenIcon,
}
