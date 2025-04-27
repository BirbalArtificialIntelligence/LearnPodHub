import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

interface ComponentCardProps {
  name: string;
  description: string;
  status: string;
  license: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  className?: string;
}

// Map status to badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'operational':
    case 'active':
      return 'default';
    case 'in testing':
    case 'in integration':
    case 'mvp complete':
    case 'in_testing':
    case 'in_integration':
    case 'mvp_complete':
      return 'secondary';
    case 'under development':
    case 'limited use':
    case 'under_development':
    case 'limited_use':
      return 'outline';
    default:
      return 'outline';
  }
};

// Format status for display
const formatStatus = (status: string): string => {
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ComponentCard: React.FC<ComponentCardProps> = ({
  name,
  description,
  status,
  license,
  repositoryUrl,
  documentationUrl,
  className
}) => {
  const displayStatus = formatStatus(status);
  
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant={getStatusVariant(status)}>{displayStatus}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 flex-grow">
        <div className="text-sm">
          <span className="font-medium">License:</span> {license}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {repositoryUrl && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-2" />
              Repo
            </a>
          </Button>
        )}
        {documentationUrl && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Docs
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ComponentCard;
