
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Emoji {
    _id: string;
    user: User;
    conversation: Conversation;
    emoji: string;
    skinTone: string;
}

export interface Member {
    isBlocked: boolean;
    createdAt: number;
    deletedAt: number;
    isDeleted: boolean;
}

export interface Assets {
    _id: string;
    owner: User;
    originalName: string;
    fileType: string;
    createdAt: number;
}

export interface Message {
    _id: string;
    sender: User;
    destination: Conversation[];
    parentMessage: Message[];
    content: string;
    isDeleted: boolean;
    createdAt: number;
    status: string;
    type: string;
    scale: number;
    isRecall: boolean;
    attach: Assets;
}

export interface Status {
    code: string;
    name: string;
}

export interface FriendShip {
    _id: string;
    userRequest: User;
    userAddress: User;
    status: Status;
    user: User;
    flag: string;
}

export interface Conversation {
    _id: string;
    name: string;
    members: User[];
    type: string;
    visible: boolean;
    messages: Message[];
    owner: User;
    avatarUrl: string;
    isBlocked: boolean;
    isDeleted: boolean;
    deletedAt: number;
    createdAt: number;
    lastMessage: Message;
    friendship: FriendShip;
    updateAt: number;
    emoji: Emoji[];
}

export interface User {
    _id: string;
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    birthday: string;
    lastOnline: number;
    friends: User[];
    owner: Conversation[];
    gender: string;
}

export interface IQuery {
    user(_id: string): User | Promise<User>;
    getMe(): User | Promise<User>;
    conversations(): Conversation[] | Promise<Conversation[]>;
    conversation(_id: string): Conversation | Promise<Conversation>;
    memberDetails(userId: string, conversationId: string): Member[] | Promise<Member[]>;
}

type Nullable<T> = T | null;
