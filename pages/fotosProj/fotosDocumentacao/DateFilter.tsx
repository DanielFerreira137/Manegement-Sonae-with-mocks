import React, { useState } from 'react';
import Button from '../../../components/bootstrap/Button';

interface DateFilterProps {
  onFilterChange: (filter: DateFilterState) => void;
}

interface DateFilterState {
  startDate: string;
  endDate: string;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleFilter = (): void => {
    onFilterChange({ startDate, endDate });
  };

  const handleClear = (): void => {
    setStartDate('');
    setEndDate('');
    onFilterChange({ startDate: '', endDate: '' });
  };

  return (
    <div className='mb-4 d-flex align-items-center gap-3'>
      <div>
        <label className='form-label'>Data Inicial:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
          className='form-control'
        />
      </div>
      <div>
        <label className='form-label'>Data Final:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='d-flex gap-2' style={{ marginTop: '32px' }}>
        <Button color='primary' onClick={handleFilter}>
          Filtrar
        </Button>
        <Button color='light' onClick={handleClear}>
          Limpar
        </Button>
      </div>
    </div>
  );
};

export type { DateFilterState };
export default DateFilter;