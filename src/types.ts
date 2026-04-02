export interface Counselor {
  id: number;
  name: string;
  title: string;
  education: string;
  certifications: string;
  style: string;
  tags: string;
  image_url: string;
}

export interface Program {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string;
}

export interface Reservation {
  id?: number;
  name: string;
  phone: string;
  program_id: number;
  preferred_date: string;
  preferred_time: string;
  status?: string;
}
