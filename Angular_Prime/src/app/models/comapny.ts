import { Department } from "./department";

export interface Company{
    id?: number;
    name?: string;

    department?: Department[];
}