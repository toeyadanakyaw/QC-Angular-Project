// src/app/models/request-announce.model.ts
export enum Status {
  SOFT_DELETE = 0,
  APPROVE = 1,
  DECLINE = 2,
  PENDING = 3
}
export interface RequestAnnounce {
  id:number;
    title: string;
    content: string;   // This will be the announcement content from Quill editor
    company: string;
    department: string;
    positions: string[];
    scheduleDate: string;  // Format: YYYY-MM-DD
    scheduleHour: string;  // Format: HH:MM
    attachedFile?: File;   // Optional file attachment
    selectedUsers?: string[];
    createat?:string;
    cloudUrl: string;
  fileExtension: string;
  publicId: string;
  resourceType: string;
  status: Status; // Ensure this is Status enum
  }
  