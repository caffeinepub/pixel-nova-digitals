import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GenRecordEntry {
    metadata: string;
    createdAt: bigint;
    type: GenType;
    recordId: bigint;
    prompt: string;
}
export interface UserProfile {
    name: string;
}
export enum GenType {
    video = "video",
    text = "text",
    sound = "sound",
    image = "image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGenRecord(type: GenType, prompt: string, metadata: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGenRecord(recordId: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGenHistory(): Promise<Array<GenRecordEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
