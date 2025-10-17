import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;

interface SearchBarProps {
  onSearch: (value: string) => void;
  onReset: () => void;
  loading?: boolean;
  searchMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onReset,
  loading = false,
  searchMode = false,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleReset = () => {
    setSearchValue('');
    onReset();
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Search
        placeholder="Search tasks by name..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        loading={loading}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        aria-label="Search tasks by name"
        style={{ flexGrow: 1 }}
      />
      {searchMode && (
        <Button
          size="large"
          icon={<ReloadOutlined />}
          onClick={handleReset}
          loading={loading}
          aria-label="Show all tasks"
        >
          Show All
        </Button>
      )}
    </Space.Compact>
  );
};

export default SearchBar;
