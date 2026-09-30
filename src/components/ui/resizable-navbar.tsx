import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

export interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className, isOpen = false }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setShowNavbar(true);
    }
  }, [isOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 0) return; // Prevent iOS rubber-band bounce jitter
    // 1. Detect whether we should enter the compact resizable pill mode
    if (latest > 80) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    // 2. Smart Auto-Hide logic:
    // Scroll Down past 100px -> hide completely so it doesn't obstruct content
    // Scroll Up -> reveal instantly for effortless navigation
    const diff = latest - lastScrollY.current;

    if (isOpen) {
      setShowNavbar(true);
    } else if (latest <= 80) {
      setShowNavbar(true);
    } else if (diff > 4 && latest > 100) {
      setShowNavbar(false);
    } else if (diff < -4) {
      setShowNavbar(true);
    }

    lastScrollY.current = latest;
  });

  return (
    <motion.div
      ref={ref}
      animate={{
        y: showNavbar ? 0 : -120,
        opacity: showNavbar ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "fixed inset-x-0 top-3 z-40 w-full px-3 md:px-6",
        showNavbar ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(8px)",
        boxShadow: visible
          ? "0 10px 30px rgba(73, 54, 45, 0.12), 0 0 0 2px rgba(245, 198, 93, 0.4)"
          : "0 4px 20px rgba(73, 54, 45, 0.08)",
        width: visible ? "65%" : "100%",
        y: visible ? 10 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 35,
      }}
      style={{
        minWidth: "min(100%, 780px)",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-6xl flex-row items-center justify-between self-start rounded-full px-5 py-2.5 lg:flex transition-colors duration-300 border-2 border-white/80",
        visible
          ? "bg-white/92 shadow-xl border-[#f5c65d]/50"
          : "bg-gradient-to-r from-[#fff3d1]/90 via-white/90 to-[#f5d6d0]/90",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative hidden flex-1 flex-row items-center justify-center space-x-1 text-xs sm:text-sm font-extrabold text-[#49362d] lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          key={`link-${idx}`}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3.5 py-1.5 rounded-full text-[#49362d] hover:text-[#f3a187] transition duration-200 z-10"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-gradient-to-r from-[#fff3d1] to-[#f5d6d0] border border-[#f5c65d]/40 shadow-xs -z-10"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(8px)",
        boxShadow: visible
          ? "0 10px 25px rgba(73, 54, 45, 0.12), 0 0 0 2px rgba(245, 198, 93, 0.4)"
          : "0 4px 15px rgba(73, 54, 45, 0.08)",
        width: visible ? "94%" : "100%",
        paddingRight: visible ? "14px" : "8px",
        paddingLeft: visible ? "14px" : "8px",
        borderRadius: "2rem",
        y: visible ? 8 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 35,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1.5rem)] flex-col items-center justify-between px-3 py-2 lg:hidden transition-colors duration-300 border-2 border-white/80",
        visible
          ? "bg-white/95 shadow-xl border-[#f5c65d]/50"
          : "bg-gradient-to-r from-[#fff3d1]/90 via-white/90 to-[#f5d6d0]/90",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "absolute inset-x-0 top-full mt-2 z-50 flex w-full flex-col items-start justify-start gap-3 rounded-3xl bg-white/98 backdrop-blur-2xl p-5 shadow-2xl border-4 border-[#fff3d1] max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full bg-white/90 text-[#49362d] border border-[#f5c65d]/50 shadow-xs hover:bg-[#fff3d1] active:scale-95 transition-all"
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
    >
      {isOpen ? (
        <IconX className="w-5 h-5 text-[#f3a187]" />
      ) : (
        <IconMenu2 className="w-5 h-5 text-[#49362d]" />
      )}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center gap-2 px-2 py-1 text-sm font-normal text-[#49362d] group select-none"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5c65d] via-[#e8b84b] to-[#f3a187] p-0.5 shadow-md flex items-center justify-center border-2 border-white">
        <span className="text-sm">👑</span>
      </div>
      <div className="flex flex-col">
        <span className="font-serif font-black text-xs sm:text-sm text-[#49362d] tracking-tight leading-tight">
          Y S HANVIKA
        </span>
        <span className="text-[9px] font-bold text-[#f3a187] -mt-0.5">
          1st Birthday Party 🎉
        </span>
      </div>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 min-h-[44px] rounded-full text-xs font-black relative cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition duration-200 inline-flex items-center justify-center text-center shadow-md";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#f5c65d] via-[#f3a187] to-[#f5c65d] text-white border border-white/60 hover:shadow-lg",
    secondary:
      "bg-white/80 hover:bg-white text-[#49362d] border border-[#f5c65d]/40 shadow-xs",
    dark: "bg-[#49362d] hover:bg-[#f3a187] text-white border border-white/40",
    gradient:
      "bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white shadow-md border border-white",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Navbar;
