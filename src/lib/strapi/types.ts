export type StrapiPaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiMeta = {
  pagination?: StrapiPaginationMeta;
  [key: string]: unknown;
};

export type StrapiEntity<T = Record<string, unknown>> = {
  id?: string;
  documentId?: string;
} & T;

export type StrapiCollectionResponse<T> = {
  data: Array<StrapiEntity<T>>;
  meta: StrapiMeta;
};

export type StrapiSingleResponse<T> = {
  data: StrapiEntity<T> | null;
  meta: StrapiMeta;
};

export type StrapiQueryPrimitive = string | number | boolean | null | undefined;

export type StrapiQueryValue =
  | StrapiQueryPrimitive
  | StrapiQueryValue[]
  | { [key: string]: StrapiQueryValue };

export type StrapiQueryRecord = Record<string, StrapiQueryValue>;

export type StrapiQueryInput = string | URLSearchParams | StrapiQueryRecord;

export type StrapiPublicListResponse<T> = {
  data: T[];
};

export type StrapiTestimonialRecord = {
  id?: string;
  documentId?: string;
  name: string;
  role: string;
  dealType: string;
  quote: string;
  sortOrder: number;
  profilePic: string | null;
};

export type StrapiTestimonialsPublicResponse =
  StrapiPublicListResponse<StrapiTestimonialRecord>;

export type StrapiStaffMemberRecord = {
  id?: string;
  documentId?: string;
  name: string;
  title: string;
  bio: string | null;
  email: string | null;
  phoneNumber: string | null;
  linkedinUrl: string | null;
  sortOrder: number;
  profilePic: string | null;
};

export type StrapiStaffTeamResponse = StrapiPublicListResponse<StrapiStaffMemberRecord>;

export type StrapiPositionSectionRecord = {
  heading: string;
  items: string[];
};

export type StrapiPositionRecord = {
  id?: string;
  documentId?: string;
  title: string;
  subtitle: string;
  slug: string;
  compensation: string;
  employmentType: string;
  jobType: string;
  department: string;
  isActive: boolean;
  deadline: string | null;
  overview: string[];
  sections: StrapiPositionSectionRecord[];
};

export type StrapiPositionListResult = {
  data: StrapiPositionRecord[];
  meta: StrapiMeta;
};

export type StrapiPositionDetailResult = {
  data: StrapiPositionRecord | null;
  meta?: StrapiMeta;
};

export type StrapiApplicationSubmitPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  linkedin?: string;
  whyZeustra?: string;
  position: string;
};
