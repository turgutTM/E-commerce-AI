"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UploadButton } from "../../utils/uploadthing";
import TuguAnimation from "@/app/components/TuguAnimation";
import { FaRegHeart } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const user = useSelector((state) => state.user.user);
  const [newBlog, setNewBlog] = useState({
    userID: user._id,
    title: "",
    content: "",
    blogPhoto: "",
    category: "",
  });

  const handleLike = (blogId) => {
    const previousBlogs = [...blogs];
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => {
        if (blog._id === blogId) {
          if (blog.likes.includes(user._id)) {
            return {
              ...blog,
              likes: blog.likes.filter((userId) => userId !== user._id),
            };
          } else {
            return {
              ...blog,
              likes: [...blog.likes, user._id],
            };
          }
        }
        return blog;
      })
    );
    fetch("/api/like-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogId, userId: user._id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          setBlogs(previousBlogs);
          const errorData = await res.json();
          console.error("Beğeni isteği başarısız:", errorData.message);
        }
      })
      .catch((error) => {
        setBlogs(previousBlogs);
        console.error("Beğeni isteğinde hata oluştu:", error);
      });
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/all-blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleImageUpload = (res) => {
    if (res && res.length > 0) {
      setNewBlog((prevBlog) => ({
        ...prevBlog,
        blogPhoto: res[0].url,
      }));
    }
  };

  const handleAddBlog = async () => {
    try {
      const response = await fetch("/api/create-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlog),
      });
      if (response.ok) {
        const addedBlog = await response.json();
        setBlogs([...blogs, addedBlog]);
        setIsModalOpen(false);
        setNewBlog({
          userID: user._id,
          title: "",
          content: "",
          blogPhoto: "",
          category: "",
        });
      }
    } catch (error) {
      console.error("Failed to add blog:", error);
    }
  };

  const filteredBlogs = selectedCategory
    ? blogs.filter((blog) => blog.category === selectedCategory)
    : blogs;


  const popularBlogs = [...blogs]
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TuguAnimation />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 md:px-8 lg:px-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-light text-gray-800">
          BLOGS
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-5 py-1 hover:bg-black hover:text-white duration-150 bg-white border-black border text-black rounded-lg"
        >
          Add Blog
        </button>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add a New Blog</h2>
            <label className="mb-2 flex justify-center">Add Photo:</label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleImageUpload}
            />
            <label className="block mt-4 mb-2">Title:</label>
            <input
              type="text"
              value={newBlog.title}
              onChange={(e) =>
                setNewBlog({ ...newBlog, title: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter blog title"
            />
            <label className="block mb-2">Content:</label>
            <textarea
              value={newBlog.content}
              onChange={(e) =>
                setNewBlog({ ...newBlog, content: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter blog content"
            />
            <label className="block mb-2">Category:</label>
            <select
              value={newBlog.category}
              onChange={(e) =>
                setNewBlog({ ...newBlog, category: e.target.value })
              }
              className="border p-2 mb-4 rounded bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 hover:bg-black hover:text-white bg-white border-black border text-black rounded-full duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBlog}
                className="px-4 py-2 hover:bg-black hover:text-white bg-white border-black border text-black rounded-full transition-all duration-200"
              >
                Add Blog
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <section className="md:col-span-2">
          {filteredBlogs.length > 0 ? (
            <div className="space-y-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-200"
                >
                  <img
                    src={
                      blog.blogPhoto ||
                      "https://source.unsplash.com/featured/800x600"
                    }
                    alt={blog.title}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-6">
                    <div className="w-full justify-between flex items-center">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {blog.title}
                      </h4>
                      <p className="text-[13px] rounded-full border-[1px] border-blue-500 font-medium px-4 text-blue-600">
                        {blog.category}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-2">
                      {blog.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <Link href={`/blog/${blog._id}`}>
                        <button className="text-blue-600 hover:underline mt-4">
                          Read More
                        </button>
                      </Link>
                      <div className="flex flex-col items-center">
                        <i
                          onClick={() => handleLike(blog._id)}
                          className={`cursor-pointer transition-transform duration-200 ${
                            blog.likes.includes(user._id) ? "scale-110" : ""
                          }`}
                        >
                          {blog.likes.includes(user._id) ? (
                            <IoHeart className="text-red-500 text-xl" />
                          ) : (
                            <FaRegHeart className="text-gray-500 text-xl" />
                          )}
                        </i>
                        <p className="text-gray-400">{blog.likes.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No blogs available</p>
          )}
        </section>

        <aside className="space-y-10">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-light text-gray-800 mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-gray-600">
              {["Electronics", "Fashion", "Home & Garden", "Sports", "Toys"].map(
                (category) => (
                  <li
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`cursor-pointer border border-black hover:bg-gray-300 px-1 py-2 rounded-md duration-150 hover:text-white ${
                      selectedCategory === category
                        ? "text-white font-semibold bg-gray-500"
                        : ""
                    }`}
                  >
                    {category}
                  </li>
                )
              )}
            </ul>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="mt-4 text-red-500 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-light text-gray-800 mb-4">
              Popular Posts
            </h3>
            <ul className="space-y-4">
              {popularBlogs.map((blog) => (
                <li key={blog._id} className="flex items-start">
                  <img
                    src={
                      blog.blogPhoto ||
                      "https://source.unsplash.com/random/100x100?blog"
                    }
                    alt={blog.title}
                    className="w-16 h-16 object-contain rounded-lg mr-4"
                  />
                  <div>
                    <Link href={`/blog/${blog._id}`}>
                      <h4 className="text-gray-800 font-semibold cursor-pointer hover:underline">
                        {blog.title}
                      </h4>
                    </Link>
                    <p className="text-gray-600 text-sm">
                      {blog.content.substring(0, 50)}...
                    </p>
                    <p className="text-xs mt-1 text-gray-400">{blog.likes.length} likes</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blogs;
