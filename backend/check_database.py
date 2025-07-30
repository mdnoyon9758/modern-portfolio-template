import sqlite3

conn = sqlite3.connect('portfolio_test.db')
cursor = conn.cursor()

print('=== Database Tables and Data ===')

# Show all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print(f'Tables: {[table[0] for table in tables]}')

# Show projects data
print('\n--- Projects ---')
cursor.execute('SELECT id, title, featured FROM projects')
projects = cursor.fetchall()
for project in projects:
    print(f'ID: {project[0]}, Title: {project[1]}, Featured: {project[2]}')

# Show blog posts
print('\n--- Blog Posts ---')
cursor.execute('SELECT id, title, published FROM blog_posts')
posts = cursor.fetchall()
for post in posts:
    print(f'ID: {post[0]}, Title: {post[1]}, Published: {post[2]}')

# Show contact messages
print('\n--- Contact Messages ---')
cursor.execute('SELECT id, name, email, subject FROM contact_messages')
messages = cursor.fetchall()
for msg in messages:
    print(f'ID: {msg[0]}, Name: {msg[1]}, Email: {msg[2]}, Subject: {msg[3]}')

# Show skills
print('\n--- Skills ---')
cursor.execute('SELECT id, name, category, proficiency FROM skills')
skills = cursor.fetchall()
for skill in skills:
    print(f'ID: {skill[0]}, Name: {skill[1]}, Category: {skill[2]}, Proficiency: {skill[3]}')

conn.close()
print('\n=== Database inspection completed! ===')
