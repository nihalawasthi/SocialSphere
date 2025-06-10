-- Seed sample data for SocialSphere

-- Insert sample users
INSERT INTO users (username, email, full_name, bio, avatar_url, is_verified, follower_count, following_count, post_count) VALUES
('alexchen', 'alex@socialsphere.com', 'Alex Chen', 'UI/UX Designer passionate about creating beautiful digital experiences 🎨 | Design Systems Expert | Coffee Addict', '/placeholder.svg?height=100&width=100', true, 12500, 340, 89),
('sarahkim', 'sarah@socialsphere.com', 'Sarah Kim', 'Full-stack developer | React & Node.js enthusiast ☕ | Building the future one line of code at a time | Open source contributor', '/placeholder.svg?height=100&width=100', false, 8900, 420, 156),
('marcusj', 'marcus@socialsphere.com', 'Marcus Johnson', 'Professional photographer capturing life''s beautiful moments 📸 | Travel lover | Nature enthusiast | Available for shoots', '/placeholder.svg?height=100&width=100', true, 21000, 180, 234),
('emmawilson', 'emma@socialsphere.com', 'Emma Wilson', 'Product Manager at TechCorp | Startup advisor 🚀 | Always learning something new | Mentor | Speaker', '/placeholder.svg?height=100&width=100', false, 5600, 890, 67),
('davidpark', 'david@socialsphere.com', 'David Park', 'Frontend Developer | React & TypeScript expert | UI/UX enthusiast | Open source maintainer | Tech blogger', '/placeholder.svg?height=100&width=100', false, 3400, 567, 123),
('lisachen', 'lisa@socialsphere.com', 'Lisa Chen', 'Data Scientist | AI researcher | Making sense of data one algorithm at a time | PhD in Machine Learning', '/placeholder.svg?height=100&width=100', true, 15600, 234, 78),
('johnsmith', 'john@socialsphere.com', 'John Smith', 'Entrepreneur | Startup founder | Tech investor | Helping others build amazing products | Mentor', '/placeholder.svg?height=100&width=100', true, 45000, 1200, 345),
('mariagarcia', 'maria@socialsphere.com', 'Maria Garcia', 'Content creator | Digital marketing expert | Helping brands tell their stories | Podcast host | Speaker', '/placeholder.svg?height=100&width=100', false, 18700, 890, 456);

-- Insert sample posts
INSERT INTO posts (user_id, content, image_url, like_count, comment_count, share_count, created_at) VALUES
(1, 'Just launched my new design system! 🎨 What do you think about these color combinations? Really excited to share this with the community and get your feedback!', '/placeholder.svg?height=400&width=600', 234, 18, 12, NOW() - INTERVAL '2 hours'),
(2, 'Working on some midnight coding sessions ✨ The best ideas come when the world is quiet. Currently building a new feature that I think you''ll all love! #coding #javascript', NULL, 156, 12, 8, NOW() - INTERVAL '4 hours'),
(3, 'Beautiful sunset from my office window today 🌅 Sometimes you need to pause and appreciate the moment. Nature never fails to inspire creativity. #photography #sunset', '/placeholder.svg?height=400&width=600', 189, 7, 15, NOW() - INTERVAL '6 hours'),
(4, 'Excited to announce that our team just hit a major milestone! 🎉 Couldn''t have done it without this amazing group of people. Grateful for every challenge that brought us here. #teamwork #milestone', NULL, 312, 45, 23, NOW() - INTERVAL '8 hours'),
(5, 'New React 18 features are absolutely game-changing! The concurrent rendering capabilities are going to revolutionize how we build user interfaces. Who else is excited about this? #react #webdev', NULL, 198, 23, 19, NOW() - INTERVAL '10 hours'),
(6, 'Just finished analyzing some fascinating data patterns 📊 The insights we''re uncovering could change how we approach user behavior prediction. Science is beautiful! #datascience #ai', '/placeholder.svg?height=400&width=600', 145, 16, 9, NOW() - INTERVAL '12 hours'),
(7, 'Building something incredible with my team 🚀 Can''t wait to share what we''ve been working on. The future of tech is going to be amazing! #startup #innovation', NULL, 567, 89, 45, NOW() - INTERVAL '1 day'),
(8, 'Content creation tips that changed my game 📝 Consistency beats perfection every time. Here''s what I learned after 2 years of daily posting... #contentcreator #marketing', '/placeholder.svg?height=400&width=600', 423, 67, 34, NOW() - INTERVAL '1 day 2 hours'),
(1, 'Design inspiration from everyday objects ✨ Found this amazing color palette in a coffee shop today. Sometimes the best ideas come from unexpected places! #design #inspiration', '/placeholder.svg?height=400&width=600', 178, 12, 8, NOW() - INTERVAL '1 day 4 hours'),
(2, 'Debugging session turned into a learning experience 🐛 Spent 3 hours on a bug that taught me more about JavaScript than any tutorial. Embrace the struggle! #debugging #learning', NULL, 134, 19, 6, NOW() - INTERVAL '1 day 6 hours');

