import React from "react";
import { BsInstagram } from "react-icons/bs";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Get in Touch
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We'd love to hear from you! Whether you have a question about an
            order or just want to say hello, feel free to drop us a message
            below.
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your message"
              ></textarea>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or reach us through:</p>
          <div className="flex justify-center items-center space-x-4 mt-3">
            <a href="#" className="text-gray-500 hover:text-indigo-600">
              <span className="sr-only">Facebook</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 5.065 3.656 9.275 8.438 9.876V14.89h-2.54v-2.89h2.54v-1.61c0-2.507 1.493-3.89 3.777-3.89 1.094 0 2.238.197 2.238.197v2.46h-1.259c-1.242 0-1.63.772-1.63 1.56v1.283h2.773l-.443 2.89h-2.33V21.876C18.344 21.275 22 17.065 22 12z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600">
              <span className="sr-only">Twitter</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.154 11.675-11.482 0-.175 0-.349-.012-.522A8.323 8.323 0 0022 6.162a8.186 8.186 0 01-2.357.637 4.075 4.075 0 001.793-2.233 8.224 8.224 0 01-2.605.978A4.11 4.11 0 0015.447 4a4.078 4.078 0 00-4.076 4.07c0 .32.036.63.106.927A11.605 11.605 0 013 5.168a4.024 4.024 0 00-.553 2.046c0 1.41.725 2.655 1.825 3.384a4.07 4.07 0 01-1.849-.509v.05a4.083 4.083 0 003.27 3.994 4.075 4.075 0 01-1.843.07 4.088 4.088 0 003.817 2.824A8.225 8.225 0 012 18.407a11.616 11.616 0 006.29 1.83" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600">
              <span className="sr-only">Instagram</span>
              <BsInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
