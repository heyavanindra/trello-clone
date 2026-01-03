import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-neutral-200 bg-white text-center text-sm text-neutral-400">
      <p>
        &copy; {new Date().getFullYear()} SyncTask Inc. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
