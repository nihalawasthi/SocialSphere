-- Seed data for SocialSphere

-- Insert sample users
INSERT INTO users (username, email, full_name, bio, avatar_url, is_verified) VALUES
('alexchen', 'alex@example.com', 'Alex Chen', 'UI/UX Designer passionate about creating beautiful digital experiences 🎨', '/placeholder.svg?height=100&width=100', true),
('sarahkim', 'sarah@example.com', 'Sarah Kim', 'Full-stack developer | Coffee enthusiast ☕ | Building the future one line of code at a time', '/placeholder.svg?height=100&width=100', false),
('marcusj', 'marcus@example.com', 'Marcus Johnson', 'Photographer capturing life''s beautiful moments 📸 | Travel lover | Nature enthusiast', '/placeholder.svg?height=100&width=100', true),
('emmawilson', 'emma@example.com', 'Emma Wilson', 'Product Manager | Tech enthusiast | Always learning something new 🚀', '/placeholder.svg?height=100&width=100', false),
('davidpark', 'david@example.com', 'David Park', 'Frontend Developer | React enthusiast | Open source contributor', '/placeholder.svg?height=100&width=100', false),
('lisachen', 'lisa@example.com', 'Lisa Chen', 'Data Scientist | AI researcher | Making sense of data one algorithm at a time', '/placeholder.svg?height=100&width=100', true);

-- Insert sample posts
INSERT INTO posts (user_id, content, image_url, like_count, comment_count) VALUES
(1, 'Just launched my new design system! 🎨 What do you think about these color combinations? Really excited to share this with the community.', '/placeholder.svg?height=400&width=600', 234, 18),
(2, 'Working on some midnight coding sessions ✨ The best ideas come when the world is quiet. Currently building a new feature that I think you''ll all love!', NULL, 156, 12),
(3, 'Beautiful sunset from my office window today 🌅 Sometimes you need to pause and appreciate the moment. Nature never fails to inspire creativity.', '/placeholder.svg?height=400&width=600', 89, 7),
(4, 'Excited to announce that our team just hit a major milestone! 🎉 Couldn''t have done it without this amazing group of people. Grateful for every challenge that brought us here.', NULL, 312, 45),
(5, 'New React 18 features are absolutely game-changing! The concurrent rendering capabilities are going to revolutionize how we build user interfaces. Who else is excited about this?', NULL, 198, 23),
(6, 'Just finished analyzing some fascinating data patterns 📊 The insights we''re uncovering could change how we approach user behavior prediction. Science is beautiful!', '/placeholder.svg?height=400&width=600', 145, 16);

-- Insert sample comments
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(1, 2, 'This looks absolutely stunning! The color palette is so harmonious. Would love to see how you implement this in a real project.', 12),
(1, 3, 'Amazing work! The attention to detail is incredible. This is definitely going to inspire my next photography project.', 8),
(1, 4, 'Love the modern approach! How long did it take you to develop this system?', 5),
(2, 1, 'Those midnight sessions are the best! Some of my most creative work happens during those quiet hours.', 15),
(2, 5, 'Can''t wait to see what you''re building! Your projects are always so innovative.', 7),
(3, 2, 'Gorgeous shot! The lighting is perfect. Nature photography is such an art form.', 9),
(4, 1, 'Congratulations! Team achievements are the best kind of success stories.', 18),
(4, 3, 'Well deserved! Your team''s dedication really shows in the quality of work.', 11),
(5, 2, 'React 18 is incredible! The performance improvements alone are worth the upgrade.', 14),
(6, 4, 'Data science continues to amaze me! Would love to learn more about your methodology.', 6);

-- Insert sample likes
INSERT INTO likes (user_id, post_id) VALUES
(2, 1), (3, 1), (4, 1), (5, 1), (6, 1),
(1, 2), (3, 2), (4, 2), (6, 2),
(1, 3), (2, 3), (4, 3), (5, 3),
(1, 4), (2, 4), (3, 4), (5, 4), (6, 4),
(1, 5), (2, 5), (3, 5), (4, 5),
(1, 6), (2, 6), (3, 6), (5, 6);

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3), (2, 5),
(3, 1), (3, 2), (3, 4), (3, 6),
(4, 1), (4, 2), (4, 5),
(5, 1), (5, 2), (5, 3), (5, 6),
(6, 1), (6, 3), (6, 4), (6, 5);

-- Insert sample hashtags
INSERT INTO hashtags (name, post_count) VALUES
('#DesignSystems', 125),
('#WebDevelopment', 82),
('#UIDesign', 61),
('#React', 153),
('#Photography', 94),
('#DataScience', 76),
('#TechLife', 189),
('#Coding', 234),
('#Innovation', 67),
('#Creativity', 145);

-- Insert sample stories
INSERT INTO stories (user_id, content, image_url, expires_at) VALUES
(1, 'Working on something exciting! 🎨', '/placeholder.svg?height=400&width=300', NOW() + INTERVAL '24 hours'),
(2, 'Coffee and code ☕', '/placeholder.svg?height=400&width=300', NOW() + INTERVAL '20 hours'),
(3, 'Golden hour magic ✨', '/placeholder.svg?height=400&width=300', NOW() + INTERVAL '18 hours'),
(4, 'Team meeting vibes 🚀', '/placeholder.svg?height=400&width=300', NOW() + INTERVAL '22 hours');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, message, related_user_id, related_post_id) VALUES
(1, 'like', 'Sarah liked your post', 2, 1),
(1, 'comment', 'Marcus commented on your post', 3, 1),
(2, 'follow', 'Alex started following you', 1, NULL),
(3, 'like', 'Emma liked your post', 4, 3),
(4, 'comment', 'David commented on your post', 5, 4);

-- Update user counts
UPDATE users SET 
    follower_count = (SELECT COUNT(*) FROM follows WHERE following_id = users.id),
    following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = users.id),
    post_count = (SELECT COUNT(*) FROM posts WHERE user_id = users.id);

-- Update post counts
UPDATE posts SET 
    like_count = (SELECT COUNT(*) FROM likes WHERE post_id = posts.id),
    comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = posts.id);
