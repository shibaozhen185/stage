module.exports = (sequelize, DataTypes) => {
    var Radacct = sequelize.define('Radacct', {
            radacctid: {type: DataTypes.INTEGER, primaryKey: true},
            acctsessionid: DataTypes.STRING,
            acctuniqueid: DataTypes.STRING,
            username: DataTypes.STRING,
            groupname: DataTypes.STRING,
            realm: DataTypes.STRING,
            nasipaddress: DataTypes.STRING,
            nasportid: DataTypes.STRING,
            nasporttype: DataTypes.STRING,
            acctstarttime:  DataTypes.DATE,
            acctstoptime: DataTypes.DATE,
            acctsessiontime: DataTypes.DATE,
            acctauthentic: DataTypes.STRING,
            connectinfo_start: DataTypes.STRING,
            connectinfo_stop: DataTypes.STRING,
            acctinputoctets: DataTypes.INTEGER,
            acctoutputoctets: DataTypes.INTEGER,
            calledstationid: DataTypes.STRING,
            callingstationid: DataTypes.STRING,
            acctterminatecause: DataTypes.STRING,
            servicetype: DataTypes.STRING,
            framedprotocol: DataTypes.STRING,
            framedipaddress: DataTypes.STRING,
            acctstartdelay: DataTypes.INTEGER,
            acctstopdelay: DataTypes.INTEGER,
            acctupdatetime: DataTypes.DATE
        },
        {
            // 自定义表名
            'freezeTableName': true,
            'tableName': 'radacct',
            // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': false,
            // 不需要createdAt字段
            'createdAt': false,
            // 将updatedAt字段改个名
            'updatedAt': false,
            'deletedAt': false
        });

    return Radacct;
};
