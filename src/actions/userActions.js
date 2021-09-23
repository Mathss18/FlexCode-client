import axios from "axios";

import {
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT,
} from "../constants/userConstants";

export const userLoginReducer = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST });
		// USER LOGIN SETUP
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: {
				name: "Mateus Filho",
				email: "mateusfilho@gmail.com",
				token: "12312wqeqw",
			},
		});
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload: error,
		});
	}
};
