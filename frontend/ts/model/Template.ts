export interface Template {
    id: number;
    content: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
}