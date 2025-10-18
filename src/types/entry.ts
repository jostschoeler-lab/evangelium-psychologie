export interface Entry {
  id?: string;
  created_at?: string;
  updated_at?: string;
  bible_reference?: string;
  theological_explanation?: string;
  psychological_term?: string;
  bridge_text?: string;
  tags?: string | string[];
  visibility?: string;
  notes?: string;
  psychology_comment?: string;
  theological_background?: string;
  psychological_background?: string;
}
