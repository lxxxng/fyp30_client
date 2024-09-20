import React, { useState } from 'react';
import './expertEditPost.scss';

const EditPostPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([
    { id: 1, title: "First Post" },
    { id: 2, title: "Second Post" },
    { id: 3, title: "Third Post" }
  ]);

  

  // Filter posts based on the search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    alert(`Post with id ${id} deleted.`);
  };

  return (
    <div className="edit-post-page">
      <h1>Edit Posts</h1>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* List of Posts */}
      <ul className="post-list">
        {filteredPosts.map(post => (
          <li key={post.id} className="post-item">
            <span>{post.title}</span>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditPostPage;
