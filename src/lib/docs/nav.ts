import { componentDocs } from "./components";

export type NavItem = { title: string; href: string; hint?: string };
export type NavGroup = { title: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Components",
    items: componentDocs.map((doc) => ({
      title: doc.title,
      href: `/docs/components/${doc.slug}`,
      hint: doc.kind,
    })),
  },
];

/** Every page in reading order, for the previous / next links. */
export const flatNav: NavItem[] = navGroups.flatMap((group) => group.items);

export function getNeighbours(href: string) {
  const index = flatNav.findIndex((item) => item.href === href);
  return {
    prev: index > 0 ? flatNav[index - 1] : undefined,
    next: index >= 0 && index < flatNav.length - 1 ? flatNav[index + 1] : undefined,
  };
}
