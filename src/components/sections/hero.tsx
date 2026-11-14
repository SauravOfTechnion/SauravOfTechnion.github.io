"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GoldenSpiral } from "@/components/golden-spiral";
import { profile } from "@/data/profile";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="hero section-shell" aria-labelledby="hero-name">
      <motion.p
        className="hero-affiliation"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile.affiliation}
      </motion.p>
      <motion.h1
        id="hero-name"
        className="hero-name"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile.name}
      </motion.h1>
      <div className="hero-grid">
        <div className="hero-copy">
          <motion.p
            className="hero-tagline"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.tagline}
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <a className="btn btn-primary" href="#projects">
              View projects
            </a>
            <a
              className="btn btn-secondary"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>
        <motion.div
          className="hero-visual"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <GoldenSpiral />
        </motion.div>
      </div>
      <nav className="hero-floor" aria-label="Interests">
        <a href="#violin">Violin</a>
        <a href="#physical-ai">Physical AI</a>
        <a href="#machine-learning">Machine learning</a>
        <a href="#reinforcement-learning">Reinforcement learning</a>
      </nav>
    </section>
  );
}
