export interface Candidate {
  id: number;
  name: string;
  stage: 'Applied' | 'Screened' | 'Interviewed' | 'Offered' | 'Hired' | 'Rejected';
  rating: number;
  appliedDate: string;
}

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  salary: string;
  description: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: 'Open' | 'Closed' | 'Draft';
  postedDate: string;
}

export interface Interview {
  id: number;
  candidate: string;
  interviewer: string;
  position: string;
  date: string;
  time: string;
  mode: 'Video' | 'In-person' | 'Phone';
  status: 'Scheduled' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface Offer {
  id: number;
  candidate: string;
  position: string;
  salary: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  sentDate: string;
  responseDate: string;
}
