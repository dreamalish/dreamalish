/*
import React, { useState, useEffect } from "react";
import APIURL from "../../helper/Environment";
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

  const resolveSrc = (value?: string | null) => {
    if (!value) return defaultProfilePic;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads")) return `${APIURL}${value}`;
    return defaultProfilePic;
  };

  const [imgSrc, setImgSrc] = useState(() => resolveSrc(src));

  useEffect(() => {
    setImgSrc(resolveSrc(src));
  }, [src]);

  return (
    <img
      {...rest}
      src={imgSrc}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "cover" }}
      onError={() => setImgSrc(defaultProfilePic)}
    />
  );
}
*/
import React, { useState, useEffect } from "react";
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

  const resolveSrc = (value?: string | null) => {
    if (!value) return defaultProfilePic;

    // Cloudinary URLs
    if (value.startsWith("http")) return value;

    return defaultProfilePic;
  };

  const [imgSrc, setImgSrc] = useState(resolveSrc(src));

  useEffect(() => {
    setImgSrc(resolveSrc(src));
  }, [src]);

  return (
    <img
      {...rest}
      src={imgSrc}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "cover" }}
      onError={() => setImgSrc(defaultProfilePic)}
    />
  );
}