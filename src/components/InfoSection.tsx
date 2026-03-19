import React from "react";
import { LucideIcon } from "lucide-react";

interface InfoSectionProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, description, icon: Icon, className }) => {
    return (
        <div className={`p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow ${className}`}>
            {Icon && (
                <div className="mb-4 text-cyan-500">
                    <Icon className="w-8 h-8" />
                </div>
            )}
            <h3 className="text-xl font-semibold mb-2 text-slate-900">{title}</h3>
            <p className="text-slate-500">{description}</p>
        </div>
    );
};

export default InfoSection;
