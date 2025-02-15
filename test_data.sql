USE talkAndVote;  -- ✅ 사용할 데이터베이스 선택

INSERT INTO users (user_id, username, email, password, is_verified, created_at) VALUES
(1, 'alice', 'alice@example.com', 'hashed_password_1', TRUE, NOW()),
(2, 'bob', 'bob@example.com', 'hashed_password_2', TRUE, NOW()),
(3, 'charlie', 'charlie@example.com', 'hashed_password_3', TRUE, NOW()),
(4, 'david', 'david@example.com', 'hashed_password_4', TRUE, NOW()),
(5, 'emma', 'emma@example.com', 'hashed_password_5', TRUE, NOW());

INSERT INTO topics (topic_id, title, category, vote_options, description, user_id, created_at) VALUES
(1, 'Favorite Programming Language?', 'Technology', '["Python", "JavaScript", "C++", "Go"]', 'Which programming language do you like the most?', 1, NOW()),
(2, 'Best Operating System?', 'Technology', '["Windows", "Linux"]', 'Which OS do you prefer?', 2, NOW()),
(3, 'Favorite Smartphone Brand?', 'Tech Gadgets', '["Apple", "Samsung", "Google"]', 'Which smartphone brand do you prefer?', 3, NOW()),
(4, 'Best Coffee Brand?', 'Lifestyle', '["Starbucks", "Dunkin", "Tim Hortons", "Costa"]', 'What is your go-to coffee brand?', 4, NOW()),
(5, 'Preferred Vacation Destination?', 'Travel', '["Beach", "Mountains", "City"]', 'Where do you prefer to go on vacation?', 5, NOW());

INSERT INTO votes (vote_id, user_id, topic_id, vote_index, created_at) VALUES
-- Topic 1: Favorite Programming Language
(1, 1, 1, 0, NOW()), -- Alice -> Python
(2, 2, 1, 1, NOW()), -- Bob -> JavaScript
(3, 3, 1, 2, NOW()), -- Charlie -> C++
(4, 4, 1, 3, NOW()), -- David -> Go
(5, 5, 1, 0, NOW()), -- Emma -> Python
(6, 1, 1, 1, NOW()), -- Alice -> JavaScript
(7, 2, 1, 2, NOW()), -- Bob -> C++
(8, 3, 1, 3, NOW()), -- Charlie -> Go

-- Topic 2: Best Operating System (Only 2 Options)
(9, 1, 2, 0, NOW()),  -- Alice -> Windows
(10, 2, 2, 1, NOW()), -- Bob -> Linux
(11, 3, 2, 1, NOW()), -- Charlie -> Linux
(12, 4, 2, 0, NOW()), -- David -> Windows
(13, 5, 2, 1, NOW()), -- Emma -> Linux

-- Topic 3: Favorite Smartphone Brand
(14, 1, 3, 0, NOW()), -- Alice -> Apple
(15, 2, 3, 1, NOW()), -- Bob -> Samsung
(16, 3, 3, 2, NOW()), -- Charlie -> Google
(17, 4, 3, 1, NOW()), -- David -> Samsung
(18, 5, 3, 0, NOW()), -- Emma -> Apple

-- Topic 4: Best Coffee Brand (4 Options)
(19, 1, 4, 0, NOW()), -- Alice -> Starbucks
(20, 2, 4, 1, NOW()), -- Bob -> Dunkin
(21, 3, 4, 2, NOW()), -- Charlie -> Tim Hortons
(22, 4, 4, 3, NOW()), -- David -> Costa
(23, 5, 4, 0, NOW()), -- Emma -> Starbucks

-- Topic 5: Preferred Vacation Destination (3 Options)
(24, 1, 5, 0, NOW()), -- Alice -> Beach
(25, 2, 5, 1, NOW()), -- Bob -> Mountains
(26, 3, 5, 2, NOW()), -- Charlie -> City
(27, 4, 5, 0, NOW()), -- David -> Beach
(28, 5, 5, 1, NOW()); -- Emma -> Mountains

INSERT INTO comments (comment_id, user_id, topic_id, content, created_at) VALUES
(1, 1, 1, 'Python is the best!', NOW()),
(2, 2, 1, 'JavaScript is everywhere!', NOW()),
(3, 3, 1, 'C++ is powerful!', NOW()),
(4, 4, 2, 'Linux is amazing!', NOW()),
(5, 5, 2, 'Windows is great for gaming!', NOW()),
(6, 1, 3, 'Apple makes the best phones!', NOW()),
(7, 2, 3, 'Samsung is innovative!', NOW()),
(8, 3, 4, 'Starbucks coffee is the best!', NOW()),
(9, 4, 4, 'Dunkin is affordable!', NOW()),
(10, 5, 5, 'I love the beach vacations!', NOW());