-- Insert sample comments
INSERT INTO comments (post_id, user_id, content, like_count, created_at) VALUES
(1, 2, 'This looks absolutely stunning! The color palette is so harmonious. Would love to see how you implement this in a real project.', 12, NOW() - INTERVAL '1 hour 30 minutes'),
(1, 3, 'Amazing work! The attention to detail is incredible. This is definitely going to inspire my next photography project.', 8, NOW() - INTERVAL '1 hour 15 minutes'),
(1, 4, 'Love the modern approach! How long did it take you to develop this system? The consistency is impressive.', 5, NOW() - INTERVAL '45 minutes'),
(2, 1, 'Those midnight sessions are the best! Some of my most creative work happens during those quiet hours. What are you building?', 15, NOW() - INTERVAL '3 hours 30 minutes'),
(2, 5, 'Can''t wait to see what you''re building! Your projects are always so innovative and well-thought-out.', 7, NOW() - INTERVAL '3 hours'),
(3, 2, 'Gorgeous shot! The lighting is perfect. Nature photography is such an art form. What camera did you use?', 9, NOW() - INTERVAL '5 hours 30 minutes'),
(4, 1, 'Congratulations! Team achievements are the best kind of success stories. What milestone did you hit?', 18, NOW() - INTERVAL '7 hours 30 minutes'),
(4, 3, 'Well deserved! Your team''s dedication really shows in the quality of work you produce.', 11, NOW() - INTERVAL '7 hours'),
(5, 2, 'React 18 is incredible! The performance improvements alone are worth the upgrade. Have you tried Suspense yet?', 14, NOW() - INTERVAL '9 hours 30 minutes'),
(6, 4, 'Data science continues to amaze me! Would love to learn more about your methodology and tools.', 6, NOW() - INTERVAL '11 hours 30 minutes');

-- Insert sample likes
INSERT INTO likes (user_id, post_id, created_at) VALUES
(2, 1, NOW() - INTERVAL '2 hours'), (3, 1, NOW() - INTERVAL '2 hours'), (4, 1, NOW() - INTERVAL '1 hour 45 minutes'),
(5, 1, NOW() - INTERVAL '1 hour 30 minutes'), (6, 1, NOW() - INTERVAL '1 hour 15 minutes'), (7, 1, NOW() - INTERVAL '1 hour'),
(1, 2, NOW() - INTERVAL '4 hours'), (3, 2, NOW() - INTERVAL '3 hours 45 minutes'), (4, 2, NOW() - INTERVAL '3 hours 30 minutes'),
(6, 2, NOW() - INTERVAL '3 hours 15 minutes'), (8, 2, NOW() - INTERVAL '3 hours'),
(1, 3, NOW() - INTERVAL '6 hours'), (2, 3, NOW() - INTERVAL '5 hours 45 minutes'), (4, 3, NOW() - INTERVAL '5 hours 30 minutes'),
(5, 3, NOW() - INTERVAL '5 hours 15 minutes'), (7, 3, NOW() - INTERVAL '5 hours'),
(1, 4, NOW() - INTERVAL '8 hours'), (2, 4, NOW() - INTERVAL '7 hours 45 minutes'), (3, 4, NOW() - INTERVAL '7 hours 30 minutes'),
(5, 4, NOW() - INTERVAL '7 hours 15 minutes'), (6, 4, NOW() - INTERVAL '7 hours'), (8, 4, NOW() - INTERVAL '6 hours 45 minutes');

