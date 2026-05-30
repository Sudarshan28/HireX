import { motion } from 'framer-motion';
import { Calendar, Users, Eye, Edit2, Archive, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';

const JobCard = ({ job, onViewApplicants, onEdit, onClose }) => {
  const isClosed = job.status === 'closed';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-bg-card border border-border hover:border-accent-primary/40 transition-all rounded-xl p-6 relative flex flex-col group overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs text-text-muted font-mono block mb-1">
            Posted {formatDate(job.createdAt || new Date())}
          </span>
          <h3 className="text-lg font-display font-bold text-text-primary line-clamp-1">
            {job.title}
          </h3>
        </div>
        <Badge
          label={job.status || 'active'}
          type={isClosed ? 'neutral' : 'success'}
          className="capitalize"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge label={job.workMode} type="neutral" />
        <Badge label={job.jobType?.replace('-', ' ')} type="neutral" />
      </div>

      <div className="space-y-2 mb-6 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <MapPin size={14} /> {job.location || 'Remote'}
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} /> Deadline: {formatDate(job.applicationDeadline)}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-accent-primary/10 text-accent-primary px-3 py-1.5 rounded-full text-xs font-semibold">
          <Users size={14} />
          <span>{job.applicantCount || 0} Applicants</span>
        </div>
      </div>

      {/* Hover actions panel */}
      <div className="absolute inset-0 bg-bg-card/95 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 z-10">
        <button
          onClick={() => onViewApplicants(job._id)}
          className="w-full flex items-center justify-center gap-2 bg-accent-primary text-bg-primary font-display font-bold py-2.5 px-4 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
        >
          <Eye size={16} /> View Applicants
        </button>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => onEdit(job)}
            className="flex-1 flex items-center justify-center gap-2 border border-border hover:border-accent-primary hover:text-accent-primary text-text-muted py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Edit2 size={14} /> Edit
          </button>
          {!isClosed && (
            <button
              onClick={() => onClose(job._id)}
              className="flex-1 flex items-center justify-center gap-2 border border-border hover:border-danger hover:text-danger text-text-muted py-2 px-3 rounded-lg transition-colors text-sm"
            >
              <Archive size={14} /> Close
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
