import { type } from "os";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Message } from "~/message/entities/message.entity";
import { User } from "~/user/entities/user.entity";
export enum AssetType {
    Image = "image",
    Video = "video",
    Audio = "audio",
    Document = "document",
    Docx = "docx",
    Xlsx = "xlsx",
    Pptx = "pptx",
    Pdf = "pdf",
    Zip = "zip",
    Text = "text",
    Other = "other",
}
// exchange file extension to asset type
export const getAssetType = (ext: string): AssetType => {
    switch (ext) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "svg":
            return AssetType.Image;
        case "mp4":
        case "avi":
        case "mov":
        case "mkv":
            return AssetType.Video;
        case "mp3":
        case "wav":
        case "ogg":
            return AssetType.Audio;
        case "doc":
        case "docx":
            return AssetType.Docx;
        case "xls":
        case "xlsx":
            return AssetType.Xlsx;
        case "ppt":
        case "pptx":
            return AssetType.Pptx;
        case "pdf":
            return AssetType.Pdf;
        case "zip":
        case "rar":
            return AssetType.Zip;
        case "txt":
            return AssetType.Text;
        default:
            return AssetType.Other;
    }
};

@Entity()
export class Assets{
    @PrimaryColumn({
        generated: "uuid",
    })
    _id: string;
    @ManyToOne(type => User, {onDelete: "CASCADE"})
    @JoinColumn({
        name: "owner"
    })
    owner: User;
    @Column()
    originalName: string;
    @Column(
        "enum",
        {
            enum: AssetType,
        }
    )
    fileType: AssetType
    @Column({
        type: "bigint",
        default: Date.now()
    })
    createdAt: number;
    @ManyToMany(type => Message)
    @JoinTable({
        name: "messageAttachment",
    })
    message: Message[]
}