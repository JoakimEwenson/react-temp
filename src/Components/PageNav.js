import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PageNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-between md:max-w-6xl mx-auto">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-indigo-900 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-xs font-medium"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <span className="text-lg sm:text-xl block">temperatur.nu</span>
                </div>
              </Link>
            </div>
            <div
              className={
                "absolute top-16 right-0 bg-neutral-100 dark:bg-neutral-800 " +
                (isOpen ? "flex flex-col w-screen h-screen sm:h-fit items-center sm:items-start z-50" : "hidden")
              }
              id="mobile-menu"
            >
              <div className="px-2 pt-2 pb-3 space-y-16 sm:space-y-5">
                <Link
                  to="/favoriter"
                  className="text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 pt-16 pb-2 sm:py-2 rounded-md text-sm font-bold w-full flex items-center uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Favoriter
                </Link>
                <Link
                  to="/narliggande"
                  className="flex items-center text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-bold w-full uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Nära
                </Link>
                <Link
                  to="/platslista"
                  className="flex items-center text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-bold w-full uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Sök
                </Link>
                <Link
                  to="/om"
                  className="flex items-center text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-bold w-full uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Om sidan
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-transparent"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">&Ouml;ppna menyn</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
            <div className="hidden md:flex sm:ml-6 flex-shrink-0 items-center">
              <div className="flex space-x-4">
                <Link
                  to="/favoriter"
                  className="text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-xs lg:text-sm font-bold flex items-center uppercase"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Favoriter
                </Link>
                <Link
                  to="/narliggande"
                  className="text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-xs lg:text-sm font-bold flex items-center uppercase"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Nära
                </Link>
                <Link
                  to="/platslista"
                  className="text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-xs lg:text-sm font-bold flex items-center uppercase"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Sök
                </Link>
                <Link
                  to="/om"
                  className="text-indigo-900 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-xs lg:text-sm font-bold flex items-center uppercase"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Om sidan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
