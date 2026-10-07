import React from "react";

interface StrongTextProps {
  children: string;
}

/**
 * Renders only the two formatting tokens used by the content catalog.
 * Unknown HTML is treated as plain text; no HTML is injected into the DOM.
 */
const StrongText: React.FC<StrongTextProps> = ({ children }) => {
  const tokens = children.split(/(\*\*.*?\*\*|<strong>.*?<\/strong>)/gi);

  return (
    <>
      {tokens.map((token, index) => {
        const markdown = token.match(/^\*\*(.*?)\*\*$/s);
        const htmlToken = token.match(/^<strong>(.*?)<\/strong>$/is);

        if (markdown || htmlToken) {
          return <strong key={index} className="text-white">{markdown?.[1] ?? htmlToken?.[1]}</strong>;
        }

        return <React.Fragment key={index}>{token}</React.Fragment>;
      })}
    </>
  );
};

export default StrongText;
