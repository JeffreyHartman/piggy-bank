// src/types/pig.ts
export interface ConnectionPoint {
  x: number;
  y: number;
}

export interface PigPart {
  id: string;
  name: string;
  type: 'body' | 'head' | 'eyes' | 'ears' | 'nose' | 'accessories';
  svgPath: string;
  connectionPoints: {
    [key: string]: ConnectionPoint;
  };
  // Additional attributes like color options, unlocked status, etc.
  colorOptions?: string[];
  unlocked: boolean;
  previewImage?: string;
}
