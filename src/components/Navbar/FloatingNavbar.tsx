import { useState } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export const FloatingNavbar = () => {
  const navItems = [
    {
      name: "Details",
      link: "#event-details",
    },
    {
      name: "Story",
      link: "#timeline",
    },
    {
      name: "Pass 🎟️",
      link: "#party-pass",
    },
    {
      name: "Then & Now",
      link: "#then-and-now",
    },
    {
      name: "Family 💖",
      link: "#family-gallery",
    },
    {
      name: "Join Party",
      link: "#rsvp",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full">
      <Navbar isOpen={isMobileMenuOpen}>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <NavbarButton href="#party-pass" variant="secondary">
              Get Pass 🎟️
            </NavbarButton>
            <NavbarButton href="#rsvp" variant="primary">
              Confirm RSVP 💖
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
              <NavbarButton href="#rsvp" variant="primary" className="text-xs px-3.5 py-1.5 min-h-[38px] flex items-center justify-center">
                RSVP 💖
              </NavbarButton>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center justify-between w-full pb-2 mb-1 border-b border-[#f5c65d]/30">
              <span className="text-xs font-black uppercase tracking-wider text-[#f3a187]">
                👑 Party Navigation
              </span>
              <span className="text-[10px] font-bold text-[#49362d]/60">1st Birthday</span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 min-h-[44px] flex items-center justify-center rounded-2xl bg-[#fff8ee] hover:bg-[#fff3d1] text-xs font-black text-[#49362d] border border-[#f5c65d]/30 transition-all text-center active:scale-95"
                >
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
            <div className="flex w-full flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
              <NavbarButton
                href="#party-pass"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full py-2.5 min-h-[44px] flex items-center justify-center"
              >
                Get VIP Party Pass 🎟️
              </NavbarButton>
              <NavbarButton
                href="#rsvp"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full py-2.5 min-h-[44px] flex items-center justify-center"
              >
                Confirm RSVP Attendance 💖
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </header>
  );
};

export default FloatingNavbar;
