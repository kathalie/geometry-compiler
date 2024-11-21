import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './database.js';

type TemplateAttributes = {
    id: number;
    content: string;
};

type TemplateCreationAttributes = Optional<TemplateAttributes, 'id'>;

class Template extends Model<TemplateAttributes, TemplateCreationAttributes> {
    declare id: number;
    declare content: string;
}

Template.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Template',
        tableName: 'templates',
        timestamps: false,
    }
);

export default Template;
