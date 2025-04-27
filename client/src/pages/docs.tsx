import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TechStackSection } from '@/components/tech-stack/stack-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Layers, Database, Brain, AlertTriangle, BookOpen, Code2, GitMerge } from 'lucide-react';

interface TechComponent {
  id: number;
  name: string;
  category: string;
  description: string;
  status: string;
  license: string;
  repositoryUrl?: string;
  documentationUrl?: string;
}

export default function Docs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeHash, setActiveHash] = useState('');
  
  // Fetch tech components from API
  const { data: techComponentsData, isLoading, error } = useQuery<{data: TechComponent[]}>({
    queryKey: ['/api/components'],
  });
  
  // Handle URL hash for direct section navigation
  useEffect(() => {
    // Get hash from URL without the #
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActiveHash(hash);
      
      // Map hash to tab
      if (hash === 'frontend' || hash === 'backend' || hash === 'ml-pipeline' || hash === 'integration') {
        setActiveTab(hash);
      }
      
      // Scroll to section
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);
  
  // Filter components by category
  const frontendComponents = techComponentsData?.data.filter(c => c.category === 'frontend') || [];
  const backendComponents = techComponentsData?.data.filter(c => c.category === 'backend') || [];
  const mlComponents = techComponentsData?.data.filter(c => c.category === 'ml') || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Documentation</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive documentation for the Birbal AI tech stack components and integration.
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load tech stack components. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="frontend" id="frontend">
                <Layers className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Frontend</span>
              </TabsTrigger>
              <TabsTrigger value="backend" id="backend">
                <Database className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Backend</span>
              </TabsTrigger>
              <TabsTrigger value="ml-pipeline" id="ml-pipeline">
                <Brain className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">ML Pipeline</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Birbal AI Tech Stack</CardTitle>
                  <CardDescription>
                    A comprehensive AI technology stack for multilingual content moderation and personalization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    The Birbal AI tech stack is a complete framework for building AI-powered applications with a focus on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>Multilingual content moderation</li>
                    <li>Personalized content recommendations</li>
                    <li>Scalable AI infrastructure</li>
                    <li>Ethical AI practices and governance</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-2">Architecture Overview</h3>
                  <p className="mb-4">
                    The stack is organized into three main layers that work together to provide a complete solution:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-base flex items-center">
                          <Layers className="h-5 w-5 mr-2" />
                          Frontend Layer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 text-sm">
                        Client-facing user interface built with React, Next.js and Tailwind CSS
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-base flex items-center">
                          <Database className="h-5 w-5 mr-2" />
                          Backend Layer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 text-sm">
                        API services, databases, and business logic using Node.js and Express
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-base flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          ML Pipeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 text-sm">
                        Machine learning model training, evaluation and deployment with Python and Hugging Face
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2" id="integration">
                    Integration
                  </h3>
                  <p className="mb-4">
                    Components integrate through well-defined interfaces:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Frontend to Backend: REST APIs and WebSockets</li>
                    <li>Backend to ML: API calls and message queues</li>
                    <li>Data flow: Structured pipelines for content processing</li>
                  </ul>
                </CardContent>
              </Card>
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <GitMerge className="h-5 w-5 mr-2" />
                  Getting Started
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p>
                        To get started with the Birbal AI tech stack, explore the individual component documentation:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <a href="#frontend" onClick={() => setActiveTab('frontend')} className="text-primary hover:underline">
                            Frontend Components
                          </a>
                        </li>
                        <li>
                          <a href="#backend" onClick={() => setActiveTab('backend')} className="text-primary hover:underline">
                            Backend Services
                          </a>
                        </li>
                        <li>
                          <a href="#ml-pipeline" onClick={() => setActiveTab('ml-pipeline')} className="text-primary hover:underline">
                            ML Pipeline
                          </a>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Frontend Tab */}
            <TabsContent value="frontend" className="space-y-8">
              <div className="flex items-center mb-6">
                <Layers className="h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold" id="frontend">Frontend Components</h2>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">Loading frontend components...</div>
              ) : (
                <TechStackSection
                  title="Frontend Technologies"
                  description="Client-side technologies for building responsive and interactive user interfaces with multilingual support."
                  components={frontendComponents}
                />
              )}
              
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Code2 className="h-5 w-5 mr-2" />
                  Implementation Examples
                </h3>
                <Card>
                  <CardHeader>
                    <CardTitle>Frontend Implementation</CardTitle>
                    <CardDescription>
                      Key features and patterns for Birbal AI frontend components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>
                        <strong>Component Architecture</strong>: Modular React components with clear separation of concerns
                      </li>
                      <li>
                        <strong>Styling with Tailwind</strong>: Utility-first CSS with custom theme configuration
                      </li>
                      <li>
                        <strong>Internationalization</strong>: i18next integration for multilingual support
                      </li>
                      <li>
                        <strong>API Integration</strong>: React Query for data fetching and cache management
                      </li>
                      <li>
                        <strong>Routing</strong>: Next.js or React Router for navigation
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Backend Tab */}
            <TabsContent value="backend" className="space-y-8">
              <div className="flex items-center mb-6">
                <Database className="h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold" id="backend">Backend Services</h2>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">Loading backend components...</div>
              ) : (
                <TechStackSection
                  title="Backend Technologies"
                  description="Server-side technologies for API services, databases, and business logic processing."
                  components={backendComponents}
                />
              )}
              
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Code2 className="h-5 w-5 mr-2" />
                  Implementation Examples
                </h3>
                <Card>
                  <CardHeader>
                    <CardTitle>Backend Implementation</CardTitle>
                    <CardDescription>
                      Key features and patterns for Birbal AI backend services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>
                        <strong>API Design</strong>: RESTful API design with Express.js
                      </li>
                      <li>
                        <strong>Database Integration</strong>: PostgreSQL for structured data, MongoDB for flexible documents
                      </li>
                      <li>
                        <strong>Authentication</strong>: JWT-based authentication with role-based access control
                      </li>
                      <li>
                        <strong>Caching</strong>: Redis for performance optimization
                      </li>
                      <li>
                        <strong>Message Queues</strong>: RabbitMQ for asynchronous processing
                      </li>
                      <li>
                        <strong>ML Integration</strong>: API endpoints for model inference
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* ML Pipeline Tab */}
            <TabsContent value="ml-pipeline" className="space-y-8">
              <div className="flex items-center mb-6">
                <Brain className="h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold" id="ml-pipeline">ML Pipeline</h2>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">Loading ML pipeline components...</div>
              ) : (
                <TechStackSection
                  title="ML Pipeline Technologies"
                  description="Machine learning tools and frameworks for model training, evaluation, and deployment."
                  components={mlComponents}
                />
              )}
              
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Code2 className="h-5 w-5 mr-2" />
                  Implementation Examples
                </h3>
                <Card>
                  <CardHeader>
                    <CardTitle>ML Pipeline Implementation</CardTitle>
                    <CardDescription>
                      Key features and patterns for Birbal AI ML pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>
                        <strong>Data Preprocessing</strong>: Cleaning, tokenization, and feature extraction
                      </li>
                      <li>
                        <strong>Model Training</strong>: Fine-tuning transformer models for specific tasks
                      </li>
                      <li>
                        <strong>Evaluation</strong>: Metrics tracking and validation
                      </li>
                      <li>
                        <strong>Experiment Tracking</strong>: MLflow for versioning and comparing models
                      </li>
                      <li>
                        <strong>Deployment</strong>: Model serving via APIs and batch processing
                      </li>
                      <li>
                        <strong>Ethical AI</strong>: Bias detection and fairness evaluation
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
