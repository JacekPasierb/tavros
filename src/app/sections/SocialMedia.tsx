import React from "react";
import {FaFacebookF, FaInstagram, FaYoutube, FaTiktok} from "react-icons/fa";

const SocialMedia = () => {
  return (
    <section className="container mx-auto px-4 ">
      <div className=" px-4">
        {/* Ikony kolorowe */}
        <div className="flex justify-center gap-8 text-3xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-[#1877F2] hover:scale-110 transition-transform"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#E4405F] hover:scale-110 transition-transform"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-[#FF0000] hover:scale-110 transition-transform"
          >
            <FaYoutube />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-[#000000] hover:scale-110 transition-transform"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Napis */}
        <div className="mt-6 text-center text-sm tracking-[0.5em] text-zinc-700">
          @ TAVROS
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
