import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, MapPin, DollarSign } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Badge from '../common/Badge';

const JobFormStep3 = ({ register, errors, watch, setValue, onBack, loading }) => {
  const currency = watch('currency') || 'USD';
  const salaryMin = watch('salaryMin') || 0;
  const salaryMax = watch('salaryMax') || 0;
  const jobTags = watch('tags') || [];

  // Watch fields for preview card
  const title = watch('title') || 'Job Title';
  const workMode = watch('workMode') || 'remote';
  const jobType = watch('jobType') || 'full-time';
  const location = watch('location') || 'Remote';
  const deadline = watch('applicationDeadline') || '';

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && tagInput.trim()) {
      e.preventDefault();
      if (!jobTags.includes(tagInput.trim())) {
        setValue('tags', [...jobTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto"
    >
      {/* Left Input Pane */}
      <div className="w-full lg:w-1/2 space-y-6">
        <h2 className="text-xl font-display font-semibold mb-6">Step 3: Compensation & Review</h2>

        <div>
          <label className="text-sm text-text-muted font-medium mb-1 block">Currency</label>
          <select
            {...register('currency')}
            className="w-full bg-bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="INR">INR (₹)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Salary"
            type="number"
            placeholder="50000"
            error={errors.salaryMin?.message}
            {...register('salaryMin', { required: 'Minimum salary is required' })}
          />
          <Input
            label="Max Salary"
            type="number"
            placeholder="100000"
            error={errors.salaryMax?.message}
            {...register('salaryMax', { required: 'Maximum salary is required' })}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm text-text-muted font-medium mb-1 block">Job Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. React, Remote (Press Enter)..."
              className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
            />
            <button type="button" onClick={handleAddTag} className="p-2 bg-bg-surface border border-border rounded-lg text-accent-primary hover:bg-bg-card">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jobTags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-bg-surface border border-border text-xs text-text-muted">
                {tag}
                <button type="button" onClick={() => setValue('tags', jobTags.filter(t => t !== tag))} className="text-text-muted hover:text-white">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-4 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1" disabled={loading}>
            ← Back
          </Button>
          <Button type="submit" className="flex-1 shadow-[0_0_15px_rgba(0,255,136,0.3)]" disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin mx-auto" /> : 'Post Job'}
          </Button>
        </div>
      </div>

      {/* Right Live Preview Pane */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <h3 className="text-sm text-text-muted font-medium uppercase tracking-wider mb-4">Live Preview</h3>
        <motion.div
          layout
          className="bg-bg-card border border-border rounded-xl p-6 relative overflow-hidden flex flex-col shadow-lg border-accent-primary/20"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs text-text-muted font-mono block mb-1">
                Post Preview
              </span>
              <motion.h3 layout="position" className="text-lg font-display font-bold text-text-primary">
                {title}
              </motion.h3>
            </div>
            <Badge label="Active" type="success" />
          </div>

          <motion.div layout="position" className="flex flex-wrap gap-2 mb-4">
            <Badge label={workMode} type="neutral" />
            <Badge label={jobType.replace('-', ' ')} type="neutral" />
          </motion.div>

          <motion.div layout="position" className="space-y-2 mb-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <MapPin size={14} /> {location}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} /> Deadline: {deadline || 'YYYY-MM-DD'}
            </div>
            <div className="flex items-center gap-2 text-accent-primary font-medium">
              <DollarSign size={14} /> {currency} {Number(salaryMin).toLocaleString()} - {Number(salaryMax).toLocaleString()}
            </div>
          </motion.div>

          <motion.div layout="position" className="flex flex-wrap gap-1 mt-auto pt-4 border-t border-border/50">
            {jobTags.map((tag, idx) => (
              <span key={idx} className="text-[10px] uppercase font-mono px-2 py-0.5 bg-bg-surface border border-border rounded text-text-muted">
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JobFormStep3;
