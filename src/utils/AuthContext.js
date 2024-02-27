import { createContext, useState, useEffect, useContext } from "react";
import { firebaseAuth } from "../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

/**
 * @typedef {Object} UserInfo
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {string} password1 - User's password for registration.
 * @property {string} name - User's name for registration.
 */

/**
 * @typedef {Object} AuthContextData
 * @property {Object | null} user - The authenticated user object.
 * @property {function} loginUser - Function to log in a user.
 * @property {function} logoutUser - Function to log out the currently authenticated user.
 * @property {function} registerUser - Function to register a new user.
 * @property {function} signInWithGoogle - Function to sign in with Google.
 */

/**
 * Context for managing authentication state and actions.
 * @type {React.Context<AuthContextData>}
 */
const AuthContext = createContext();

/**
 * Provides authentication context to the application.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the AuthProvider.
 * @returns {React.ReactNode} - The JSX representation of the AuthProvider.
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  /**
   * @type {[boolean, function]} State hook for loading status.
   */
  const [loading, setLoading] = useState(true);

  /**
   * @type {[Object | null, function]} State hook for the authenticated user.
   */
  const [user, setUser] = useState(null);

  useEffect(() => {
    /**
     * @type {function} Unsubscribe function for cleaning up the auth state listener.
     */
    const unsubscribe = firebaseAuth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Logs in a user with the provided user information.
   * @param {UserInfo} userInfo - User information for login.
   * @returns {Promise<void>} - A promise that resolves after the login attempt.
   */
  const loginUser = async (userInfo) => {
    setLoading(true);

    try {
      await firebaseAuth.signInWithEmailAndPassword(
        userInfo.email,
        userInfo.password
      );
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  /**
   * Logs out the currently authenticated user.
   * @returns {Promise<void>} - A promise that resolves after the logout attempt.
   */
  const logoutUser = async () => {
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Registers a new user with the provided user information.
   * @param {UserInfo} userInfo - User information for registration.
   * @returns {Promise<void>} - A promise that resolves after the registration attempt.
   */
  const registerUser = async (userInfo) => {
    setLoading(true);

    try {
      await firebaseAuth.createUserWithEmailAndPassword(
        userInfo.email,
        userInfo.password1
      );
      await firebaseAuth.currentUser.updateProfile({
        displayName: userInfo.name,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  /**
   * Checks the current user's authentication status.
   * @returns {void}
   */
  const checkUserStatus = () => {
    const authUser = firebaseAuth.currentUser;
    setUser(authUser);
    setLoading(false);
  };

  /**
   * Signs in a user using Google authentication.
   * @returns {Promise<void>} - A promise that resolves after the Google sign-in attempt.
   */
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      const user = userCredential.user;
      // Additional logic if needed
      navigate("/search");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      // Handle error or display a message to the user
    }
  };

  /**
   * The context data provided by AuthContext.
   * @type {AuthContextData}
   */
  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing the authentication context.
 * @returns {AuthContextData} - The authentication context data.
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;