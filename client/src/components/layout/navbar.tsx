import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, X, Github, Layers, Database, Brain, BookOpen, Home } from 'lucide-react';

const Navbar = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5 mr-2" /> },
    { name: 'Documentation', href: '/docs', icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: 'Frontend', href: '/docs#frontend', icon: <Layers className="h-5 w-5 mr-2" /> },
    { name: 'Backend', href: '/docs#backend', icon: <Database className="h-5 w-5 mr-2" /> },
    { name: 'ML Pipeline', href: '/docs#ml-pipeline', icon: <Brain className="h-5 w-5 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Birbal AI</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center space-x-2 justify-end md:justify-between">
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center ${
                  location === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://github.com/your-org/birbal-ai-tech-stack" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
            
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="px-2">
                  <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setIsOpen(false)}>
                    <span className="font-bold text-xl">Birbal AI</span>
                  </Link>
                  
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-base font-medium transition-colors flex items-center ${
                          location === item.href
                            ? 'text-foreground'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-8">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a 
                        href="https://github.com/your-org/birbal-ai-tech-stack" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
