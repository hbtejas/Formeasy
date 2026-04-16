import { Schema, model, type InferSchemaType } from "mongoose";

const teamMemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["owner", "member"], default: "member" },
    invitedAt: { type: Date, default: Date.now },
    joinedAt: { type: Date, default: null }
  },
  { _id: false }
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: { type: [teamMemberSchema], default: [] }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;
export const TeamModel = model("Team", teamSchema);
