// src/pages/Blog.jsx

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Function to generate a consistent image URL for each post based on ID
  const getPostImage = (postId) => {
    const imageCategories = ["technology", "business", "creativity", "lifestyle", "education", "health"];
    const categoryIndex = postId % imageCategories.length;
    const category = imageCategories[categoryIndex];
    return `https://images.unsplash.com/photo-${1516842612521 + postId * 100}?w=600&h=400&fit=crop&crop=center&q=80&ixlib=rb-4.0.3&auto=format`;
  };

  // Fallback: Use a placeholder image service
  const getPlaceholderImage = (postId) => {
    const colors = ["FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8", "F7DC6F"];
    const color = colors[postId % colors.length];
    return `https://via.placeholder.com/600x400/${color}/ffffff?text=Blog+Post+${postId}`;
  };

  // Better approach: Use Unsplash API with search terms based on post tags
  const getPostImageFromAPI = (post, postId) => {
    const tag = post.tags && post.tags.length > 0 ? post.tags[0] : "blog";
    const imageUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(tag)}&w=600&h=400&fit=crop&client_id=YOUR_UNSPLASH_ACCESS_KEY`;
    // Fallback if API key not available
    return getPlaceholderImage(postId);
  };

  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((data) => {
        // Add images to posts
        const postsWithImages = data.posts.map((post, index) => ({
          ...post,
          image: getPlaceholderImage(post.id)
        }));
        setPosts(postsWithImages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="blog-page-wrapper">
      <Header />
      
      {/* Blog Banner Section */}
      <section className="blog-banner">
        <div className="blog-banner-content">
          <h1 className="blog-banner-title">Our Blog</h1>
          <p className="blog-banner-subtitle">Discover insights, tips, and stories from our experts</p>
          <div className="blog-banner-divider"></div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="blog-page-container">
        {loading ? (
          <div className="blog-loading">
            <p>Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* Blog Grid */}
            <div className="blog-grid">
              {posts
                .slice(
                  (currentPage - 1) * postsPerPage,
                  currentPage * postsPerPage
                )
                .map((post) => (
                <article className="blog-card" key={post.id}>
                  {/* Blog Card Image */}
                  <div className="blog-card-image-wrapper">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="blog-card-image"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/600x400/cccccc/ffffff?text=Blog+Post`;
                      }}
                    />
                    <div className="blog-card-image-overlay"></div>
                  </div>

                  {/* Blog Card Content */}
                  <div className="blog-card-content">
                    <h3 className="blog-card-title">{post.title}</h3>
                    
                    <p className="blog-card-excerpt">
                      {post.body.substring(0, 140)}...
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="blog-tags">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More Button */}
                    <button className="blog-read-btn">
                      Read More →
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {Math.ceil(posts.length / postsPerPage) > 1 && (
              <div className="blog-pagination">
                <button
                  className="pagination-btn pagination-prev"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from(
                    { length: Math.ceil(posts.length / postsPerPage) },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={`pagination-number ${
                        currentPage === page ? 'active' : ''
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn pagination-next"
                  onClick={() =>
                    setCurrentPage(prev =>
                      Math.min(
                        prev + 1,
                        Math.ceil(posts.length / postsPerPage)
                      )
                    )
                  }
                  disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="blog-no-posts">
            <p>No blog posts available at the moment.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;