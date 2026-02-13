import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HomePageContent {
    heroSubtitle: string;
    branding: Branding;
    heroTitle: string;
    premiumSection: string;
    freeSection: string;
}
export interface GenRecordEntry {
    metadata: string;
    createdAt: bigint;
    type: GenType;
    recordId: bigint;
    prompt: string;
}
export type WebsiteState = {
    __kind__: "active";
    active: null;
} | {
    __kind__: "retired";
    retired: {
        message?: string;
    };
};
export interface Branding {
    tagLine: string;
    heroBadge: string;
    logoFile?: string;
    brandName: string;
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
    getHomepageContent(): Promise<HomePageContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWebsiteStatus(): Promise<WebsiteState>;
    isCallerAdmin(): Promise<boolean>;
    purgeData(): Promise<void>;
    reactivateWebsite(): Promise<void>;
    retireWebsite(message: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGenRecord(recordId: bigint, newType: GenType, newPrompt: string, newMetadata: string): Promise<void>;
    updateHomepageContent(content: HomePageContent): Promise<void>;
}
