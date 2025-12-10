import { Cliente } from "@/types/client";

export interface ClientSearchPagination {
    clients?: Cliente[];
    clientes?: Cliente[];
    total: number;
    pages: number;    
}
