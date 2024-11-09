import express from 'express';
import RSS from 'rss';

let postsWhenRunningLocally = [];

const app = express();

async function getPosts(){
  return postsWhenRunningLocally;
}

async function setPosts(posts) {
  postsWhenRunningLocally = posts;
}

// Function to add a new post
async function addPost() {
  const now = new Date();
  const newPost = {
    title: `Test Post ${now.toISOString()}`,
    description: `This is a test post generated at ${now.toLocaleString()}`,
    date: now,
  };

  let posts = await getPosts();
  posts.unshift(newPost);
  posts = posts.slice(0, 100); // Keep only the last 100 posts

  await setPosts(posts);
}

// Add a new post every 10 seconds
setInterval(addPost, 10000);

// RSS feed route
app.get('/rss', async (req, res) => {
  const posts = await getPosts();

  const feed = new RSS({
    title: 'Test RSS Feed',
    description: 'A test RSS feed that updates every 10 seconds',
    feed_url: 'https://your-repl-name.your-username.repl.co/rss',
    site_url: 'https://your-repl-name.your-username.repl.co',
  });

  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.description,
      date: new Date(post.date),
    });
  });

  res.type('application/rss+xml');
  res.send(feed.xml());
});

const port = 3000;
app.listen(port, () => {
  console.log(`RSS feed server running on port ${port}`);
});