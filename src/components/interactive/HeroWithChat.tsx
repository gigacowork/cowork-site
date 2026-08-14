import Hero from "@/components/sections/Hero";
import HeroChat from "@/components/interactive/HeroChat";

/**
 * Hero + встроенный чат (PROTO / Hero Chat · Embedded 1933:85345).
 * Композер и чипсы живут только внутри HeroChat — в hero их ровно по одному.
 */
export function HeroWithChat() {
  return <Hero chat={<HeroChat />} />;
}

export default HeroWithChat;
