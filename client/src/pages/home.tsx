import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TechStackSection } from '@/components/tech-stack/stack-section';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { GitBranch, Github, Code2, Layers, Terminal, Database, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Birbal AI Tech Stack
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                A comprehensive AI technology stack for multilingual content moderation and personalization
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/docs">
                    <Terminal className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://github.com/your-org/birbal-ai-tech-stack" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tech Stack Overview Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Tech Stack Components</h2>
            
            <Tabs defaultValue="frontend" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="frontend">
                  <Layers className="mr-2 h-4 w-4" />
                  Frontend
                </TabsTrigger>
                <TabsTrigger value="backend">
                  <Database className="mr-2 h-4 w-4" />
                  Backend
                </TabsTrigger>
                <TabsTrigger value="ml">
                  <Brain className="mr-2 h-4 w-4" />
                  ML Pipeline
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="frontend" className="mt-6">
                <TechStackSection 
                  title="Frontend Technologies"
                  description="Client-side technologies for building responsive and interactive user interfaces."
                  components={[
                    { name: "React.js", description: "Main UI framework", status: "Under Development", license: "MIT" },
                    { name: "Tailwind CSS", description: "Styling framework", status: "Complete", license: "MIT" },
                    { name: "Next.js", description: "Server-side rendering and routing", status: "Complete", license: "MIT" },
                    { name: "JQuery", description: "Legacy module integration", status: "Limited Use", license: "MIT" },
                    { name: "I18next", description: "Internationalization", status: "In Integration", license: "MIT" },
                  ]}
                />
              </TabsContent>
              
              <TabsContent value="backend" className="mt-6">
                <TechStackSection 
                  title="Backend Technologies"
                  description="Server-side technologies for API services, databases, and business logic."
                  components={[
                    { name: "Node.js", description: "Server environment", status: "Complete", license: "MIT" },
                    { name: "Express.js", description: "Web framework", status: "Complete", license: "MIT" },
                    { name: "PostgreSQL", description: "Relational database", status: "Operational", license: "PostgreSQL" },
                    { name: "MongoDB", description: "NoSQL database", status: "Operational", license: "SSPL" },
                    { name: "Redis", description: "In-memory cache", status: "Operational", license: "BSD 3-Clause" },
                    { name: "Hugging Face", description: "NLP models", status: "In Testing", license: "Apache 2.0" },
                  ]}
                />
              </TabsContent>
              
              <TabsContent value="ml" className="mt-6">
                <TechStackSection 
                  title="ML Pipeline Technologies"
                  description="Machine learning tools for model training, evaluation, and deployment."
                  components={[
                    { name: "Python (scikit-learn, pandas, spaCy)", description: "Model development", status: "Active", license: "Various Permissive" },
                    { name: "Hugging Face Transformers", description: "NLP model fine-tuning", status: "Active", license: "Apache 2.0" },
                    { name: "Label Studio", description: "Data annotation", status: "Active", license: "Apache 2.0" },
                    { name: "MLflow", description: "Experiment tracking", status: "Operational", license: "Apache 2.0" },
                    { name: "AWS S3", description: "Training data storage", status: "Operational", license: "Proprietary" },
                  ]}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Comprehensive Documentation</h3>
                  <p className="text-muted-foreground">
                    Detailed guides and documentation for all components of the tech stack.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Integration Examples</h3>
                  <p className="text-muted-foreground">
                    Sample code showing how to integrate different components of the stack.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <GitBranch className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Multilingual Support</h3>
                  <p className="text-muted-foreground">
                    Built-in internationalization and multilingual content processing capabilities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Getting Started Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Getting Started</h2>
            
            <div className="bg-card p-6 rounded-lg border">
              <p className="mb-4">Clone the repository to get started:</p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm mb-6 overflow-x-auto">
                git clone https://github.com/your-org/birbal-ai-tech-stack.git<br />
                cd birbal-ai-tech-stack
              </div>
              
              <p className="mb-4">Check out the setup guides for detailed instructions:</p>
              <ul className="space-y-2">
                <li>
                  <Badge variant="outline" className="mr-2">Frontend</Badge>
                  <Link href="/setup/frontend-setup" className="text-primary hover:underline">
                    Frontend Setup Guide
                  </Link>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">Backend</Badge>
                  <Link href="/setup/backend-setup" className="text-primary hover:underline">
                    Backend Setup Guide
                  </Link>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">ML</Badge>
                  <Link href="/setup/ml-setup" className="text-primary hover:underline">
                    ML Pipeline Setup Guide
                  </Link>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">Complete</Badge>
                  <Link href="/setup/environment-setup" className="text-primary hover:underline">
                    Complete Environment Setup
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
