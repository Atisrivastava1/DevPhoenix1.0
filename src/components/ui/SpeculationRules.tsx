"use client";

import { useEffect } from "react";

export function SpeculationRules() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      HTMLScriptElement.supports &&
      HTMLScriptElement.supports("speculationrules")
    ) {
      if (document.querySelector('script[type="speculationrules"]')) {
        return;
      }
      const specScript = document.createElement("script");
      specScript.type = "speculationrules";
      specScript.textContent = JSON.stringify({
        prerender: [
          {
            source: "list",
            where: {
              href_matches: [
                "/programs/*",
                "/blog/*",
                "/learning-paths",
                "/showcase",
                "/mentors"
              ]
            },
            eagerness: "moderate"
          }
        ]
      });
      document.head.appendChild(specScript);
    }
  }, []);

  return null;
}
