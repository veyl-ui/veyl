import { componentDocs } from "./components";

export type NavItem = { title: string; href: string; hint?: string };
export type NavIcon = "book" | "grid";
export type NavGroup = { title: string; icon?: NavIcon; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    title: "Getting started",
    icon: "book",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Theming", href: "/docs/theming" },
      { title: "Changelog", href: "/docs/changelog" },
      { title: "Contribute", href: "/docs/contribute" },
      { title: "License", href: "/docs/license" },
    ],
  },
  {
    title: "Components",
    icon: "grid",
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
