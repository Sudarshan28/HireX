import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color, dataStat }) => {
  return (
    <div 
      data-stat={dataStat}
      className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 relative overflow-hidden group hover:border-gray-300 transition-all"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full pointer-events-none"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <span className="text-xs font-mono text-gray-700 uppercase tracking-wider font-semibold">{title}</span>
        {Icon && (
          <div 
            className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 group-hover:scale-110 transition-transform"
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-baseline gap-2">
        <h3 className="text-3xl font-display font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={`text-xs font-mono font-bold ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
