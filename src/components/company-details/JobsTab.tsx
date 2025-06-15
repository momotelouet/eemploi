
import JobCard from "@/components/JobCard";

type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedAt: string;
};

type JobsTabProps = {
    jobs: Job[];
};

const JobsTab = ({ jobs }: JobsTabProps) => {
    return (
        <div className="space-y-6">
            {jobs.map((job) => (
                <JobCard key={job.id} {...job} />
            ))}
        </div>
    );
};

export default JobsTab;