-- Insert sample follows
INSERT INTO follows (follower_id, following_id, created_at) VALUES
(1, 2, NOW() - INTERVAL '30 days'), (1, 3, NOW() - INTERVAL '25 days'), (1, 4, NOW() - INTERVAL '20 days'),
(2, 1, NOW() - INTERVAL '28 days'), (2, 3, NOW() - INTERVAL '22 days'), (2, 5, NOW() - INTERVAL '18 days'),
(3, 1, NOW() - INTERVAL '26 days'), (3, 2, NOW() - INTERVAL '24 days'), (3, 4, NOW() - INTERVAL '19 days'),
(4, 1, NOW() - INTERVAL '23 days'), (4, 2, NOW() - INTERVAL '21 days'), (4, 5, NOW() - INTERVAL '17 days'),
(5, 1, NOW() - INTERVAL '27 days'), (5, 2, NOW() - INTERVAL '25 days'), (5, 3, NOW() - INTERVAL '20 days'),
(6, 1, NOW() - INTERVAL '29 days'), (6, 3, NOW() - INTERVAL '24 days'), (6, 4, NOW() - INTERVAL '18 days');

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, content, is_read, created_at) VALUES
(2, 1, 'Hey Alex! Love your latest design system. Would you be interested in collaborating on a project?', true, NOW() - INTERVAL '2 hours'),
(1, 2, 'Thanks Sarah! I''d love to collaborate. What kind of project are you thinking about?', true, NOW() - INTERVAL '1 hour 45 minutes'),
(2, 1, 'I''m working on a new web app and could use some design expertise. Are you available for a quick call?', false, NOW() - INTERVAL '30 minutes'),
(3, 1, 'The photos from our last shoot are ready! Check your email 📸', true, NOW() - INTERVAL '3 hours'),
(4, 1, 'Congratulations on the design system launch! It''s getting great feedback in our team.', false, NOW() - INTERVAL '1 hour'),
(5, 2, 'Hey Sarah, saw your midnight coding post. What framework are you using for the new feature?', true, NOW() - INTERVAL '4 hours'),
(2, 5, 'I''m using Next.js with TypeScript. The developer experience is amazing! Want to pair program sometime?', false, NOW() - INTERVAL '3 hours 30 minutes');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, message, related_user_id, related_post_id, is_read, created_at) VALUES
(1, 'like', 'Sarah Kim liked your post', 2, 1, false, NOW() - INTERVAL '30 minutes'),
(1, 'comment', 'Marcus Johnson commented on your post', 3, 1, false, NOW() - INTERVAL '45 minutes'),
(1, 'follow', 'Emma Wilson started following you', 4, NULL, true, NOW() - INTERVAL '2 hours'),
(2, 'like', 'Alex Chen liked your post', 1, 2, true, NOW() - INTERVAL '1 hour'),
(2, 'comment', 'David Park commented on your post', 5, 2, false, NOW() - INTERVAL '1 hour 15 minutes'),
(3, 'like', 'Lisa Chen liked your post', 6, 3, true, NOW() - INTERVAL '2 hours 30 minutes'),
(4, 'follow', 'John Smith started following you', 7, NULL, false, NOW() - INTERVAL '3 hours'),
(5, 'like', 'Maria Garcia liked your post', 8, 5, true, NOW() - INTERVAL '4 hours');

-- Insert sample hashtags
INSERT INTO hashtags (name, post_count) VALUES
('#DesignSystems', 125), ('#WebDevelopment', 892), ('#UIDesign', 561), ('#React', 1530),
('#Photography', 940), ('#DataScience', 760), ('#TechLife', 1890), ('#Coding', 2340),
('#Innovation', 670), ('#Creativity', 1450), ('#JavaScript', 1820), ('#Startup', 890),
('#AI', 1200), ('#MachineLearning', 680), ('#ContentCreator', 450);

-- Update user counts based on actual data
UPDATE users SET 
    follower_count = (SELECT COUNT(*) FROM follows WHERE following_id = users.id),
    following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = users.id),
    post_count = (SELECT COUNT(*) FROM posts WHERE user_id = users.id);

-- Update post counts based on actual data
UPDATE posts SET 
    like_count = (SELECT COUNT(*) FROM likes WHERE post_id = posts.id),
    comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = posts.id);
