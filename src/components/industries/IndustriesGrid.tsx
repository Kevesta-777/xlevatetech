
import { industries } from "@/data/industriesData";
import { IndustryCard } from "./IndustryCard";

export const IndustriesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {industries.map((industry, index) => (
        <IndustryCard key={index} industry={industry} />
      ))}
    </div>
  );
};
