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
        id?: number;
      
        title: string;
        content: string;
        category: string;
      
        isPrivate?: boolean;
        isNSFW?: boolean;
        
        userId?: number;
      
        views?: number;
        likes?: number;
        liked?: boolean;

        commentCount?: number;
      
        createdAt?: string;
        updatedAt?: string;
      
        User?: {
          id?: number;
          username: string;
          profilePic?: string;
        };
      
        Comments?: CommentType[];
      };
export type UserType = {
        username: string,
        profilePic: string,
        nsfwOk: boolean,
        isAdmin: boolean,
        dreams: DreamType[],
        Comments: CommentType[],
        id: number
}