import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import { Link } from '@heroui/link';
import { link as linkStyles } from '@heroui/theme';
import NextLink from 'next/link';
import clsx from 'clsx';

import { siteConfig } from '../config/site';
import { ThemeSwitch } from '../components/theme-switch';
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from '../components/icons';

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent justify="start">
        <NavbarMenuToggle className="sm:hidden" />
        <div className="hidden sm:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item: { href: string; label: string }) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                  'uppercase'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex " justify="center">
        <NavbarItem>
          <h1 className="text-3xl tracking-widest uppercase font-semibold">viktor kokorev</h1>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex flex-row items-center gap-4">
          <Link isExternal href={siteConfig.links.telegram} target="_blank" title="Telegram">
            <TelegramIcon className="text-default-500" size={22} />
          </Link>
          <Link isExternal href={siteConfig.links.instagram} target="_blank" title="Instagram">
            <InstagramIcon className="text-default-500" size={22} />
          </Link>
          <Link isExternal href={siteConfig.links.whatsapp} target="_blank" title="WhatsApp">
            <WhatsAppIcon className="text-default-500" size={22} />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item: { href: string; label: string }) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                  'uppercase'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
