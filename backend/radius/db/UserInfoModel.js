module.exports = (sequelize, DataTypes) => {
    var UserInfo = sequelize.define('UserInfo', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        username: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: DataTypes.STRING,
        department: DataTypes.STRING,
        company: DataTypes.STRING,
        workphone: DataTypes.STRING,
        homephone: DataTypes.STRING,
        mobilephone: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        country: DataTypes.STRING,
        zip: DataTypes.STRING,
        notes: DataTypes.STRING,
        changeuserinfo: DataTypes.STRING,
        portalloginpassword: DataTypes.STRING,
        enableportallogin: DataTypes.INTEGER,
        creationdate: DataTypes.DATE,
        creationby: DataTypes.STRING,
        updatedate: DataTypes.DATE,
        updateby: DataTypes.STRING
    },
    {
        // 自定义表名
        'freezeTableName': true,
        'tableName': 'userinfo',
        // 是否需要增加createdAt、updatedAt、deletedAt字段
        'timestamps': false,
        // 不需要createdAt字段
        'createdAt': false,
        // 将updatedAt字段改个名
        'updatedAt': false,
        'deletedAt': false
    });

    return UserInfo;
};
