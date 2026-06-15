export interface User {
  id: number;
  name: string;
  email: string;
  roles: { id: number; name: string }[];
  permissions: { id: number; name: string }[];
}

export interface Employee {
  id: number;
  employee_id: string;
  nik: string;
  full_name: string;
  dob: string | null;
  gender: "M" | "F" | null;
  address: string | null;
  phone: string | null;
  email: string;
  join_date: string | null;
  position: string | null;
  department: string | null;
  site: string | null;
  status: "Active" | "Inactive" | "Terminated" | "Resigned";
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeContract {
  id: number;
  employee_id: number;
  contract_number: string;
  contract_type: "PKWT" | "PKWTT" | "Internship" | "Probation";
  start_date: string;
  end_date: string | null;
  document_path: string | null;
  status: "Active" | "Expired" | "Terminated";
}

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  document_type: "KTP" | "KK" | "NPWP" | "BPJS" | "Ijazah" | "Sertifikat" | "Other";
  document_name: string;
  file_path: string | null;
  expiry_date: string | null;
}

export interface EmployeeHistory {
  id: number;
  employee_id: number;
  change_type: string;
  description: string;
  effective_date: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  error?: { message: string };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
