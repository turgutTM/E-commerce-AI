"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { IoArrowBackSharp } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TuguAnimation from "@/app/components/TuguAnimation";
import { FaRegHeart } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";

const Blog = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/single-blog/${id}`);
        setBlog(response.data);

        const commentsResponse = await axios.get(
          `/api/get-comments-blog/${id}`
        );
        setComments(commentsResponse.data.comments);
      } catch (error) {
        console.error("Error fetching blog or comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);
  const handleLike = async (blogId) => {
    // Sadece local state'te toggle yapıyoruz
    if (blog.likes.includes(user._id)) {
      setBlog((prevBlog) => ({
        ...prevBlog,
        likes: prevBlog.likes.filter((userId) => userId !== user._id),
      }));
    } else {
      setBlog((prevBlog) => ({
        ...prevBlog,
        likes: [...prevBlog.likes, user._id],
      }));
    }
  
    // API isteği gönderiyoruz ama sonucu UI'a yansıtmıyoruz
    try {
      await axios.post("/api/like-post", {
        blogId,
        userId: user._id,
      });
      // Burada gelen cevabı tekrar setBlog ile güncellemek yerine
      // hiçbir şey yapmıyoruz, böylece “anlık değişim” korunmuş oluyor.
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
      // Eğer isterseniz hatada eski haline döndürmeyi de kaldırabilirsiniz.
    }
  };
  
  

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/add-comment-blog`, {
        userId: user._id,
        blogId: id,
        content: newComment,
      });

      const createdComment = response.data.comment;

      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleScroll = (e) => {
    const element = e.target;
    const scrollHeight = element.scrollHeight - element.clientHeight;
    const scrollTop = element.scrollTop;
    const progress = (scrollTop / scrollHeight) * 100;
    setScrollProgress(progress);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TuguAnimation></TuguAnimation>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center text-lg">Blog not found</div>;
  }

  return (
    <div className="w-[50rem] mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <div
          className="flex items-center mb-4 cursor-pointer"
          onClick={() => router.push("/blogs")}
        >
          <IoArrowBackSharp className="text-2xl text-gray-600 mr-2" />
          <span className="text-lg text-gray-600">Back to Blogs</span>
        </div>
        <div className="">
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
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">{blog.title}</h1>
      <div className="text-[14px] text-gray-600 mb-6">
        By @
        <Link href={`/blogs-user/${blog.user._id}`}>
          <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
            {blog.user.name}
          </span>
        </Link>{" "}
        on {new Date(blog.createdAt).toLocaleDateString()}
      </div>

      <div className="mb-6">
        <img
          src={blog.blogPhoto}
          alt={blog.title}
          width={800}
          height={400}
          className="w-full h-72 object-contain rounded-lg shadow-lg"
        />
      </div>

      <div className="prose prose-lg text-gray-700 leading-relaxed mb-8">
        {blog.content}
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>

        <div className="flex relative">
          <div
            className="max-h-[15rem] overflow-y-auto mb-6 pr-4 flex-1"
            onScroll={handleScroll}
          >
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center mb-1">
                    {comment.profilePhoto && (
                      <img
                        src={comment.profilePhoto}
                        alt={comment.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <p className="text-gray-800 font-medium">{comment.name}</p>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          <div className="absolute top-0 right-0 h-full w-2  rounded-lg">
            <div
              className="bg-black transition-all duration-150 w-[2px] ease-linear"
              style={{ height: `${scrollProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Add a Comment
          </h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Write your comment here..."
            className="w-full h-16 outline-none hover:border-blue-500 focus:border-blue-500 duration-150 border border-gray-300 rounded-lg p-2 mb-2"
          />
          <button
            onClick={handleAddComment}
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded-lg border border-black hover:bg-white hover:border hover:border-black hover:text-black duration-200 box-border"
          >
            {isSubmitting ? "Submitting..." : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
