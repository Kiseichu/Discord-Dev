const conn = require('./db_connection');

/**
 * This function it's used to add an user in DataBase
 * @param {Number} id_discord
 * @param {String} email
 * @return {callback} callback
 */
function add_user(id_discord, email, callback) {
    let values = [id_discord, email];
    let sql = "INSERT INTO user VALUES (?, ?)";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    return db.run(sql, values, function(err) {
        if (err) {
            return callback(false, err.message);
        } else {
            return callback(true, "OK");
        }
    });
}

/**
 * This function is used to delete an user of the Database
 * @param {Integer} id_discord
 * @param {callback} callback
 * @return {callback} callback
 */
function delete_user(id_discord, callback) {
    let sql = "DELETE FROM user WHERE id_discord=(?)";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.run(sql, [id_discord], (err) => {
        if (err) {
            return callback(false, err.message);
        } else {
            return callback(true, "OK");
        }
    });
}

/**
 * This function is used to get an user mail with the id discord
 * @param {Integer} id_discord of the user
 * @param {callback} callback
 * @return {callback} callback
 */
function get_user_email(id_discord, callback) {
    let sql = "SELECT email_epitech FROM user WHERE id_discord=(?)";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    db.get(sql, [id_discord], (err, res) => {
        if (err) {
            return callback(false, err.message);
        }
        if (res === undefined)
            return callback(false, "error")
        return callback(true, res.email_epitech);
    });
}

/**
 * This function is used to get an user by email
 * @param {String} email_epitech
 * @param {callback} callback
 * @return {callback} callback
 */
function get_user_id(email_epitech, callback) {
    let sql = "SELECT id_discord FROM user WHERE email_epitech=(?)";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    db.get(sql, [email_epitech], (err, res) => {
        if (err) return callback(false, err.message);
        if (res === undefined)
            return callback(false, "error")
        return callback(true, res.id_discord);
    });
}

/**
 * This function is used to get the Max ID
 * @param {String} table
 * @param {Integer} value 
 * @param {callback} callback
 * @return {callback} callback
 */
function getMAxID(table, value, callback) {
    let sql = "SELECT MAX(" + value + ") AS yolo FROM " + table + ";";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    return db.get(sql, [], (err, row) => {
        if (err) {
            return callback(false, err.message);
        } else {
            let maxid = row.yolo;
            return callback(true, maxid);
        }
    });
}

/**
 * This function is used to create an activity
 * @param {String} title
 * @param {Integer} maxStudent
 * @param {callback} callback 
 */
function create_activity(title, maxStudent, callback) {
    let values = [title, maxStudent];
    let sql = "INSERT INTO activities VALUES (NULL, ?, ?, 0, '" + new Date() + "')";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.run(sql, values, function(err) {
        if (err) {
            return callback(false, err.message);
        } else {
            getMAxID("activities", "id", (res, value) => {
                let maxid = value;
                return callback(true, (parseInt(maxid, 10) ? maxid : "ERROR"));
            });
        }
    });
}

/**
 * This function is used to start Presences on activity
 * @param {Integer} activityID
 * @param {callback} callback
 * @return {callback} callback
 */
function startPresence(activityID, callback) {
    let values = [activityID];
    let sql = "UPDATE activities SET presence = 1 WHERE id = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    return db.run(sql, values, function(err) {
        if (err) {
            return callback(false, err.message);
        } else {
            return callback(true, "OKI");
        }
    });
}

/**
 * This function is used to stop Presences of activity
 * @param {Integer} activityID
 * @param {callback} callback
 * @return {callback} callback
 */
function stopPresence(activityID, callback) {
    let values = [activityID];
    let sql = "UPDATE activities SET presence = 0 WHERE id = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.run(sql, values, function(err) {
        if (err) {
            return callback(false, err.message);
        } else {
            return callback(true, "OKI");
        }
    });
}

/**
 * This function is used to check if the student is marked present or absent
 * @param {Integer} activityID 
 * @param {String} email 
 * @param {callback} callback
 * @return {callback} callback
 */
function checkPresent(activityID, email, callback) {
    let values = [activityID, email];
    let sql = "SELECT * FROM activities_logs WHERE activity_id = ? AND email = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    return db.get(sql, values, (err, row) => {
        if (err) {
            return callback(false, err.message);
        } else {
            if (row === undefined)
                return callback(true, "wtf");
            return callback(true, (row.status === "present" ? true:false));
        }
    });
}

/**
 * This function is used to get 10 activity for presence
 * 
 * @param {callback} callback 
 * @return {callback} callback
 */
function getAllActivityPresence(callback) {
    let sql = "SELECT * FROM activities ORDER BY id DESC LIMIT 10;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });

    return db.all(sql, [], (err, row) => {
        if (err) {
            return callback(false, err.message);
        } else {

            return callback(true, row);
        }
    });
}

/**
 * This function is used to get presence
 * @param {Integer} index
 * @param {callback} callback
 * @return {callback} callback
 */
function getPresence(index, callback) {
    let values = [index];
    let sql = "SELECT * FROM activities_logs WHERE activity_id = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.all(sql, values, (err, row) => {
        if (err) {
            return callback(false, err.message);
        } else {
            return callback(true, row);
        }
    });
}

/**
 * This function is used to initialize Activity Presence
 * @param {String} email
 * @param {Integer} activityID 
 * @param {callback} callback 
 * @return {callback} callback
 */
function initPresence(email, activityID, callback) {
    let values = [email, activityID];
    let sql = "INSERT INTO activities_logs VALUES (NULL, ?, ?, '" + new Date() + "', 'absent')";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.run(sql, values, (err, row) => {
        if (err) {
            return callback(false, err.message);
        } else {
            return callback(true, "NoError");
        }
    });
}

/**
 * This function is used to check if the activity is enable
 * @param {Integer} activityID
 * @param {callback} callback 
 * @return {callback} callback
 */
function checkIsEnable(activityID, callback) {
    let values = [activityID];
    let sql = "SELECT * FROM activities WHERE id = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.get(sql, values, (err, row) => {
        if (err) {     
            return callback(false, err.message);
        } else {
            return callback(true, (row.presence === 1 ? true:false));
        }
    });
}

/**
 * This function is used to get activity title by id
 * @param {Integer} indx 
 * @param {callback} callback
 * @return {callback} callback 
 */
function getActivityTitle(indx, callback) {
    let values = [indx];
    let sql = "SELECT * FROM activities WHERE id = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.get(sql, values, (err, row) => {
        if (err) {     
            return callback(false, err.message);
        } else {
            return callback(true, (row !== undefined? row.title:"nothing"));
        }
    });
}

/**
 * This function is used to set present on activity
 * @param {Integer} activityID 
 * @param {String} email
 * @return {callback} callback 
 */
function setPresent(activityID, email, callback) {
    let values = [email, activityID];
    let sql = "UPDATE activities_logs set current_date = '" + new Date() + "', status = 'present' WHERE email = ? AND activity_id = ?;";
    let db = conn.init_db((res, msg) => {
        if (res === false)
            return callback(false, msg);
    });
    return db.run(sql, values, function(err) {
        if (err) {     
            return callback(false, err.message);
        } else {
            return callback(true, "OKI");
        }
    });
}

/** @module data/db */
module.exports = {getActivityTitle, initPresence, getPresence, getAllActivityPresence, checkIsEnable, checkPresent, setPresent, stopPresence, startPresence, delete_user, add_user, get_user_id, get_user_email, create_activity};