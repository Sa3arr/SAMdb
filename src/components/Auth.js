import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Auth.css";

const Auth = ({ closeAuth }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            await setDoc(doc(db, "users", userCredential.user.uid), { name, email });

            closeAuth(); // ✅ Close after signup
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            closeAuth(); // ✅ Close after login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-overlay" onClick={closeAuth}>
            <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                <h2>{isSigningUp ? "Sign Up" : "Login"}</h2>
                {error && <p className="error">{error}</p>}

                {isSigningUp && (
                    <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                )}

                <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button onClick={isSigningUp ? handleSignUp : handleLogin} className="auth-btn">
                    {isSigningUp ? "Sign Up" : "Login"}
                </button>

                <p className="switch-auth">
                    {isSigningUp ? "Already have an account?" : "Don't have an account?"}
                    <span onClick={() => setIsSigningUp(!isSigningUp)}>
                        {isSigningUp ? " Login" : " Sign Up"}
                    </span>
                </p>

                {/* Close Button */}
                <button className="close-btn" onClick={closeAuth}>✖</button>
            </div>
        </div>
    );
};

export default Auth;
