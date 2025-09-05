import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchComponentProps {
  data: any[];
  type: string;
  onFilteredData: (filteredResults: any[]) => void;
  resetSearch?: boolean;
  onResetComplete?: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ 
  data, 
  type,
  onFilteredData,
  resetSearch,
  onResetComplete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reset search term when resetSearch is true
  useEffect(() => {
    if (resetSearch) {
        
      setSearchTerm('');
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetSearch, onResetComplete]);

  useEffect(() => {
    if (!data) return;
    
    const filteredResults = data.filter(item => {
      const searchText = searchTerm.toLowerCase();
      switch(type) {
        case 'seccoes':
          return item.nome.toLowerCase().includes(searchText);
        case 'zonas':
          return item.zona.nome.toLowerCase().includes(searchText);
        case 'trabalhos':
          return item.trabalho.nome.toLowerCase().includes(searchText);
        default:
          return true;
      }
    });
    
    onFilteredData(filteredResults);
  }, [searchTerm, data, type]);

  return (
    <div className="mb-4">
      <div className="input-group">
       
        <input
          type="text"
          placeholder={`Pesquisar ${type}...`}
          className="form-control "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchComponent;