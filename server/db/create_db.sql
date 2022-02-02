-- Create a user
CREATE TABLE "user" (
  id serial PRIMARY KEY NOT NULL,
	username VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(50) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  birthday DATE,
  created_at TIMESTAMP NOT NULL,
  is_verified BOOLEAN
    DEFAULT false,
  verified_at TIMESTAMP
);

-- Create a user verification
CREATE TABLE user_verification (
  id serial PRIMARY KEY NOT NULL,
  user_id serial,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id)
      REFERENCES "user" (id)
);