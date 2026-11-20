import { TestimonialBento, type BentoTestimonial } from "@/registry/veyl/testimonial-bento";

/** Sample names, quotes and Unsplash portraits for the preview only. Replace them with real ones. */
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=160&h=160&fit=crop&crop=faces&q=80`;

const testimonials: BentoTestimonial[] = [
  { quote: "Copy, paste, ship. Veyl is the first library that didn't fight my design system.", name: "Tomás Rivera", role: "Founder at Loop", rating: 4.9, avatar: photo("1507003211169-0a1dd7228f2d") },
  { quote: "The animations feel hand-built, not templated. Our landing page finally looks expensive.", name: "Maya Chen", role: "Frontend Lead at Northwind", rating: 5.0, avatar: photo("1494790108377-be9c29b29330") },
  { quote: "I changed one CSS variable and the whole hero matched our brand.", name: "Sam Okafor", role: "Staff Engineer at Gridlane", rating: 4.9, avatar: photo("1500648767791-00dcc994a43e") },
  { quote: "No runtime library, no lock-in. The code lives in my repo, and that's the point.", name: "Lena Fischer", role: "Design Engineer at Plank", rating: 4.8, avatar: photo("1438761681033-6461ffad8d80") },
  { quote: "Dropped the Glass CTA in on a Friday and we shipped before lunch.", name: "Arjun Rao", role: "Indie Hacker", rating: 4.9, avatar: photo("1472099645785-5658abf4ff4e") },
  { quote: "Dark mode just worked. I didn't touch a single line.", name: "Priya Nair", role: "Product Designer at Cobalt", rating: 5.0, avatar: photo("1544005313-94ddf0286df2") },
  { quote: "Our conversion bump after the new hero was the easiest win of the quarter.", name: "Daniel Brooks", role: "Growth Lead at Fieldnote", rating: 4.8, avatar: photo("1506794778202-cad84cf45f1d") },
  { quote: "Finally, components that respect reduced motion and keyboards.", name: "Noor Hassan", role: "Accessibility Engineer at Basil", rating: 4.9, avatar: photo("1534528741775-53994a69daeb") },
  { quote: "It saved me a week of fiddling with easing curves.", name: "Kenji Tanaka", role: "Freelance Developer", rating: 4.9, avatar: photo("1519085360753-af0119f7cbe7") },
  { quote: "The docs show every prop, and the code reads like I wrote it myself.", name: "Olivia Martin", role: "CTO at Brightside", rating: 5.0, avatar: photo("1524504388940-b1c1722653e1") },
  { quote: "We moved from three UI kits to Veyl and our bundle got noticeably lighter.", name: "Mateo Silva", role: "Engineering Manager at Quill", rating: 4.8, avatar: photo("1531427186611-ecfd6d936c79") },
  { quote: "Every block looks considered. Spacing, motion, even the hover states.", name: "Hannah Weber", role: "Creative Director at Ostra", rating: 4.9, avatar: photo("1489424731084-a5d8b219a5bb") },
  { quote: "My agency clients keep asking which library we used. It's Veyl.", name: "Ravi Menon", role: "Founder at Pixelbarn", rating: 5.0, avatar: photo("1463453091185-61582044d556") },
  { quote: "Setup took one command. I was editing the code two minutes later.", name: "Zoe Alvarez", role: "Full-stack Developer", rating: 4.9, avatar: photo("1580489944761-15a19d654956") },
  { quote: "It's the rare library that makes me want to build more pages.", name: "Ethan Cole", role: "Indie Maker", rating: 4.8, avatar: photo("1568602471122-7832951cc4c5") },
];

export function TestimonialBentoDemo() {
  return (
    <div className="px-4 py-10">
      <TestimonialBento
        title="Loved by people who ship"
        description="Developers and designers use Veyl to build pages that feel hand-made, without the weight of a UI kit."
        testimonials={testimonials}
      />
    </div>
  );
}