  const express = require("express");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");
  const mysql = require('mysql2/promise'); 
  const cors = require("cors");
  const sharp = require('sharp');
  const archiver = require('archiver');

  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'Imedtag';

  const app = express();
  const port = 5000;

  // Enable CORS
  app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parser setup
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  app.use(express.static("public"));

  // Serve uploaded files
  const uploadsPath = path.join(__dirname, "uploads");
  app.use("/uploads", express.static(uploadsPath, {
    setHeaders: (res, path) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cache-Control", "public, max-age=31536000");
    }
  }));

  // MySQL connection pool
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || " ", //your MySQL password
    database: process.env.DB_NAME || "Imedtag",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test MySQL connection
  async function testConnection() {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log("Connected to MySQL database");
      await connection.query('SELECT 1');
    } catch (err) {
      console.error("Database connection failed:", err);
    } finally {
      if (connection) connection.release();
    }
  }

  testConnection();

  // Ensure upload directory exists
  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Multer storage setup
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage,
    limits: { 
      fileSize: 100 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
      }
    }
  });

  // Log all requests
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error'
    });
  });

  // User signup API
  app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO User (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ 
        message: "Server error", 
        error: error.code === 'ER_DUP_ENTRY' ? "Email already exists" : error.message 
      });
    }
  });

  // User login API
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({  message: "Login successful", token, user_id: user.user_id });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get current authenticated user info
  app.get('/api/user', authenticateToken, async (req, res) => {
      try {
          const [rows] = await pool.query(
    'SELECT user_id, name, email FROM User WHERE user_id = ?', 
    [req.user.userId]
  );
          if (rows.length === 0) {
              console.error('User not found for ID:', req.user.userId); 
              return res.status(404).json({ error: 'User not found' });
          }
          res.json(rows[0]);
      } catch (err) {
          console.error('Error fetching user:', err); 
          res.status(500).json({ error: 'Server error' });
      }
  });

  // Get specific user by ID
  app.get("/api/user/:id", authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT user_id, name, email FROM User WHERE user_id = ?', [req.params.id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(rows[0]);
      } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
  });

  // Project Routes
  // Get all projects of the authenticated user
  app.get("/api/projects", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const tagFilter = req.query.tag;

      let query = "SELECT * FROM Project WHERE user_id = ?";
      let params = [userId];

      if (tagFilter) {
        query += " AND tag LIKE ?";
        params.push(`%${tagFilter}%`);
      }

      query += " ORDER BY project_id DESC, created_at DESC";

      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Get specific project by ID
  app.get("/api/projects/:id", authenticateToken, async (req, res) => {
    try {
      const projectId = req.params.id;
      const userId = req.user.userId;

      const [rows] = await pool.query(
        "SELECT * FROM Project WHERE project_id = ? AND user_id = ?",
        [projectId, userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create new project
  app.post("/projects", async (req, res) => {
    const { user_id, project_name, tag, type, labeled_status } = req.body;

    if (!user_id || !project_name || !type || !tag) {
      return res.status(400).json({ error: "User ID, Project Name, Type, and Tag are required." });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO Project (user_id, project_name, tag, type, labeled_status) VALUES (?, ?, ?, ?, ?)",
        [user_id, project_name, tag, type, labeled_status || 0]
      );

      const [rows] = await pool.query("SELECT * FROM Project WHERE project_id = ?", [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error saving project:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Toggle project favorite status
  app.patch('/api/projects/:projectId/favorite', authenticateToken, async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.userId;

    try {
      const [rows] = await pool.query(
        'SELECT favorite FROM Project WHERE project_id = ? AND user_id = ?',
        [projectId, userId]
      );

      if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });

      const currentFavorite = rows[0].favorite;
      const newFavorite = !currentFavorite;

      await pool.query(
        'UPDATE Project SET favorite = ? WHERE project_id = ? AND user_id = ?',
        [newFavorite, projectId, userId]
      );

      res.json({ projectId, favorite: newFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      res.status(500).json({ error: 'Failed to toggle favorite' });
    }
  });

  // Delete a project and all related data
  app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.userId;
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Check if project exists and belongs to user
      const [project] = await connection.query(
        `SELECT * FROM Project WHERE project_id = ? AND user_id = ?`,
        [projectId, userId]
      );
      if (project.length === 0) {
        return res.status(404).json({ error: "Project not found or unauthorized" });
      }

      // Get images in the project
      const [images] = await connection.query(
        `SELECT i.image_id, i.image_name FROM Image i
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        WHERE pi.project_id = ?`,
        [projectId]
      );
      const imageIds = images.map(img => img.image_id);

      // Delete annotations linked to these images
      if (imageIds.length > 0) {
        await connection.query(`
          DELETE a FROM Annotation a
          JOIN ImageLabel il ON a.imagelabel_id = il.imagelabel_id
          WHERE il.image_id IN (?)`, [imageIds]);

        await connection.query(`DELETE FROM ImageLabel WHERE image_id IN (?)`, [imageIds]);
      }

      // Delete labels and project-image associations
      await connection.query(`DELETE FROM Label WHERE project_id = ?`, [projectId]);
      await connection.query(`DELETE FROM ProjectImage WHERE project_id = ?`, [projectId]);

      // Delete images and remove physical files
      if (imageIds.length > 0) {
        await connection.query(`DELETE FROM Image WHERE image_id IN (?)`, [imageIds]);
        for (const img of images) {
          const filePath = path.join(__dirname, 'uploads', img.image_name);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      // Delete project
      await connection.query(`DELETE FROM Project WHERE project_id = ?`, [projectId]);

      await connection.commit();
      res.json({ message: "Project and all related data deleted successfully." });

    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  });

  // Get all images for a specific project
  app.get("/api/projects/:id/images", authenticateToken, async (req, res) => {
    try {
      const [images] = await pool.query(
          `SELECT i.image_id, i.image_name 
          FROM Image i
          JOIN ProjectImage pi ON i.image_id = pi.image_id
          WHERE pi.project_id = ?`,
          [req.params.id]
      );
      res.json(images.map(img => ({
          ...img,
          file_path: `/uploads/${img.image_name}`
      })));
  } catch (error) {
      res.status(500).json({ error: "Database error" });
  }
  });

  // Image Routes
  app.get("/api/images/:projectId", authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT i.image_id, i.image_name, 
                COALESCE(i.file_path, CONCAT('/uploads/', i.image_name)) AS file_path
        FROM Image i
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        WHERE pi.project_id = ?`,
        [req.params.projectId]
      );
      res.json(rows);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //upload image
  app.post('/api/images/upload/:projectId', authenticateToken, upload.array('images'), async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const uploaded = [];

      for (const file of req.files) {
        const tempPath = path.join(__dirname, 'uploads', file.filename);

        // Get dimensions
        const metadata = await sharp(tempPath).metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;

        // Insert into DB to get image_id first
        const [imageResult] = await connection.query(
          `INSERT INTO Image (user_id, image_name, file_path, labeled_status, width, height)
          VALUES (?, ?, ?, 0, ?, ?)`,
          [userId, '', '', width, height] 
        );

        const imageId = imageResult.insertId;
        const newFilename = `image_${imageId}${path.extname(file.originalname)}`;
        const newFilePath = path.join(__dirname, 'uploads', newFilename);

        // Rename the file
        fs.renameSync(tempPath, newFilePath);

        // Update record with real filename and file_path
        await connection.query(
          `UPDATE Image SET image_name = ?, file_path = ? WHERE image_id = ?`,
          [newFilename, `/uploads/${newFilename}`, imageId]
        );

        // Link to project
        await connection.query(
          `INSERT INTO ProjectImage (project_id, image_id)
          VALUES (?, ?)`,
          [projectId, imageId]
        );

        uploaded.push({
          image_id: imageId,
          file: newFilename,
          width,
          height
        });
      }

      await connection.commit();
      res.json({ success: true, count: uploaded.length, uploads: uploaded });

    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    } finally {
      if (connection) connection.release();
    }
  });

  //delete image
  app.delete("/images/:imageId", authenticateToken, async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.userId;

    try {
      // Check if the image belongs to the user
      const [image] = await pool.query(
        `SELECT i.image_name FROM Image i
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        JOIN Project p ON pi.project_id = p.project_id
        WHERE i.image_id = ? AND p.user_id = ?`,
        [imageId, userId]
      );

      if (image.length === 0) {
        return res.status(403).json({ message: "Not authorized to delete this image" });
      }

      // Delete from DB
      await pool.query("DELETE FROM Image WHERE image_id = ?", [imageId]);

      // Delete file - using the stored filename
      const filePath = path.join(__dirname, "uploads", image[0].image_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // keep token for login user
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  }

  //error message
  function handleDbError(res, error, action) {
    console.error(`Error ${action}:`, error);
    res.status(500).json({ 
      error: `Failed to ${action}`,
      details: error.message 
    });
  }

  // Get project images
  app.get("/api/projects/:id/images", authenticateToken, async (req, res) => {
    try {
        const [images] = await pool.query(
            `SELECT i.image_id, i.image_name 
            FROM Image i
            JOIN ProjectImage pi ON i.image_id = pi.image_id
            WHERE pi.project_id = ?`,
            [req.params.id]
        );
        res.json(images.map(img => ({
            ...img,
            file_path: `/uploads/${img.image_name}`
        })));
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
  });

  // Get single image
  app.get('/api/images/:id', authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          image_id, 
          image_name, 
          COALESCE(file_path, CONCAT('/uploads/', image_name)) AS file_path 
        FROM Image 
        WHERE image_id = ?`,
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error("Error fetching image:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get image annotations
  app.get('/api/images/:imageId/annotations', authenticateToken, async (req, res) => {
    const imageId = req.params.imageId;

    try {
      const [annotations] = await pool.query(`
        SELECT 
          a.x_min, a.y_min, a.x_max, a.y_max,
          il.label_id
        FROM Annotation a
        JOIN ImageLabel il ON a.imagelabel_id = il.imagelabel_id
        WHERE il.image_id = ?
      `, [imageId]);

      res.json(annotations);
    } catch (error) {
      console.error('Error loading annotations:', error);
      res.status(500).json({ error: 'Failed to load annotations' });
    }
  });

  // Save annotation
  app.post("/api/annotations", authenticateToken, async (req, res) => {
    try {
      const { image_id, label_id, x_min, x_max, y_min, y_max } = req.body;

      if (!image_id || !label_id || 
          x_min === undefined || x_max === undefined ||
          y_min === undefined || y_max === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const [rows] = await pool.query(
        `SELECT imagelabel_id FROM ImageLabel 
        WHERE image_id = ? AND label_id = ?`,
        [image_id, label_id]
      );

      let imagelabel_id;
      if (rows.length === 0) {
        const [result] = await pool.query(
          `INSERT INTO ImageLabel (image_id, label_id) VALUES (?, ?)`,
          [image_id, label_id]
        );
        imagelabel_id = result.insertId;
      } else {
        imagelabel_id = rows[0].imagelabel_id;
      }

      const [result] = await pool.query(
        `INSERT INTO Annotation 
        (imagelabel_id, x_min, x_max, y_min, y_max)
        VALUES (?, ?, ?, ?, ?)`,
        [imagelabel_id, x_min, x_max, y_min, y_max]
      );

      //count image as labeled
      await pool.query(
        `UPDATE Image SET labeled_status = 1 WHERE image_id = ?`,
        [image_id]
      );

      res.json({ 
        success: true,
        annotation_id: result.insertId
      });

    } catch (error) {
      console.error("Error saving annotation:", error);
      res.status(500).json({ 
        error: "Failed to save annotation",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Label CRUD endpoints
  app.post("/api/labels", authenticateToken, async (req, res) => {
    try {
        const { project_id, label_name, label_color, label_category } = req.body;
        const [result] = await pool.query(
            `INSERT INTO Label 
            (project_id, label_name, label_color, label_category)
            VALUES (?, ?, ?, ?)`,
            [project_id, label_name, label_color, label_category || 'object']
        );
        res.json({ label_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
  });

  app.put("/api/labels/:id", authenticateToken, async (req, res) => {
    try {
        const { label_name, label_color } = req.body;
        await pool.query(
            `UPDATE Label SET 
            label_name = ?, label_color = ?
            WHERE label_id = ?`,
            [label_name, label_color, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
  });

  // Labeling Routes
  app.get("/api/projects/:projectId/labels", authenticateToken, async (req, res) => {
    try {
      // Verify project belongs to user
      const [project] = await pool.query(
        "SELECT * FROM Project WHERE project_id = ? AND user_id = ?", 
        [req.params.projectId, req.user.userId]
      );
      
      if (project.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      const [labels] = await pool.query(
        "SELECT * FROM Label WHERE project_id = ?",
        [req.params.projectId]
      );
      
      res.json(labels);
    } catch (error) {
      console.error("Error fetching labels:", error);
      res.status(500).json({ error: "Failed to fetch labels" });
    }
  });

  //export image
  app.get('/api/projects/:projectId/export/raw', authenticateToken, async (req, res) => {
    const projectId = req.params.projectId;

    try {
      // Get all images for this project
      const [images] = await pool.query(`
        SELECT i.image_name FROM Image i
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        WHERE pi.project_id = ?`, [projectId]);

      if (images.length === 0) {
        return res.status(404).json({ error: 'No images found for this project.' });
      }

      const archive = archiver('zip', { zlib: { level: 9 } });
      res.attachment(`project_${projectId}_images.zip`);
      archive.pipe(res);

      for (const img of images) {
        const filePath = path.join(__dirname, 'uploads', img.image_name);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: img.image_name });
        }
      }

      await archive.finalize();
    } catch (err) {
      console.error('Export raw failed:', err);
      res.status(500).json({ error: 'Failed to export raw images.' });
    }
  });

  //export coco file
  app.get('/api/projects/:projectId/export/coco', authenticateToken, async (req, res) => {
    const projectId = req.params.projectId;

    try {
       // Load images with size
      const [images] = await pool.query(`
        SELECT i.image_id, i.image_name, i.file_path, i.width, i.height
        FROM Image i
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        WHERE pi.project_id = ?`, [projectId]);

      if (images.length === 0) {
        return res.status(404).json({ error: 'No images for COCO export.' });
      }

      // Load annotations
      const [annotations] = await pool.query(`
        SELECT 
          a.annotation_id, a.x_min, a.y_min, a.x_max, a.y_max,
          i.image_id, i.image_name,
          l.label_id, l.label_name
        FROM Annotation a
        JOIN ImageLabel il ON a.imagelabel_id = il.imagelabel_id
        JOIN Image i ON il.image_id = i.image_id
        JOIN Label l ON il.label_id = l.label_id
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        WHERE pi.project_id = ?`, [projectId]);

      const imageMap = new Map();
      images.forEach(img => {
        imageMap.set(img.image_id, {
          width: img.width || 1,
          height: img.height || 1
        });
      });

      // Build categories
      const categoriesMap = new Map();
      let categoryId = 1;
      const categories = [];
      const categoryIndex = {};

      for (const ann of annotations) {
        if (!categoriesMap.has(ann.label_name)) {
          categoriesMap.set(ann.label_name, categoryId);
          categories.push({ id: categoryId, name: ann.label_name });
          categoryIndex[ann.label_name] = categoryId;
          categoryId++;
        }
      }

      const coco = {
        images: images.map(img => ({
          id: img.image_id,
          file_name: img.image_name,
          width: img.width || 0,
          height: img.height || 0
        })),
        annotations: annotations.map(ann => {
          const imageEntry = imageMap.get(ann.image_id);
          const imgW = imageEntry?.width || 1;
          const imgH = imageEntry?.height || 1;

          const x_abs = Math.round(ann.x_min * imgW);
          const y_abs = Math.round(ann.y_min * imgH);
          const width_abs = Math.round((ann.x_max - ann.x_min) * imgW);
          const height_abs = Math.round((ann.y_max - ann.y_min) * imgH);

          return {
            id: ann.annotation_id,
            image_id: ann.image_id,
            category_id: categoryIndex[ann.label_name],
            bbox: [x_abs, y_abs, width_abs, height_abs],
            area: width_abs * height_abs,
            iscrowd: 0
          };
        }),
        categories: categories
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=project_${projectId}_coco.json`);
      res.send(JSON.stringify(coco, null, 2));
    } catch (err) {
      console.error('Export COCO failed:', err);
      res.status(500).json({ error: 'Failed to export COCO file.' });
    }
  });

  // Get annotations for a specific image
  app.get("/api/images/:imageId/annotations", authenticateToken, async (req, res) => {
    try {
      const [image] = await pool.query(
        `SELECT i.* FROM Image i
        JOIN ProjectImage pi ON i.image_id = pi.image_id
        JOIN Project p ON pi.project_id = p.project_id
        WHERE i.image_id = ? AND p.user_id = ?`,
        [req.params.imageId, req.user.userId]
      );
      
      if (image.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }

      const [annotations] = await pool.query(
        `SELECT a.*, l.label_name, l.label_color 
        FROM Annotation a
        JOIN ImageLabel il ON a.imagelabel_id = il.imagelabel_id
        JOIN Label l ON il.label_id = l.label_id
        WHERE il.image_id = ?`,
        [req.params.imageId]
      );
      
      res.json(annotations);
    } catch (error) {
      console.error("Error fetching annotations:", error);
      res.status(500).json({ error: "Failed to fetch annotations" });
    }
  });

  // Update a label
  app.put("/api/labels/:labelId", authenticateToken, async (req, res) => {
    try {
      const { label_name, label_color } = req.body;

      const [label] = await pool.query(
        `SELECT l.* FROM Label l
        JOIN Project p ON l.project_id = p.project_id
        WHERE l.label_id = ? AND p.user_id = ?`,
        [req.params.labelId, req.user.userId]
      );
      
      if (label.length === 0) {
        return res.status(404).json({ error: "Label not found" });
      }

      await pool.query(
        "UPDATE Label SET label_name = ?, label_color = ? WHERE label_id = ?",
        [label_name, label_color, req.params.labelId]
      );
      
      res.json({ message: "Label updated successfully" });
    } catch (error) {
      console.error("Error updating label:", error);
      res.status(500).json({ error: "Failed to update label" });
    }
  });

  // Delete a label
  app.delete("/api/labels/:labelId", authenticateToken, async (req, res) => {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Verify label belongs to user's project
      const [label] = await connection.query(
        `SELECT l.* FROM Label l
        JOIN Project p ON l.project_id = p.project_id
        WHERE l.label_id = ? AND p.user_id = ?`,
        [req.params.labelId, req.user.userId]
      );
      
      if (label.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: "Label not found" });
      }

      //delete annotations using this label
      await connection.query(
        `DELETE a FROM Annotation a
        JOIN ImageLabel il ON a.imagelabel_id = il.imagelabel_id
        WHERE il.label_id = ?`,
        [req.params.labelId]
      );

      // delete image-label
      await connection.query(
        "DELETE FROM ImageLabel WHERE label_id = ?",
        [req.params.labelId]
      );

      // delete the label
      await connection.query(
        "DELETE FROM Label WHERE label_id = ?",
        [req.params.labelId]
      );

      await connection.commit();
      res.json({ message: "Label deleted successfully" });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error deleting label:", error);
      res.status(500).json({ error: "Failed to delete label" });
    } finally {
      if (connection) connection.release();
    }
  });

  app.delete('/api/annotations/:imageId/:x/:y', authenticateToken, async (req, res) => {
    const { imageId, x, y } = req.params;
    try {
      // Find annotation by coordinates
      const [annotations] = await pool.query(`
        SELECT a.annotation_id FROM Annotation a
        JOIN ImageLabel il ON a.imagelabel_id = il.imagelabel_id
        WHERE il.image_id = ? AND ABS(a.x_min - ?) < 0.01 AND ABS(a.y_min - ?) < 0.01
        LIMIT 1
      `, [imageId, x, y]);

      if (annotations.length === 0) {
        return res.status(404).json({ message: 'Annotation not found' });
      }

      const annotationId = annotations[0].annotation_id;

      await pool.query(`DELETE FROM Annotation WHERE annotation_id = ?`, [annotationId]);

      res.json({ message: 'Annotation deleted' });
    } catch (error) {
      console.error('Error deleting annotation:', error);
      res.status(500).json({ message: 'Failed to delete annotation' });
    }
  });

  // Root route
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
