export interface AuthResponse{
    access_token:string,
    refresh_token:string
}

export interface LoginResponse{
    message:string
}

export interface User{
    id:Number,
    firstname:string,
    lastname:string,
    username:string,
    role:string,
    enabled:boolean

}

export interface UpdateUser{
    role:string,
    enabled:boolean
}
