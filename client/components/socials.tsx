import { FC } from "react";
import {
  FaDev,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMedium,
  FaTwitter,
} from "react-icons/fa";
import { SocialPlatform, SocialType } from "../lib/typings";

interface Props {
  socials: SocialType[];
}

const Socials: FC<Props> = ({ socials }) => {
  function generateIcon(platform: SocialPlatform) {
    if (platform === "dev") return <FaDev />;
    else if (platform === "facebook") return <FaFacebook />;
    else if (platform === "instagram") return <FaInstagram />;
    else if (platform === "mail") return <FaEnvelope />;
    else if (platform === "medium") return <FaMedium />;
    else if (platform === "twitter") return <FaTwitter />;
  }

  return (
    <>
      {socials.map(({ id, socialPlatform, url }) => (
        <a key={id} href={url}>
          {generateIcon(socialPlatform)}
        </a>
      ))}
    </>
  );
};

export default Socials;
