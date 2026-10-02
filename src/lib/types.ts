export const resourceKinds = ['product','service','paper','software','case-study','dataset','framework','community'] as const;
export type ResourceKind = typeof resourceKinds[number];
export type Language = 'es' | 'en';

export interface Resource {
  id: string;
  slug: string;
  kind: ResourceKind;
  name: string;
  summary_es: string;
  summary_en: string;
  organization: string;
  year: number | null;
  source_url: string;
  evidence: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  reviewed_at: string;
  updated_at: string;
  tags_text: string;
  data: string;
}

export interface ResourceData {
  techniques: string[];
  environments: string[];
  tags: string[];
  review_basis: 'source-page' | 'repository-metadata' | 'publisher-metadata' | 'abstract' | 'full-text';
  access_date: string;
  license?: string;
  doi?: string;
  journal?: string;
  authors?: string[];
  limitations_es?: string;
  limitations_en?: string;
  disclosure_es?: string;
  disclosure_en?: string;
  source_title?: string;
  organization_country?: string;
  deployment_regions?: string[];
  sectors?: string[];
  source_language?: string;
  design_es?: string;
  design_en?: string;
  finding_es?: string;
  finding_en?: string;
  limits_es?: string;
  limits_en?: string;
  full_text_reviewed_at?: string;
  extraction_status?: string;
  adjudication_status?: string;
  page_anchors?: string[];
  full_text_source_url?: string;
  provenance_note_es?: string;
  provenance_note_en?: string;
  prior_summary_es?: string;
  prior_summary_en?: string;
}

export function parseData(resource: Resource): ResourceData {
  return JSON.parse(resource.data) as ResourceData;
}
