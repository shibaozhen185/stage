module.exports = (sequelize, DataTypes) => {
    var Radcheck = sequelize.define('Radcheck', {
            id: {type: DataTypes.INTEGER, primaryKey: true},
            username: DataTypes.STRING,
            attribute: DataTypes.STRING,
            op: DataTypes.STRING,
            value: DataTypes.STRING
        },
        {
            // 自定义表名
            'freezeTableName': true,
            'tableName': 'radcheck',
            // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': false,
            // 不需要createdAt字段
            'createdAt': false,
            // 将updatedAt字段改个名
            'updatedAt': false,
            'deletedAt': false
        });

    return Radcheck;
};
