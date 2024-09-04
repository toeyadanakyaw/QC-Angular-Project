export interface UserData{
    id: number;
    staff_id: string;
    name: string
    email: string;
    role: string;
    ph_number: string;
    // position: string;
    registration_code: string;
    // photoUrl: string;
    photoUrl: string | null; 
    position: {
        id?: number;
        name?: string;
    }
    company: {
        id?: number;
        name?: string;
    };
    department: {
        id?: number;
        name?: string;
        company: {
            name: string;
        }
    }

}