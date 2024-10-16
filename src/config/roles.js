const roles = ['user', 'admin','employee'];
const adminRoles = ['admin','employee']; //only this roles can login to dashboard

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', "manageUsers"]);
roleRights.set(roles[1], ['getUsers', 'adminAccess', 'manageUsers']);
roleRights.set(roles[2], ['getUsers', 'adminAccess', 'manageUsers']);

module.exports = {
	roles,
	roleRights,
	adminRoles
};
