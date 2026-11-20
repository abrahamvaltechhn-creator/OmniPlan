import React from 'react';
import {
  Laptop,
  HeartPulse,
  GraduationCap,
  Palette,
  TrendingUp,
  Sparkles,
  Truck,
  Layers,
  Briefcase,
  Coffee,
  Rocket,
  Target,
  Stethoscope,
  BookOpen,
  FolderKanban,
  Building2,
  Camera,
  ShoppingBag,
  Scale,
  FileText,
} from 'lucide-react';

interface RubroIconProps {
  name: string;
  className?: string;
}

export const RubroIcon: React.FC<RubroIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name.toLowerCase()) {
    case 'scale':
    case 'legal':
    case 'gavel':
      return <Scale className={className} />;
    case 'filetext':
    case 'notary':
      return <FileText className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'heartpulse':
    case 'stethoscope':
      return <HeartPulse className={className} />;
    case 'graduationcap':
    case 'bookopen':
      return <GraduationCap className={className} />;
    case 'palette':
    case 'camera':
      return <Palette className={className} />;
    case 'trendingup':
    case 'shoppingbag':
      return <TrendingUp className={className} />;
    case 'sparkles':
    case 'coffee':
      return <Sparkles className={className} />;
    case 'truck':
    case 'building2':
      return <Truck className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'folderkanban':
      return <FolderKanban className={className} />;
    default:
      return <Layers className={className} />;
  }
};
