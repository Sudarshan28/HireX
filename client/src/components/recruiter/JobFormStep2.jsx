import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import Button from '../common/Button';
import SkillChip from '../common/SkillChip';

const JobFormStep2 = ({ register, errors, watch, setValue, onNext, onBack }) => {
  const description = watch('description') || '';
  const responsibilities = watch('responsibilities') || [];
  const requirements = watch('requirements') || [];
  const requiredSkills = watch('requiredSkills') || [];
  const niceToHaveSkills = watch('niceToHaveSkills') || [];

  const [respInput, setRespInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [niceSkillInput, setNiceSkillInput] = useState('');

  const handleAddResponsibility = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && respInput.trim()) {
      e.preventDefault();
      if (!responsibilities.includes(respInput.trim())) {
        setValue('responsibilities', [...responsibilities, respInput.trim()]);
      }
      setRespInput('');
    }
  };

  const handleAddRequirement = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && reqInput.trim()) {
      e.preventDefault();
      if (!requirements.includes(reqInput.trim())) {
        setValue('requirements', [...requirements, reqInput.trim()]);
      }
      setReqInput('');
    }
  };

  const handleAddRequiredSkill = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && reqSkillInput.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(reqSkillInput.trim())) {
        setValue('requiredSkills', [...requiredSkills, reqSkillInput.trim()]);
      }
      setReqSkillInput('');
    }
  };

  const handleAddNiceSkill = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && niceSkillInput.trim()) {
      e.preventDefault();
      if (!niceToHaveSkills.includes(niceSkillInput.trim())) {
        setValue('niceToHaveSkills', [...niceToHaveSkills, niceSkillInput.trim()]);
      }
      setNiceSkillInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-display font-semibold mb-6">Step 2: Job Specifications</h2>

      {/* Description */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-text-muted font-medium">Job Description</label>
          <span className="text-xs text-text-muted font-mono">{description.length} chars (min 100)</span>
        </div>
        <textarea
          {...register('description', { 
            required: 'Description is required',
            minLength: { value: 100, message: 'Description must be at least 100 characters' }
          })}
          className={`w-full bg-bg-surface border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all duration-200 min-h-[150px] ${
            errors.description ? 'border-danger' : 'border-border'
          }`}
          placeholder="Provide detailed description of the role..."
        />
        {errors.description && <span className="text-xs text-danger mt-1 block">{errors.description.message}</span>}
      </div>

      {/* Required Skills */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-1 block">Required Skills</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={reqSkillInput}
            onChange={(e) => setReqSkillInput(e.target.value)}
            onKeyDown={handleAddRequiredSkill}
            placeholder="Type skill + Enter..."
            className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
          />
          <button type="button" onClick={handleAddRequiredSkill} className="p-2 bg-bg-surface border border-border rounded-lg text-accent-primary hover:bg-bg-card">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {requiredSkills.map((skill, index) => (
            <SkillChip key={index} skill={skill} matched={true} removable={true} onRemove={() => setValue('requiredSkills', requiredSkills.filter(s => s !== skill))} />
          ))}
        </div>
      </div>

      {/* Nice to Have Skills */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-1 block">Nice-to-Have Skills</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={niceSkillInput}
            onChange={(e) => setNiceSkillInput(e.target.value)}
            onKeyDown={handleAddNiceSkill}
            placeholder="Type skill + Enter..."
            className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
          />
          <button type="button" onClick={handleAddNiceSkill} className="p-2 bg-bg-surface border border-border rounded-lg text-text-muted hover:bg-bg-card">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {niceToHaveSkills.map((skill, index) => (
            <SkillChip key={index} skill={skill} matched={false} removable={true} onRemove={() => setValue('niceToHaveSkills', niceToHaveSkills.filter(s => s !== skill))} />
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-1 block">Responsibilities</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={respInput}
            onChange={(e) => setRespInput(e.target.value)}
            onKeyDown={handleAddResponsibility}
            placeholder="Type responsibility + Enter..."
            className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
          />
          <button type="button" onClick={handleAddResponsibility} className="p-2 bg-bg-surface border border-border rounded-lg text-accent-primary hover:bg-bg-card">
            <Plus size={18} />
          </button>
        </div>
        <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {responsibilities.map((resp, idx) => (
            <li key={idx} className="flex justify-between items-center bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary">
              <span className="line-clamp-2">{resp}</span>
              <button type="button" onClick={() => setValue('responsibilities', responsibilities.filter((_, i) => i !== idx))} className="text-text-muted hover:text-danger">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-1 block">Requirements</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={handleAddRequirement}
            placeholder="Type requirement + Enter..."
            className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
          />
          <button type="button" onClick={handleAddRequirement} className="p-2 bg-bg-surface border border-border rounded-lg text-accent-primary hover:bg-bg-card">
            <Plus size={18} />
          </button>
        </div>
        <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {requirements.map((req, idx) => (
            <li key={idx} className="flex justify-between items-center bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary">
              <span className="line-clamp-2">{req}</span>
              <button type="button" onClick={() => setValue('requirements', requirements.filter((_, i) => i !== idx))} className="text-text-muted hover:text-danger">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between gap-4 pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Next →
        </Button>
      </div>
    </motion.div>
  );
};

export default JobFormStep2;
