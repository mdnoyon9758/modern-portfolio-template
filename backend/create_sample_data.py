import logging
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Project, BlogPost
from datetime import datetime, timedelta
import random

# Set up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("create_sample_data")

# Sample project data (10 projects)
projects_data = [
    {
        "title": "E-Commerce Platform",
        "description": "<h2>Full-Stack E-Commerce Solution</h2><p>A comprehensive e-commerce platform built with modern technologies. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.</p><h3>Key Features:</h3><ul><li>User registration and authentication</li><li>Product catalog with search and filtering</li><li>Shopping cart and checkout process</li><li>Payment integration with Stripe</li><li>Order management system</li><li>Admin dashboard for inventory management</li></ul>",
        "short_description": "Full-featured e-commerce platform with payment integration and admin dashboard.",
        "technologies": "['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Redux']",
        "github_url": "https://github.com/abdullah/ecommerce-platform",
        "live_url": "https://ecommerce-demo.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "featured": True,
        "order_index": 1
    },
    {
        "title": "Real-Time Chat Application",
        "description": "<h2>WebSocket-Based Chat Platform</h2><p>A real-time messaging application supporting multiple chat rooms, private messaging, file sharing, and emoji support.</p><h3>Features:</h3><ul><li>Real-time messaging with Socket.io</li><li>Multiple chat rooms</li><li>Private messaging</li><li>File and image sharing</li><li>Emoji support</li><li>User presence indicators</li><li>Message history</li></ul>",
        "short_description": "Real-time chat application with multiple rooms and file sharing capabilities.",
        "technologies": "['React', 'Node.js', 'Socket.io', 'Express', 'MongoDB', 'Cloudinary']",
        "github_url": "https://github.com/abdullah/chat-app",
        "live_url": "https://chat.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop",
        "featured": True,
        "order_index": 2
    },
    {
        "title": "Weather Dashboard",
        "description": "<h2>Advanced Weather Forecasting App</h2><p>A comprehensive weather application with location-based forecasts, interactive maps, and weather alerts.</p><h3>Features:</h3><ul><li>Current weather conditions</li><li>5-day weather forecast</li><li>Interactive weather maps</li><li>Location-based search</li><li>Weather alerts and notifications</li><li>Responsive design</li></ul>",
        "short_description": "Advanced weather app with forecasts, maps, and location-based alerts.",
        "technologies": "['React', 'TypeScript', 'OpenWeatherMap API', 'Leaflet Maps', 'PWA']",
        "github_url": "https://github.com/abdullah/weather-dashboard",
        "live_url": "https://weather.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
        "featured": True,
        "order_index": 3
    },
    {
        "title": "Task Management System",
        "description": "<h2>Productivity Management Tool</h2><p>A comprehensive task management system with team collaboration features, project tracking, and analytics.</p><h3>Features:</h3><ul><li>Task creation and assignment</li><li>Project management</li><li>Team collaboration</li><li>Progress tracking</li><li>Time logging</li><li>Analytics dashboard</li><li>File attachments</li></ul>",
        "short_description": "Team-based task management system with collaboration and analytics features.",
        "technologies": "['Vue.js', 'Node.js', 'PostgreSQL', 'Express', 'JWT', 'Chart.js']",
        "github_url": "https://github.com/abdullah/task-manager",
        "live_url": "https://tasks.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 4
    },
    {
        "title": "Social Media Analytics Tool",
        "description": "<h2>Social Media Performance Tracker</h2><p>An analytics dashboard for tracking social media performance across multiple platforms with detailed insights and reporting.</p><h3>Features:</h3><ul><li>Multi-platform integration</li><li>Performance metrics</li><li>Engagement analytics</li><li>Automated reporting</li><li>Content scheduling</li><li>Competitor analysis</li></ul>",
        "short_description": "Analytics tool for tracking social media performance and engagement metrics.",
        "technologies": "['React', 'Python', 'Django', 'PostgreSQL', 'Chart.js', 'Social APIs']",
        "github_url": "https://github.com/abdullah/social-analytics",
        "live_url": "https://analytics.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 5
    },
    {
        "title": "Cryptocurrency Portfolio Tracker",
        "description": "<h2>Crypto Investment Dashboard</h2><p>A comprehensive cryptocurrency portfolio management tool with real-time price tracking, profit/loss calculations, and market analysis.</p><h3>Features:</h3><ul><li>Real-time price tracking</li><li>Portfolio management</li><li>Profit/loss calculations</li><li>Market analysis</li><li>Price alerts</li><li>Historical data visualization</li></ul>",
        "short_description": "Cryptocurrency portfolio tracker with real-time prices and market analysis.",
        "technologies": "['React', 'Node.js', 'CoinGecko API', 'Chart.js', 'WebSocket', 'MongoDB']",
        "github_url": "https://github.com/abdullah/crypto-tracker",
        "live_url": "https://crypto.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 6
    },
    {
        "title": "Recipe Sharing Platform",
        "description": "<h2>Culinary Community Platform</h2><p>A social platform for sharing recipes, cooking tips, and culinary experiences with rating and review system.</p><h3>Features:</h3><ul><li>Recipe sharing and discovery</li><li>User profiles and following</li><li>Rating and review system</li><li>Recipe collections</li><li>Shopping list generator</li><li>Nutritional information</li></ul>",
        "short_description": "Social platform for sharing recipes with ratings and community features.",
        "technologies": "['Next.js', 'Node.js', 'MongoDB', 'Cloudinary', 'Stripe', 'NextAuth']",
        "github_url": "https://github.com/abdullah/recipe-platform",
        "live_url": "https://recipes.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 7
    },
    {
        "title": "Online Learning Management System",
        "description": "<h2>Educational Platform</h2><p>A comprehensive learning management system for online courses with video streaming, assignments, and progress tracking.</p><h3>Features:</h3><ul><li>Course creation and management</li><li>Video streaming</li><li>Assignment submission</li><li>Progress tracking</li><li>Discussion forums</li><li>Certification system</li></ul>",
        "short_description": "Learning management system with video courses and assignment tracking.",
        "technologies": "['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3', 'Video.js']",
        "github_url": "https://github.com/abdullah/lms-platform",
        "live_url": "https://learn.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 8
    },
    {
        "title": "Event Management System",
        "description": "<h2>Event Planning Platform</h2><p>A comprehensive event management system with booking, payment processing, and attendee management features.</p><h3>Features:</h3><ul><li>Event creation and management</li><li>Ticket booking system</li><li>Payment processing</li><li>Attendee management</li><li>QR code generation</li><li>Event analytics</li></ul>",
        "short_description": "Event management platform with booking system and attendee tracking.",
        "technologies": "['Vue.js', 'Laravel', 'MySQL', 'Stripe', 'QR Code API', 'Email API']",
        "github_url": "https://github.com/abdullah/event-manager",
        "live_url": "https://events.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 9
    },
    {
        "title": "AI-Powered Image Editor",
        "description": "<h2>Intelligent Image Processing Tool</h2><p>An AI-powered image editing application with advanced filters, background removal, and smart enhancement features.</p><h3>Features:</h3><ul><li>AI-powered filters</li><li>Background removal</li><li>Smart enhancement</li><li>Batch processing</li><li>Cloud storage integration</li><li>Social sharing</li></ul>",
        "short_description": "AI-powered image editor with smart filters and background removal.",
        "technologies": "['React', 'Python', 'TensorFlow', 'OpenCV', 'AWS Lambda', 'S3']",
        "github_url": "https://github.com/abdullah/ai-image-editor",
        "live_url": "https://editor.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=600&fit=crop",
        "featured": False,
        "order_index": 10
    },
    {
        "title": "Another E-Commerce Platform",
        "description": "<h2>Another Full-Stack E-Commerce Solution</h2><p>A comprehensive e-commerce platform built with modern technologies. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.</p><h3>Key Features:</h3><ul><li>User registration and authentication</li><li>Product catalog with search and filtering</li><li>Shopping cart and checkout process</li><li>Payment integration with Stripe</li><li>Order management system</li><li>Admin dashboard for inventory management</li></ul>",
        "short_description": "Full-featured e-commerce platform with payment integration and admin dashboard.",
        "technologies": "['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Redux']",
        "github_url": "https://github.com/abdullah/ecommerce-platform-2",
        "live_url": "https://ecommerce-demo-2.abdullah.dev",
        "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "featured": True,
        "order_index": 11
    }
]

