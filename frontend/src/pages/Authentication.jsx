import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import logo from "../assets/Logo.svg";

const Authentication = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="relative h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-3">

      {/* Logo*/}
      <div
        className="
          absolute
          top-3
          left-1/2 -translate-x-1/2        /*mobile center*/
          sm:left-5 sm:translate-x-0      
          sm:top-5
        "
      >
        <img
          src={logo}
          alt="LexiSarthi Logo"
          className="
            w-80        /*mobile size/
            sm:w-48     /* tablet */
            md:w-52     /* small laptops */
            lg:w-60     /* desktops */
            h-auto
            object-contain
          "
        />
      </div>


      {/* Center Authentication Card */}
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col gap-4">

          {/* Header */}
          <div className="text-center">
            <div className="inline-block p-1 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
              <div className="bg-white rounded-lg px-6 py-3">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LexiSarthi
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Hindi–English Vocabulary Learning Platform
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="hidden sm:block">
            <div className="bg-white/80 backdrop-blur px-5 py-3 rounded-lg shadow border">
              <p className="text-sm text-slate-700 text-center">
                Click on any word to view detailed information including meaning,
                pronunciation, examples, synonyms, and antonyms.
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-xl shadow-2xl border overflow-hidden">
            <div className="flex justify-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600">
              <button
                onClick={() => setShowLogin(true)}
                className={`px-5 py-2 rounded-md text-sm sm:text-base font-semibold transition ${
                  showLogin
                    ? "bg-white text-indigo-600 shadow"
                    : "bg-white/20 text-white"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => setShowLogin(false)}
                className={`px-5 py-2 rounded-md text-sm sm:text-base font-semibold transition ${
                  !showLogin
                    ? "bg-white text-purple-600 shadow"
                    : "bg-white/20 text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="px-5 py-5">
              {showLogin ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
