import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const DataTable = ({ columns, data, sortable = true, onRowClick, loading, pagination }) => {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-bg-surface rounded-lg animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm text-text-primary">
        <thead className="bg-bg-surface text-text-muted font-display uppercase border-b border-border">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-6 py-4 ${col.sortable !== false && sortable ? 'cursor-pointer hover:text-text-primary transition-colors' : ''}`}
                onClick={() => col.sortable !== false && sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable !== false && sortable && (
                    <div className="flex flex-col">
                      <ChevronUp size={10} className={`${sortConfig?.key === col.key && sortConfig?.direction === 'asc' ? 'text-accent-primary' : 'text-text-muted/30'}`} />
                      <ChevronDown size={10} className={`-mt-1 ${sortConfig?.key === col.key && sortConfig?.direction === 'desc' ? 'text-accent-primary' : 'text-text-muted/30'}`} />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIdx) => (
            <motion.tr
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIdx * 0.03 }}
              key={row.id || rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-border/50 hover:bg-bg-surface/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-text-muted">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pagination && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-bg-primary text-text-muted text-sm">
          <div>
            Showing <span className="font-medium text-text-primary">1</span> to <span className="font-medium text-text-primary">{sortedData.length}</span> of <span className="font-medium text-text-primary">{sortedData.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded hover:bg-bg-surface disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-bg-surface disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
