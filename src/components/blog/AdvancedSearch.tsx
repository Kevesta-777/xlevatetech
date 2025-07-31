import { useState, useEffect } from 'react';
import { Search, X, Filter, TrendingUp, Clock, Users, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  url: string;
  type: 'article' | 'resource' | 'case-study';
  relevance: number;
  publishDate: string;
  readTime?: number;
  tags: string[];
}

interface AdvancedSearchProps {
  onResults: (results: SearchResult[]) => void;
  placeholder?: string;
}

export const AdvancedSearch = ({ onResults, placeholder = "Search articles, topics, keywords..." }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchResult[]>([]);

  // Mock search data - in production this would use Algolia or similar
  const searchData: SearchResult[] = [
    {
      id: 'healthcare-automation-2025',
      title: '2025 Healthcare Automation Market Reaches $80.38B',
      excerpt: 'Healthcare automation market grows at 10.8% CAGR, driven by AI adoption and efficiency demands.',
      category: 'Healthcare',
      url: '/blog/healthcare-automation-market-2025',
      type: 'article',
      relevance: 95,
      publishDate: '2025-01-15',
      readTime: 8,
      tags: ['Healthcare', 'Market Analysis', 'AI Adoption']
    },
    {
      id: 'financial-automation-growth',
      title: 'Financial Automation Market Hits $18.4B by 2030',
      excerpt: '14.6% CAGR growth in financial automation as 82% of CFOs increase investments.',
      category: 'Finance',
      url: '/blog/financial-automation-growth-2025',
      type: 'article',
      relevance: 92,
      publishDate: '2025-01-12',
      readTime: 6,
      tags: ['Finance', 'Automation', 'Investment']
    },
    {
      id: 'real-estate-ai-market',
      title: 'Real Estate AI Market Soars to $303.06B in 2025',
      excerpt: '36.1% CAGR growth in real estate AI solutions transforms property management.',
      category: 'Real Estate',
      url: '/blog/real-estate-ai-market-2025',
      type: 'article',
      relevance: 89,
      publishDate: '2025-01-10',
      readTime: 7,
      tags: ['Real Estate', 'AI', 'PropTech']
    },
    {
      id: 'automation-roi-calculator',
      title: '2025 Automation ROI Calculator',
      excerpt: 'Calculate your automation ROI with live 2025 market data and industry benchmarks.',
      category: 'Tools',
      url: '/automation-roi-calculator',
      type: 'resource',
      relevance: 87,
      publishDate: '2025-01-08',
      tags: ['ROI', 'Calculator', 'Tools']
    },
    {
      id: 'healthcare-case-study',
      title: 'Healthcare Automation: 300% Efficiency Improvement',
      excerpt: 'Mid-size healthcare provider achieves remarkable efficiency gains through intelligent automation.',
      category: 'Healthcare',
      url: '/case-studies/healthcare-efficiency',
      type: 'case-study',
      relevance: 85,
      publishDate: '2025-01-05',
      readTime: 12,
      tags: ['Case Study', 'Healthcare', 'Efficiency']
    }
  ];

  const popularSearches = [
    'Healthcare automation 2025',
    'AI automation ROI',
    'Financial services automation',
    'Real estate PropTech',
    'Process automation tools',
    'Automation market trends'
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performSearch = (searchQuery: string, selectedFilters: string[] = []) => {
    if (!searchQuery.trim()) {
      onResults([]);
      return;
    }

    // Simulate advanced search with scoring
    const results = searchData
      .filter(item => {
        const matchesQuery = 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesFilters = selectedFilters.length === 0 || 
          selectedFilters.includes(item.category) || 
          selectedFilters.includes(item.type);

        return matchesQuery && matchesFilters;
      })
      .sort((a, b) => b.relevance - a.relevance);

    onResults(results);
    
    // Update search history
    if (searchQuery.trim()) {
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        localStorage.setItem('xlevate-search-history', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery, filters);
  };

  const toggleFilter = (filter: string) => {
    const newFilters = filters.includes(filter)
      ? filters.filter(f => f !== filter)
      : [...filters, filter];
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <TrendingUp className="h-4 w-4" />;
      case 'resource': return <Star className="h-4 w-4" />;
      case 'case-study': return <Users className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onClick={() => setIsOpen(true)}
          className="pl-12 pr-20 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 transition-all"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 h-auto"
          >
            ⌘K
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map(filter => (
            <Badge 
              key={filter} 
              variant="secondary" 
              className="bg-accent/20 text-accent border-accent/30 cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Command Dialog for Advanced Search */}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-elevate-dark border-white/20">
          <CommandInput 
            placeholder="Search articles, resources, case studies..." 
            value={query}
            onValueChange={handleSearch}
            className="text-white"
          />
          
          <CommandList className="max-h-96 overflow-y-auto">
            <CommandEmpty className="text-gray-400 p-4">
              No results found for "{query}"
            </CommandEmpty>

            {/* Quick Filters */}
            <CommandGroup heading="Filter by Category">
              {['Healthcare', 'Finance', 'Real Estate', 'AI Automation'].map(category => (
                <CommandItem
                  key={category}
                  onSelect={() => toggleFilter(category)}
                  className="flex items-center gap-2 text-white hover:bg-white/10"
                >
                  <Filter className="h-4 w-4" />
                  {category}
                  {filters.includes(category) && <Badge variant="secondary" className="ml-auto">Active</Badge>}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Search Results */}
            {query && (
              <CommandGroup heading="Search Results">
                {searchData
                  .filter(item => 
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                    item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                  )
                  .slice(0, 5)
                  .map(result => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        window.location.href = result.url;
                        setIsOpen(false);
                      }}
                      className="flex items-start gap-3 p-3 text-white hover:bg-white/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(result.type)}
                        <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                          {result.category}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{result.title}</p>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">{result.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{new Date(result.publishDate).toLocaleDateString()}</span>
                          {result.readTime && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{result.readTime} min read</span>
                              </div>
                            </>
                          )}
                          <span>•</span>
                          <span>Relevance: {result.relevance}%</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {/* Popular Searches */}
            {!query && (
              <CommandGroup heading="Popular Searches">
                {popularSearches.map(search => (
                  <CommandItem
                    key={search}
                    onSelect={() => handleSearch(search)}
                    className="flex items-center gap-2 text-white hover:bg-white/10"
                  >
                    <TrendingUp className="h-4 w-4 text-accent" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map(search => (
                  <CommandItem
                    key={search}
                    onSelect={() => handleSearch(search)}
                    className="flex items-center gap-2 text-white hover:bg-white/10"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};