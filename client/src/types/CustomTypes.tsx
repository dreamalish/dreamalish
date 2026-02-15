export type CommentType = {
        content: string,
        dreamId?: number,
        userId?: number,
        id?: number,
        user?: {
                username: string,
                profilePic: string
        },
        dream?: DreamType
}
export type DreamType = {
        content: string,
        category: string,
        userId?: number,
        isNSFW?: boolean,
        title: string,
        id?: number,
        user?: UserType,
        views?: number,
        createdAt?: string,
        updatedAt?: string,
        Comments?: CommentType[]
}
export type UserType = {
        username: string,
        profilePic: string,
        nsfwOk: boolean,
        isAdmin: boolean,
        dreams: DreamType[],
        Comments: CommentType[],
        id: number
}