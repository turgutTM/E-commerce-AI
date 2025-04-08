"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const UserBlogs = () => {
  const { id } = useParams();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await fetch(`/api/user-blogs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserBlogs();
    }
  }, [id]);

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {blogs.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blog/${blog._id}`} passHref>
              <div className="relative bg-white rounded-lg w-[30rem] flex shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-lg cursor-pointer group">
                {blog.blogPhoto && (
                  <img
                    src={blog.blogPhoto}
                    alt={blog.title}
                    className="w-[50%] h-[20rem] object-contain"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {blog.content.slice(0, 150)}...
                  </p>
                  <div className="text-blue-500 text-sm">{blog.category}</div>
                </div>
                <div className="absolute inset-0 bg-gray-900 backdrop-blur bg-opacity-50 flex items-center justify-center text-white text-xl font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {blog.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No blogs found for this user.
        </div>
      )}
    </div>
  );
};

export default UserBlogs;
