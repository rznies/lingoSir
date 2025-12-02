// WordPress REST API service
// Replace <MY-WORDPRESS-URL> with your actual WordPress site URL (e.g., http://localhost:10003)
const WP_API_URL = "http://lingo-blog.local/wp-json/wp/v2";

/**
 * Fetch all posts with embedded data (featured image, author, etc.)
 * @returns {Promise<Array>} Array of post objects
 */
export async function getPosts() {
  try {
    const response = await fetch(`${WP_API_URL}/posts?_embed`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Fetch a single post by ID with embedded data
 * @param {number|string} id - The post ID
 * @returns {Promise<Object>} Single post object
 */
export async function getPostById(id) {
  try {
    const response = await fetch(`${WP_API_URL}/posts/${id}?_embed`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}
