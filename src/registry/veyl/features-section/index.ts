export { default as FeaturesSection } from "./features-section";
export type { FeaturesSectionProps } from "./features-section";
export { default as MacFloatingDock, defaultFeatureIcons } from "./mac-floating-dock";
export { default as FeatureBentoScreen } from "./feature-bento-screen";
export { default as FeatureActionsScreen } from "./feature-actions-screen";
export { default as FeaturePrivacyScreen } from "./feature-privacy-screen";
export { default as FeatureSearchScreen } from "./feature-search-screen";
export { default as FeatureCalendarScreen } from "./feature-calendar-screen";
export { default as FeatureDigestScreen } from "./feature-digest-screen";
export {
  FEATURES,
  CONNECTED_APPS,
  SPEAKERS_DATA,
  INITIAL_TASKS,
  MEETING_NOTES,
  CALENDAR_SLOTS,
  EXPORT_FORMATS,
} from "./features-data";
export type { FeatureDefinition, FeatureId } from "./features-data";
export type { ActionTask, MeetingNote } from "./features-logic";