import mongoose from 'mongoose';
import i18n from '../middlewares/lang.middleware.js'
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'companies'
        },
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'projects'
        },
        manager_id: {
            type: [{
                id: mongoose.Schema.Types.ObjectId,
                manager_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'users'
                },
                createdAt: {
                    type: Date(),
                    required: true,
                },
                created_by: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                }
            }],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            default: null,
            enum: i18n.__("position.enums.level")
        },
        is_active: {
            type: Boolean,
            default: 1
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)

const Position = mongoose.model('positions', schema);

export default Position;
