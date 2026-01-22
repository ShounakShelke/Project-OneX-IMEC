import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ParallaxBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      mouseX.set(x * 30);
      mouseY.set(y * 30);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="parallax-bg bg-[hsl(220,20%,4%)]">
      {/* Gradient orbs - Update colors for IMSA */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(191 100% 44% / 0.3) 0%, transparent 70%)", // Cyan
          top: "10%",
          left: "60%",
          x: parallaxX,
          y: parallaxY,
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(32 93% 54% / 0.3) 0%, transparent 70%)", // Orange
          top: "50%",
          left: "10%",
          x: useSpring(useMotionValue(0), springConfig),
          y: useSpring(useMotionValue(0), springConfig),
        }}
        animate={{
          x: -parallaxX.get() * 0.5,
          y: -parallaxY.get() * 0.5,
        }}
      />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(191 100% 44% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(191 100% 44% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Racing lines - IMSA colors */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              width: "200%",
              top: `${20 + i * 15}%`,
              left: "-50%",
            }}
            animate={{
              x: ["-50%", "50%"],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Cursor glow effect */}
      <motion.div
        className="pointer-events-none fixed w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(191 100% 44% / 0.08) 0%, transparent 70%)",
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
    </div>
  );
};

export default ParallaxBackground;
