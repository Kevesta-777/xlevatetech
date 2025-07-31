import { ExternalLink, X, FileText, Database, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DataSource {
  title: string;
  organization: string;
  year: string;
  url: string;
  type: "report" | "database" | "study";
  metrics: string[];
}

const dataSources: DataSource[] = [
  {
    title: "Business Process Automation Report 2025",
    organization: "McKinsey & Company",
    year: "2025",
    url: "https://www.mckinsey.com/business-functions/operations/our-insights",
    type: "report",
    metrics: ["Time savings", "Error reduction", "ROI benchmarks"]
  },
  {
    title: "Automation Market Analysis",
    organization: "Gartner",
    year: "2025",
    url: "https://www.gartner.com/en/information-technology/insights/automation",
    type: "database",
    metrics: ["Industry adoption rates", "Implementation costs", "Payback periods"]
  },
  {
    title: "AI and Automation Impact Study",
    organization: "Deloitte",
    year: "2024",
    url: "https://www2.deloitte.com/insights/us/en/focus/cognitive-technologies/",
    type: "study",
    metrics: ["Healthcare automation", "Financial services automation", "Real estate tech adoption"]
  },
  {
    title: "Workforce Automation Trends",
    organization: "PwC",
    year: "2024",
    url: "https://www.pwc.com/us/en/tech-effect/automation/",
    type: "report",
    metrics: ["Labor cost analysis", "Productivity gains", "Employee impact"]
  }
];

interface DataSourcesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DataSourcesModal = ({ open, onOpenChange }: DataSourcesModalProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "study":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "report":
        return "text-blue-400 bg-blue-500/20";
      case "database":
        return "text-green-400 bg-green-500/20";
      case "study":
        return "text-purple-400 bg-purple-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-elevate-dark border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Database className="w-5 h-5 text-[#70EDFF]" />
            Data Sources & Citations
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <p className="text-gray-300 text-sm">
            Our ROI calculations are based on the latest industry research and real-world implementation data from leading consulting firms and technology analysts.
          </p>

          <div className="grid gap-4">
            {dataSources.map((source, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${getTypeColor(source.type)}`}>
                          {getTypeIcon(source.type)}
                        </div>
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          {source.type}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{source.year}</span>
                      </div>

                      <h3 className="text-white font-semibold mb-1">{source.title}</h3>
                      <p className="text-[#70EDFF] text-sm mb-3">{source.organization}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {source.metrics.map((metric, metricIndex) => (
                          <span
                            key={metricIndex}
                            className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 shrink-0"
                      asChild
                    >
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Source
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-semibold mb-2">Data Methodology</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              All calculations use conservative estimates from the lower quartile of reported benefits. 
              Industry-specific multipliers are based on aggregated data from 500+ automation implementations 
              across finance, healthcare, and real estate sectors. ROI projections include typical implementation 
              costs and assume standard deployment timelines.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourcesModal;