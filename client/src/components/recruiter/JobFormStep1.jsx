import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';

const JobFormStep1 = ({ register, errors, watch, setValue, onNext }) => {
  const selectedJobType = watch('jobType') || 'full-time';
  const selectedWorkMode = watch('workMode') || 'remote';
  const selectedExpLevel = watch('experienceLevel') || 'junior';

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' },
  ];

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'on-site', label: 'On-site' },
  ];

  const expLevels = [
    { value: 'fresher', label: 'Fresher' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid-level', label: 'Mid-level' },
    { value: 'senior', label: 'Senior' },
  ];

  // Disable location field if Remote is selected
  const isRemote = selectedWorkMode === 'remote';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-display font-semibold mb-6">Step 1: Basic Information</h2>

      <Input
        label="Job Title"
        placeholder="e.g. Senior Frontend Engineer"
        error={errors.title?.message}
        {...register('title', { required: 'Job title is required' })}
      />

      {/* Job Type styled cards */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-2 block">Job Type</label>
        <div className="grid grid-cols-2 gap-3">
          {jobTypes.map((type) => (
            <div
              key={type.value}
              onClick={() => setValue('jobType', type.value)}
              className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                selectedJobType === type.value
                  ? 'border-accent-primary bg-accent-primary/5 text-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                  : 'border-border bg-bg-surface text-text-muted hover:border-text-muted hover:text-text-primary'
              }`}
            >
              <span className="text-sm font-semibold">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Work Mode styled cards */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-2 block">Work Mode</label>
        <div className="grid grid-cols-3 gap-3">
          {workModes.map((mode) => (
            <div
              key={mode.value}
              onClick={() => {
                setValue('workMode', mode.value);
                if (mode.value === 'remote') {
                  setValue('location', 'Remote');
                } else if (watch('location') === 'Remote') {
                  setValue('location', '');
                }
              }}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                selectedWorkMode === mode.value
                  ? 'border-accent-primary bg-accent-primary/5 text-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                  : 'border-border bg-bg-surface text-text-muted hover:border-text-muted hover:text-text-primary'
              }`}
            >
              <span className="text-sm font-semibold">{mode.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Level styled cards */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-2 block">Experience Level</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {expLevels.map((lvl) => (
            <div
              key={lvl.value}
              onClick={() => setValue('experienceLevel', lvl.value)}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                selectedExpLevel === lvl.value
                  ? 'border-accent-primary bg-accent-primary/5 text-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                  : 'border-border bg-bg-surface text-text-muted hover:border-text-muted hover:text-text-primary'
              }`}
            >
              <span className="text-xs font-semibold">{lvl.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <Input
        label="Location"
        placeholder="City, Country"
        disabled={isRemote}
        error={errors.location?.message}
        {...register('location', { required: !isRemote && 'Location is required' })}
      />

      {/* Application Deadline */}
      <Input
        label="Application Deadline"
        type="date"
        error={errors.applicationDeadline?.message}
        {...register('applicationDeadline', { required: 'Deadline is required' })}
      />

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="button" onClick={onNext} className="w-full sm:w-auto">
          Next →
        </Button>
      </div>
    </motion.div>
  );
};

export default JobFormStep1;
