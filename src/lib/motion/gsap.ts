"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

let registered = false;

/**
 * Enregistre les plugins GSAP et la courbe signature "amsOut".
 * À importer une fois dans les composants client utilisant GSAP.
 */
export function initGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin, Flip, useGSAP);
  CustomEase.create("amsOut", "0.16,1,0.3,1");
  CustomEase.create("amsInOut", "0.65,0,0.35,1");
  registered = true;
}

export { gsap, ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin, Flip, useGSAP };
