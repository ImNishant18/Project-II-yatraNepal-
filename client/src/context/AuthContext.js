import React, { createContext, useReducer, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Initial state
const INITIAL_STATE = {
    user: null,
    isFetching: false,
    error: false,
};

// Reducer function
const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: true,
            };
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        default:
            return state;
    }
};

// Provider
export const AuthContextProvider = ({ children }) => {
    // Safe loading from localStorage
    const getStoredUser = () => {
        try {
            const userData = localStorage.getItem("user");
            if (userData && userData !== "undefined") {
                return JSON.parse(userData);
            }
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
        }
        return null;
    };

    const [state, dispatch] = useReducer(AuthReducer, {
        ...INITIAL_STATE,
        user: getStoredUser(),
    });

    // Persist user state to localStorage
    useEffect(() => {
        if (state.user) {
            localStorage.setItem("user", JSON.stringify(state.user));
        } else {
            localStorage.removeItem("user");
        }
    }, [state.user]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
