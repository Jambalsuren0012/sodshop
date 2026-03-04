export interface Slider {
  id: number;
  title: string;
  subtitle?: string;
  button_text?: string | null;
  button_link?: string | null;
  image_url: string;
  sort_order?: number;
  status?: number;
}