# Sample blog posts data (10 posts)
blog_posts_data = [
    {
        "title": "Building Modern Web Applications with React and TypeScript",
        "slug": "building-modern-web-apps-react-typescript",
        "content": "<h2>Introduction to Modern Web Development</h2><p>In today's rapidly evolving web development landscape, building scalable and maintainable applications is crucial. React combined with TypeScript provides an excellent foundation for creating robust web applications.</p><h3>Why React and TypeScript?</h3><p>React has revolutionized the way we build user interfaces, while TypeScript adds static type checking to JavaScript, making our code more reliable and easier to maintain.</p><h3>Key Benefits:</h3><ul><li>Type safety and better IDE support</li><li>Improved code documentation</li><li>Better refactoring capabilities</li><li>Reduced runtime errors</li></ul><h3>Getting Started</h3><p>To create a new React project with TypeScript, you can use Create React App with the TypeScript template:</p><pre><code>npx create-react-app my-app --template typescript</code></pre><p>This sets up a complete development environment with TypeScript configured out of the box.</p><h3>Best Practices</h3><p>When working with React and TypeScript, consider these best practices:</p><ul><li>Define proper interfaces for props and states</li><li>Use generic types for reusable components</li><li>Leverage union types for component variants</li><li>Implement proper error boundaries</li></ul><p>By following these practices, you'll create more maintainable and scalable applications that stand the test of time.</p>",
        "excerpt": "Learn how to build scalable web applications using React and TypeScript with best practices and modern development techniques.",
        "tags": "React,TypeScript,Web Development,JavaScript",
        "featured_image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
        "published": True,
        "featured": True,
        "reading_time": 8
    },
    {
        "title": "Mastering Asynchronous JavaScript: Promises, Async/Await, and Beyond",
        "slug": "mastering-asynchronous-javascript",
        "content": "<h2>Understanding Asynchronous Programming</h2><p>Asynchronous programming is fundamental to JavaScript development. Whether you're fetching data from APIs, handling user interactions, or managing timers, understanding async patterns is crucial.</p><h3>Evolution of Async JavaScript</h3><p>JavaScript has evolved significantly in handling asynchronous operations:</p><ul><li>Callbacks (traditional approach)</li><li>Promises (ES6)</li><li>Async/Await (ES2017)</li></ul><h3>Promises: A Better Way</h3><p>Promises provide a cleaner way to handle asynchronous operations:</p><pre><code>fetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));</code></pre><h3>Async/Await: Even Cleaner</h3><p>Async/await makes asynchronous code look synchronous:</p><pre><code>async function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error(error);\n  }\n}</code></pre><h3>Advanced Patterns</h3><p>Learn about advanced async patterns like Promise.all(), Promise.race(), and error handling strategies that will make you a more effective JavaScript developer.</p>",
        "excerpt": "Deep dive into asynchronous JavaScript patterns including Promises, async/await, and advanced error handling techniques.",
        "tags": "JavaScript,Async,Promises,Web Development",
        "featured_image": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
        "published": True,
        "featured": True,
        "reading_time": 12
    },
    {
        "title": "Database Design Patterns for Scalable Applications",
        "slug": "database-design-patterns-scalable-apps",
        "content": "<h2>Designing Databases for Scale</h2><p>As applications grow, database design becomes critical for performance and maintainability. Learn essential patterns and best practices for scalable database architecture.</p><h3>Fundamental Design Principles</h3><ul><li>Normalization vs. Denormalization</li><li>ACID properties</li><li>Indexing strategies</li><li>Query optimization</li></ul><h3>Common Design Patterns</h3><h4>1. Repository Pattern</h4><p>Encapsulate data access logic and provide a uniform interface for data operations.</p><h4>2. Unit of Work Pattern</h4><p>Maintain a list of objects affected by a business transaction and coordinates writing out changes.</p><h4>3. Data Mapper Pattern</h4><p>Separate the in-memory objects from the database schema.</p><h3>NoSQL Considerations</h3><p>When to choose NoSQL over traditional relational databases:</p><ul><li>Document stores (MongoDB)</li><li>Key-value stores (Redis)</li><li>Column-family (Cassandra)</li><li>Graph databases (Neo4j)</li></ul><h3>Performance Optimization</h3><p>Strategies for optimizing database performance at scale including caching, connection pooling, and query optimization techniques.</p>",
        "excerpt": "Essential database design patterns and optimization strategies for building scalable applications.",
        "tags": "Database,SQL,NoSQL,Architecture,Performance",
        "featured_image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
        "published": True,
        "featured": True,
        "reading_time": 15
    },
    {
        "title": "API Security Best Practices: Protecting Your Backend Services",
        "slug": "api-security-best-practices",
        "content": "<h2>Securing Your APIs</h2><p>API security is paramount in today's interconnected world. Learn essential security practices to protect your backend services from common threats.</p><h3>Authentication and Authorization</h3><h4>JWT Tokens</h4><p>JSON Web Tokens provide a secure way to transmit information between parties:</p><pre><code>const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });</code></pre><h4>OAuth 2.0</h4><p>Industry-standard protocol for authorization that enables secure API access.</p><h3>Common Security Threats</h3><ul><li>SQL Injection</li><li>Cross-Site Scripting (XSS)</li><li>Cross-Site Request Forgery (CSRF)</li><li>Man-in-the-Middle attacks</li></ul><h3>Security Headers</h3><p>Implement essential security headers:</p><ul><li>Content-Security-Policy</li><li>X-Frame-Options</li><li>X-Content-Type-Options</li><li>Strict-Transport-Security</li></ul><h3>Rate Limiting and Throttling</h3><p>Protect your APIs from abuse with proper rate limiting strategies and implementation techniques.</p><h3>Input Validation</h3><p>Always validate and sanitize user input to prevent injection attacks and ensure data integrity.</p>",
        "excerpt": "Comprehensive guide to API security including authentication, authorization, and protection against common threats.",
        "tags": "Security,API,Authentication,Backend",
        "featured_image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 10
    },
    {
        "title": "Docker and Kubernetes: Containerization for Modern Applications",
        "slug": "docker-kubernetes-containerization",
        "content": "<h2>Containerization Revolution</h2><p>Docker and Kubernetes have transformed how we deploy and manage applications. Learn how to leverage these technologies for scalable, maintainable deployments.</p><h3>Why Containerization?</h3><ul><li>Consistent environments</li><li>Easy scaling</li><li>Resource efficiency</li><li>Simplified deployment</li></ul><h3>Docker Fundamentals</h3><p>Creating your first Dockerfile:</p><pre><code>FROM node:16-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]</code></pre><h3>Kubernetes Orchestration</h3><p>Kubernetes provides powerful orchestration capabilities:</p><ul><li>Service discovery</li><li>Load balancing</li><li>Automated rollouts and rollbacks</li><li>Self-healing</li></ul><h3>Best Practices</h3><ul><li>Multi-stage builds</li><li>Security scanning</li><li>Resource limits</li><li>Health checks</li></ul><h3>Production Deployment</h3><p>Strategies for deploying containerized applications in production environments with monitoring and logging.</p>",
        "excerpt": "Master containerization with Docker and Kubernetes for scalable application deployment and management.",
        "tags": "Docker,Kubernetes,DevOps,Containerization",
        "featured_image": "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 14
    },
    {
        "title": "GraphQL vs REST: Choosing the Right API Architecture",
        "slug": "graphql-vs-rest-api-architecture",
        "content": "<h2>API Architecture Comparison</h2><p>Both GraphQL and REST are popular API architectures, each with their own strengths and use cases. Learn when to use each approach.</p><h3>REST API Characteristics</h3><ul><li>Resource-based URLs</li><li>HTTP methods (GET, POST, PUT, DELETE)</li><li>Stateless communication</li><li>Multiple round trips</li></ul><h3>GraphQL Benefits</h3><ul><li>Single endpoint</li><li>Flexible queries</li><li>Strong type system</li><li>Real-time subscriptions</li></ul><h3>When to Use REST</h3><ul><li>Simple, well-defined resources</li><li>Caching requirements</li><li>Team familiarity</li><li>File uploads</li></ul><h3>When to Use GraphQL</h3><ul><li>Complex data relationships</li><li>Mobile applications</li><li>Rapid frontend development</li><li>Real-time features</li></ul><h3>Implementation Example</h3><p>GraphQL resolver example:</p><pre><code>const resolvers = {\n  Query: {\n    user: (_, { id }) => User.findById(id),\n    posts: () => Post.find()\n  }\n};</code></pre><p>Choose the architecture that best fits your project's requirements and team expertise.</p>",
        "excerpt": "Comprehensive comparison of GraphQL and REST APIs to help you choose the right architecture for your project.",
        "tags": "GraphQL,REST,API,Architecture",
        "featured_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 11
    },
    {
        "title": "Performance Optimization Techniques for Web Applications",
        "slug": "web-performance-optimization-techniques",
        "content": "<h2>Optimizing Web Performance</h2><p>Performance is crucial for user experience and SEO. Learn proven techniques to make your web applications lightning fast.</p><h3>Core Web Vitals</h3><ul><li>Largest Contentful Paint (LCP)</li><li>First Input Delay (FID)</li><li>Cumulative Layout Shift (CLS)</li></ul><h3>Frontend Optimization</h3><h4>Code Splitting</h4><p>Split your JavaScript bundles for faster initial load times:</p><pre><code>const Component = React.lazy(() => import('./Component'));</code></pre><h4>Image Optimization</h4><ul><li>WebP format</li><li>Responsive images</li><li>Lazy loading</li><li>CDN delivery</li></ul><h3>Backend Optimization</h3><ul><li>Database indexing</li><li>Query optimization</li><li>Caching strategies</li><li>CDN implementation</li></ul><h3>Monitoring and Measurement</h3><p>Tools for measuring and monitoring performance:</p><ul><li>Lighthouse</li><li>Web Vitals</li><li>New Relic</li><li>DataDog</li></ul><h3>Progressive Web Apps</h3><p>Implement PWA features for enhanced performance and user experience including service workers and offline functionality.</p>",
        "excerpt": "Comprehensive guide to web performance optimization covering frontend, backend, and monitoring strategies.",
        "tags": "Performance,Optimization,Web Development,PWA",
        "featured_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 13
    },
    {
        "title": "Machine Learning Integration in Web Applications",
        "slug": "machine-learning-web-applications",
        "content": "<h2>AI-Powered Web Applications</h2><p>Integrating machine learning into web applications opens up endless possibilities. Learn how to add AI capabilities to your projects.</p><h3>ML in the Browser</h3><h4>TensorFlow.js</h4><p>Run machine learning models directly in the browser:</p><pre><code>import * as tf from '@tensorflow/tfjs';\n\nconst model = await tf.loadLayersModel('/model.json');\nconst prediction = model.predict(inputData);</code></pre><h3>Common Use Cases</h3><ul><li>Image recognition</li><li>Natural language processing</li><li>Recommendation systems</li><li>Sentiment analysis</li></ul><h3>Backend ML Integration</h3><h4>Python Flask API</h4><p>Create ML-powered APIs with Python:</p><pre><code>from flask import Flask, request\nimport joblib\n\napp = Flask(__name__)\nmodel = joblib.load('model.pkl')\n\n@app.route('/predict', methods=['POST'])\ndef predict():\n    data = request.json\n    prediction = model.predict([data['features']])\n    return {'prediction': prediction[0]}</code></pre><h3>Model Deployment</h3><ul><li>Cloud ML platforms</li><li>Edge computing</li><li>Model optimization</li><li>A/B testing</li></ul><h3>Ethical Considerations</h3><p>Important considerations when implementing ML in applications including bias, privacy, and transparency.</p>",
        "excerpt": "Learn how to integrate machine learning capabilities into web applications using modern tools and frameworks.",
        "tags": "Machine Learning,AI,TensorFlow,Python",
        "featured_image": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 16
    },
    {
        "title": "Microservices Architecture: Design Patterns and Best Practices",
        "slug": "microservices-architecture-patterns",
        "content": "<h2>Microservices Architecture</h2><p>Microservices architecture enables building scalable, maintainable applications by breaking them into smaller, independent services.</p><h3>Key Principles</h3><ul><li>Single responsibility</li><li>Decentralized governance</li><li>Failure isolation</li><li>Evolutionary design</li></ul><h3>Design Patterns</h3><h4>API Gateway Pattern</h4><p>Centralized entry point for all client requests with routing, authentication, and rate limiting.</p><h4>Circuit Breaker Pattern</h4><p>Prevent cascading failures by monitoring service calls and failing fast when services are unavailable.</p><h4>Saga Pattern</h4><p>Manage distributed transactions across multiple services with compensation actions.</p><h3>Service Communication</h3><ul><li>Synchronous (HTTP/REST)</li><li>Asynchronous (Message queues)</li><li>Event-driven architecture</li></ul><h3>Challenges and Solutions</h3><ul><li>Data consistency</li><li>Service discovery</li><li>Monitoring and logging</li><li>Testing strategies</li></ul><h3>Tools and Technologies</h3><p>Popular tools for microservices development including Docker, Kubernetes, service meshes, and monitoring solutions.</p>",
        "excerpt": "Comprehensive guide to microservices architecture including design patterns, best practices, and implementation strategies.",
        "tags": "Microservices,Architecture,Design Patterns,Scalability",
        "featured_image": "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 18
    },
    {
        "title": "Building Progressive Web Apps: The Future of Web Development",
        "slug": "building-progressive-web-apps",
        "content": "<h2>Progressive Web Apps (PWAs)</h2><p>PWAs combine the best of web and mobile apps, providing native-like experiences through modern web technologies.</p><h3>Core PWA Features</h3><ul><li>Service Workers</li><li>Web App Manifest</li><li>HTTPS requirement</li><li>Responsive design</li></ul><h3>Service Worker Implementation</h3><p>Register and implement service workers for offline functionality:</p><pre><code>// Register service worker\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js');\n}\n\n// Service worker caching\nself.addEventListener('fetch', event => {\n  event.respondWith(\n    caches.match(event.request)\n      .then(response => response || fetch(event.request))\n  );\n});</code></pre><h3>Web App Manifest</h3><p>Configure your app's appearance and behavior:</p><pre><code>{\n  \"name\": \"My PWA\",\n  \"short_name\": \"PWA\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\",\n  \"background_color\": \"#ffffff\",\n  \"theme_color\": \"#000000\",\n  \"icons\": [...]\n}</code></pre><h3>Benefits of PWAs</h3><ul><li>Improved performance</li><li>Offline functionality</li><li>Push notifications</li><li>App-like experience</li><li>No app store required</li></ul><h3>Tools and Frameworks</h3><p>Popular tools for PWA development including Workbox, PWA Builder, and framework-specific solutions.</p>",
        "excerpt": "Learn how to build Progressive Web Apps that deliver native-like experiences using modern web technologies.",
        "tags": "PWA,Progressive Web Apps,Service Workers,Mobile",
        "featured_image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
        "published": True,
        "featured": False,
        "reading_time": 12
    },
    {
        "title": "Another Post about Web Development",
        "slug": "another-post-about-web-development",
        "content": "<h2>Another Post about Web Development</h2><p>Asynchronous programming is fundamental to JavaScript development. Whether you're fetching data from APIs, handling user interactions, or managing timers, understanding async patterns is crucial.</p><h3>Evolution of Async JavaScript</h3><p>JavaScript has evolved significantly in handling asynchronous operations:</p><ul><li>Callbacks (traditional approach)</li><li>Promises (ES6)</li><li>Async/Await (ES2017)</li></ul><h3>Promises: A Better Way</h3><p>Promises provide a cleaner way to handle asynchronous operations:</p><pre><code>fetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));</code></pre><h3>Async/Await: Even Cleaner</h3><p>Async/await makes asynchronous code look synchronous:</p><pre><code>async function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error(error);\n  }\n}</code></pre><h3>Advanced Patterns</h3><p>Learn about advanced async patterns like Promise.all(), Promise.race(), and error handling strategies that will make you a more effective JavaScript developer.</p>",
        "excerpt": "Deep dive into asynchronous JavaScript patterns including Promises, async/await, and advanced error handling techniques.",
        "tags": "JavaScript,Async,Promises,Web Development",
        "featured_image": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
        "published": True,
        "featured": True,
        "reading_time": 12
    }
]

