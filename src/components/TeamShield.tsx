import React from "react";

interface TeamShieldProps {
  shieldUrl?: string;
  className?: string;
  fallbackText?: string;
}

export default function TeamShield({ shieldUrl, className = "w-full h-full", fallbackText }: TeamShieldProps) {
  if (!shieldUrl) {
    return (
      <span className="text-[10px] text-slate-400 font-bold font-mono">
        {fallbackText ? fallbackText.substring(0, 2).toUpperCase() : "🛡️"}
      </span>
    );
  }

  // Check if it's a data URI with utf8 SVG.
  // In that case, we can clean it to raw SVG and render it inline safely, or render as <img>
  if (shieldUrl.startsWith("data:image/svg+xml;utf8,")) {
    try {
      const rawSvg = decodeURIComponent(shieldUrl.replace("data:image/svg+xml;utf8,", ""));
      if (rawSvg.trim().startsWith("<svg")) {
        return (
          <div
            className={`${className} flex items-center justify-center overflow-hidden`}
            dangerouslySetInnerHTML={{ __html: rawSvg }}
          />
        );
      }
    } catch (e) {
      // Fallback to image tag if decode fails
    }
  }

  // If it's another image source or standard URL, render as <img>
  if (
    shieldUrl.startsWith("data:") ||
    shieldUrl.startsWith("http://") ||
    shieldUrl.startsWith("https://") ||
    shieldUrl.startsWith("/") ||
    shieldUrl.startsWith("./")
  ) {
    return (
      <img
        src={shieldUrl}
        className={`${className} object-contain`}
        alt=""
        referrerPolicy="no-referrer"
        onError={(e) => {
          // If image fails, show textual backup
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const span = document.createElement("span");
            span.className = "text-[10px] text-slate-400 font-bold uppercase";
            span.innerText = fallbackText ? fallbackText.substring(0, 2).toUpperCase() : "FC";
            parent.appendChild(span);
          }
        }}
      />
    );
  }

  // If it is already an inline SVG tag
  if (shieldUrl.includes("<svg")) {
    return (
      <div
        className={`${className} flex items-center justify-center overflow-hidden`}
        dangerouslySetInnerHTML={{ __html: shieldUrl }}
      />
    );
  }

  // Fallback to text initials
  return (
    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
      {fallbackText ? fallbackText.substring(0, 2).toUpperCase() : "FC"}
    </span>
  );
}
