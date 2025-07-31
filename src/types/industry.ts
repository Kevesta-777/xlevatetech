
import { LucideIcon } from "lucide-react";

export interface Industry {
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  icon: LucideIcon;
  exampleClients: string[];
  gradient: string;
  color: string;
  professionalExample: string;
  highResImage: string;
  caseStudyLink: string;
}

export interface TechTrendData {
  year: string;
  ai: number;
  cloud: number;
  mobile: number;
  traditional: number;
  aiRevenue: number;
  cloudRevenue: number;
  mobileRevenue: number;
  traditionalRevenue: number;
}
