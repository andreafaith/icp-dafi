import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

interface AssetFiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
  onFilterClear: () => void;
  selectedType: string;
  selectedSort: string;
  searchValue: string;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  onSearchChange,
  onTypeChange,
  onSortChange,
  onFilterClear,
  selectedType,
  selectedSort,
  searchValue,
}) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    onTypeChange(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Search */}
        <TextField
          placeholder="Search assets..."
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        {/* Asset Type Filter */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType}
            label="Type"
            onChange={handleTypeChange}
            startAdornment={
              <FilterListIcon sx={{ mr: 1, color: 'action.active' }} />
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="token">Tokens</MenuItem>
            <MenuItem value="pool">Pools</MenuItem>
            <MenuItem value="farm">Farms</MenuItem>
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={selectedSort}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="marketCap">Market Cap</MenuItem>
            <MenuItem value="volume">Volume</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="change">24h Change</MenuItem>
            {(selectedType === 'pool' || selectedType === 'farm') && (
              <MenuItem value="apy">APY</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Active Filters */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {selectedType !== 'all' && (
            <Chip
              label={`Type: ${selectedType}`}
              onDelete={() => onTypeChange('all')}
              size="small"
            />
          )}
          {selectedSort && (
            <Chip
              label={`Sort: ${selectedSort}`}
              onDelete={() => onSortChange('')}
              size="small"
            />
          )}
          {(selectedType !== 'all' || selectedSort || searchValue) && (
            <Chip
              label="Clear All"
              onDelete={onFilterClear}
              size="small"
              color="primary"
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};
