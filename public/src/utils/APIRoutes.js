//define all apis routes
//go to the server side and fetch the data from the DB
//or go to and compare the data and back with some information

export const host = "http://localhost:5000";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUsersRoute = `${host}/api/auth/allUsers`;
// localhost:5000/api/msg/addMsg/
// this is hit from the client-side to fetch the data form  the DB
export const addMsgToDBRoute = `${host}/api/msg/addMsg/`;
export const getAllMsgFromDBRoute = `${host}/api/msg/getMsg/`;
