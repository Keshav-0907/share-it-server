import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    subscription: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    subscription: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    name: string;
    email: string;
    password: string;
    subscription: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    email: string;
    password: string;
    subscription: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    email: string;
    password: string;
    subscription: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    name: string;
    email: string;
    password: string;
    subscription: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=userSchema.d.ts.map