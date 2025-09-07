import { useState, useCallback, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'date' | 'number';
  options?: { value: string; label: string }[];
  value?: string | string[] | number | Date;
}

interface AdvancedSearchProps {
  placeholder?: string;
  filters?: SearchFilter[];
  onSearch: (query: string, filters: Record<string, any>) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  className?: string;
}

export function AdvancedSearch({
  placeholder = 'Search...',
  filters = [],
  onSearch,
  onFilterChange,
  className
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string, currentFilters: Record<string, any>) => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery, currentFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearch]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery, activeFilters);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }
    
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
    onSearch(query, newFilters);
  };

  const clearFilter = (filterId: string) => {
    handleFilterChange(filterId, null);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange?.({});
    onSearch(query, {});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  const renderFilter = (filter: SearchFilter) => {
    const currentValue = activeFilters[filter.id];

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Select
              value={currentValue || ''}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={currentValue?.includes(option.value) || false}
                    onCheckedChange={(checked) => {
                      const currentArray = currentValue || [];
                      if (checked) {
                        handleFilterChange(filter.id, [...currentArray, option.value]);
                      } else {
                        handleFilterChange(filter.id, currentArray.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Input
              type="date"
              value={currentValue || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-full"
            />
          </div>
        );

      case 'number':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Input
              type="number"
              value={currentValue || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              placeholder={`Enter ${filter.label.toLowerCase()}`}
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getFilterDisplayValue = (filter: SearchFilter) => {
    const value = activeFilters[filter.id];
    if (!value) return null;

    if (Array.isArray(value)) {
      return value.length > 1 ? `${value.length} selected` : value[0];
    }

    if (filter.type === 'select' && filter.options) {
      const option = filter.options.find(opt => opt.value === value);
      return option?.label || value;
    }

    return value.toString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-10 pr-12"
        />
        
        {/* Filter Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-5 w-5 p-0 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto p-1 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {filters.map(renderFilter)}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const displayValue = getFilterDisplayValue(filter);
            if (!displayValue) return null;

            return (
              <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {filter.label}: {displayValue}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(filter.id)}
                  className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;