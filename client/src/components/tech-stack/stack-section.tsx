import React from 'react';
import ComponentCard from './component-card';

interface Component {
  name: string;
  description: string;
  status: string;
  license: string;
  repositoryUrl?: string;
  documentationUrl?: string;
}

interface TechStackSectionProps {
  title: string;
  description: string;
  components: Component[];
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({
  title,
  description,
  components
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component, index) => (
          <ComponentCard
            key={index}
            name={component.name}
            description={component.description}
            status={component.status}
            license={component.license}
            repositoryUrl={component.repositoryUrl}
            documentationUrl={component.documentationUrl}
          />
        ))}
      </div>
    </div>
  );
};
