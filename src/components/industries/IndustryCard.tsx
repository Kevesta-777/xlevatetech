
import { Industry } from "@/types/industry";

interface IndustryCardProps {
  industry: Industry;
}

export const IndustryCard = ({ industry }: IndustryCardProps) => {
  return (
    <div className="bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-5 pt-4 card-shadow flex flex-col h-full hover:border-elevate-accent/40 transition-all duration-300">
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0 mt-0.5">
          <industry.icon className="h-4 w-4 text-elevate-accent" />
        </div>
        <h3 className="text-xl font-semibold text-white leading-tight">{industry.title}</h3>
      </div>
      <p className="text-gray-300 flex-grow mb-3">{industry.description}</p>
      <div className="mt-auto">
        <p className="text-sm font-semibold text-elevate-accent">Target Industries:</p>
        <p className="text-xs text-gray-300">{industry.exampleClients.slice(0, 3).join(", ")}</p>
      </div>
    </div>
  );
};
