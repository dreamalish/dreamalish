import React from "react";
import defaultProfilePic from "../../assets/defaultProfilePic.jpg";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string | null;
  size?: number;
};

export default function AvatarImage({
  src,
  size = 40,
  className,
  ...rest
}: Props) {

  const resolveSrc = () => {
    if (!src) return defaultProfilePic;

    if (src.startsWith("http") || src.startsWith("/uploads")) return src;
return defaultProfilePic;
  };

  return (
    <img
      {...rest}
      src={resolveSrc()}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "cover" }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = defaultProfilePic;
      }}
    />
  );
}