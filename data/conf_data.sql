CREATE TABLE user (
    id_discord TEXT PRIMARY KEY UNIQUE,
    email_epitech TEXT NOT NULL UNIQUE
);

CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    student_max TEXT NOT NULL,
    presence INTEGER NOT NULL,
    current_date TEXT NOT NULL
);

CREATE TABLE activities_logs (
    id INTEGER PRIMARY KEY,
    discord_id TEXT NOT NULL,
    activity_id TEXT NOT NULL,
    current_date TEXT NOT NULL,
    status TEXT NOT NULL
);