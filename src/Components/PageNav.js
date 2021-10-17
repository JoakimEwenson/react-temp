import React from "react";
import { Link } from "react-router-dom";

export default function PageNav() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-between">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-8 w-8 text-white"
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
                  <span className="text-xl hidden sm:block">
                    <b>temperatur.nu</b>
                  </span>
                </div>
              </Link>
            </div>
            <div className="bg-gray-800 hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/favoriter" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold">
                  Favoriter
                </Link>
                <Link
                  to="/narliggande"
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
                >
                  Närliggande
                </Link>
                <Link
                  to="/platslista"
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
                >
                  Alla mätpunkter
                </Link>
                <Link to="/om" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold">
                  Om sidan
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">&Ouml;ppna menyn</span>

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
                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex sm:ml-6 flex-shrink-0 items-center">
              <div className="flex space-x-4">
                <Link to="/favoriter" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold">
                  Favoriter
                </Link>
                <Link
                  to="/narliggande"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
                >
                  Närliggande
                </Link>
                <Link
                  to="/platslista"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
                >
                  Alla
                </Link>
                <Link to="/om" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold">
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
