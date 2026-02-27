import { DashboardHero } from "@/components/ui/dashboard-hero";

type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturePlaceholder({
  eyebrow,
  title,
  description,
}: FeaturePlaceholderProps) {
  return <DashboardHero eyebrow={eyebrow} title={title} description={description} />;
}