def add_sample_data(db: Session):
    """Add sample projects and blog posts to the database."""
    logger.info("Clearing existing data...")
    
    # Clear existing data
    db.query(BlogPost).delete()
    db.query(Project).delete()
    db.commit()
    
    logger.info("Adding sample projects...")
    
    # Insert sample projects
    for project_data in projects_data:
        # Set created_at if not present
        if 'created_at' not in project_data:
            project_data['created_at'] = datetime.utcnow()
        
        project = Project(**project_data)
        db.add(project)
        logger.info(f"Added project: {project_data['title']}")

    logger.info("Adding sample blog posts...")
    
    # Insert sample blog posts
    for blog_post_data in blog_posts_data:
        # Set published_at for published posts
        if blog_post_data.get('published', False) and 'published_at' not in blog_post_data:
            # Vary the published dates for more realistic data
            days_ago = random.randint(1, 90)
            blog_post_data['published_at'] = datetime.utcnow() - timedelta(days=days_ago)
        
        # Set created_at if not present
        if 'created_at' not in blog_post_data:
            blog_post_data['created_at'] = datetime.utcnow()
            
        blog_post = BlogPost(**blog_post_data)
        db.add(blog_post)
        logger.info(f"Added blog post: {blog_post_data['title']}")

    db.commit()
    logger.info("All sample data committed to database!")


def main():
    logger.info("🔄 Inserting sample data...")
    db = SessionLocal()
    add_sample_data(db)
    db.close()
    logger.info("✅ Sample data inserted successfully!")


if __name__ == "__main__":
    main()
