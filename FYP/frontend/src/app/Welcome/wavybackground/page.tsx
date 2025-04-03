"use client";
import React from "react";
import styles from "./style.module.css";

export default function WavyBackground() {
  return (
    <div className={styles.container}>
      <svg
        className={styles.wave}
        viewBox="0 0 600 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffb001" />
            <stop offset="100%" stopColor="#ffeb3b" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient)"
          d="
            M 0,0
            L 540,0
            C 560,80 560,200 540,300
            C 520,400 560,500 540,600
            C 520,700 560,800 540,900
            L 540,800
            L 0,800
            Z
          "
        />
      </svg>
    </div>
  );
}
