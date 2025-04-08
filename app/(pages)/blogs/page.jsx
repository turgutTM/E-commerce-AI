"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UploadButton } from "../../utils/uploadthing";
import TuguAnimation from "@/app/components/TuguAnimation";
import { FaRegHeart, FaSearch, FaTimes } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { motion } from "framer-motion";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? blog.title.toLowerCase().includes(searchQuery) ||
        blog.content.toLowerCase().includes(searchQuery)
      : true;
    return matchesCategory && matchesSearch;
  });

  const popularBlogs = [...blogs]
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 5);

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Toys"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TuguAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-xl mb-4">
          <span className="font-bold">Error:</span> {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12 px-4 md:px-8 lg:px-16">
      <header className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            BLOGS
          </span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Discover interesting articles, tips, and stories across various categories.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <FaTimes
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Create New Blog
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory("")}
              className="px-4 py-2 text-red-500 underline hover:text-red-700"
            >
              Clear Filter
            </button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create a New Blog</h2>
            
            <div className="space-y-6">
              <div>
                <label className="font-medium text-gray-700 block mb-2">Blog Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                  {newBlog.blogPhoto ? (
                    <div className="relative w-full">
                      <img 
                        src={newBlog.blogPhoto} 
                        alt="Blog preview" 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setNewBlog({...newBlog, blogPhoto: ""})}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={handleImageUpload}
                      appearance={{
                        button: "bg-blue-600 hover:bg-blue-700 text-white",
                      }}
                    />
                  )}
                </div>
              </div>
              
              <div>
                <label className="font-medium text-gray-700 block mb-2">Title</label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter an engaging title"
                />
              </div>
              
              <div>
                <label className="font-medium text-gray-700 block mb-2">Category</label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="font-medium text-gray-700 block mb-2">Content</label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your blog content here..."
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBlog}
                  disabled={!newBlog.title || !newBlog.content || !newBlog.category}
                  className={`px-5 py-2 rounded-lg ${
                    !newBlog.title || !newBlog.content || !newBlog.category
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } transition-colors duration-300`}
                >
                  Publish Blog
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          {filteredBlogs.length > 0 ? (
            <div className="space-y-8">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={blog.blogPhoto || "https://source.unsplash.com/featured/800x600"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-blue-600 shadow-sm">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {blog.title}
                    </h4>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {blog.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/${blog._id}`}>
                        <span className="inline-block px-5 py-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300 font-medium">
                          Read More
                        </span>
                      </Link>
                      
                      <button
                        onClick={() => handleLike(blog._id)}
                        className="flex items-center space-x-1 group"
                      >
                        {blog.likes.includes(user._id) ? (
                          <IoHeart className="text-red-500 text-xl group-hover:scale-125 transition-transform duration-300" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-xl group-hover:text-red-500 group-hover:scale-125 transition-all duration-300" />
                        )}
                        <span className="text-gray-500">{blog.likes.length}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="text-gray-600 mb-4 text-lg">No blogs found</div>
              {searchQuery && (
                <p className="text-gray-500">
                  No results match "{searchQuery}". Try a different search term.
                </p>
              )}
              {selectedCategory && (
                <p className="text-gray-500">
                  No blogs in the "{selectedCategory}" category yet.
                </p>
              )}
              <button
                onClick={() => {setSelectedCategory(""); setSearchQuery("");}}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View All Blogs
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Categories
            </h3>
            
            <div className="space-y-2">
              {categories.map((category) => {
                const count = blogs.filter(blog => blog.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
                    className={`flex justify-between items-center w-full p-3 rounded-lg transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{category}</span>
                    <span className={`rounded-full ${
                      selectedCategory === category
                        ? "bg-white text-blue-600"
                        : "bg-gray-200 text-gray-700"
                    } text-xs px-2 py-1 font-medium`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Popular Posts
            </h3>
            
            <div className="space-y-4">
              {popularBlogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                    <img
                      src={blog.blogPhoto || "https://source.unsplash.com/random/100x100?blog"}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded-lg mr-3 shadow-sm flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-gray-800 font-medium line-clamp-2">{blog.title}</h4>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <IoHeart className="text-red-500 mr-1" />
                        <span>{blog.likes.length} likes</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blogs;