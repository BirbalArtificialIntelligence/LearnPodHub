import React from 'react';
import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-card mt-auto py-8 border-t">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Birbal AI Tech Stack</h3>
            <p className="text-muted-foreground text-sm">
              A comprehensive AI technology stack for multilingual content moderation and personalization.
            </p>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs#frontend" className="text-muted-foreground hover:text-primary transition-colors">
                  Frontend
                </Link>
              </li>
              <li>
                <Link href="/docs#backend" className="text-muted-foreground hover:text-primary transition-colors">
                  Backend
                </Link>
              </li>
              <li>
                <Link href="/docs#ml-pipeline" className="text-muted-foreground hover:text-primary transition-colors">
                  ML Pipeline
                </Link>
              </li>
              <li>
                <Link href="/docs#integration" className="text-muted-foreground hover:text-primary transition-colors">
                  Integration
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Setup</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/setup/frontend-setup" className="text-muted-foreground hover:text-primary transition-colors">
                  Frontend Setup
                </Link>
              </li>
              <li>
                <Link href="/setup/backend-setup" className="text-muted-foreground hover:text-primary transition-colors">
                  Backend Setup
                </Link>
              </li>
              <li>
                <Link href="/setup/ml-setup" className="text-muted-foreground hover:text-primary transition-colors">
                  ML Pipeline Setup
                </Link>
              </li>
              <li>
                <Link href="/setup/environment-setup" className="text-muted-foreground hover:text-primary transition-colors">
                  Complete Environment
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/your-org/birbal-ai-tech-stack" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/your-org/birbal-ai-tech-stack/issues" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Issue Tracker
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/your-org/birbal-ai-tech-stack/blob/main/LICENSE" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Birbal AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a 
                href="https://github.com/your-org/birbal-ai-tech-stack" 
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <span className="text-muted-foreground">•</span>
              <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                Docs
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
