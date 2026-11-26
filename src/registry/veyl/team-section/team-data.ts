export type TeamMember = {
  /** Shown under the photo, in bold. */
  name: string;
  /** Shown under the name, in grey. */
  role: string;
  /** Path or URL of the portrait. Portrait photos about 4:5 work best. Without one, a soft placeholder with initials is shown. */
  image?: string;
};

/** Sample people. The photos are saved in public/team/ (member-01.jpg to member-06.jpg). */
export const TEAM_MEMBERS: TeamMember[] = [
  {name: 'Anders Holm', role: 'Engineering', image: '/team/member-01.jpg'},
  {name: 'Zuri Mensah', role: 'Design', image: '/team/member-02.jpg'},
  {name: 'Rafael Ortiz', role: 'Product', image: '/team/member-03.jpg'},
  {name: 'Kenji Watanabe', role: 'Engineering', image: '/team/member-04.jpg'},
  {name: 'Dante Brooks', role: 'Brand', image: '/team/member-05.jpg'},
  {name: 'Omar Haddad', role: 'Growth', image: '/team/member-06.jpg'},
];