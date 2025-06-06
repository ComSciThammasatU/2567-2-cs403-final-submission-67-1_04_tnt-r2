    const serverUrl = "http://localhost:5000";
    let currentProjectId = null;
    let currentUserId = null;
    
    document.getElementById("backButton").addEventListener("click", function () {
        window.location.href = "CreateProject.html";
    });


    document.getElementById("menu-upload").addEventListener("click", function () {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
        window.location.href = `Upload.html?id=${projectId}`;
    } else {
        showError("Project ID is missing");
    }
    });

    document.getElementById("menu-labeling").addEventListener("click", function () {
        const projectId = getProjectIdFromUrl();
        if (projectId) {
            window.location.href = `labeling.html?id=${projectId}`;
        } else {
            showError("Project ID is missing");
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
        loadImages(projectId);
    }
    });

    document.addEventListener("DOMContentLoaded", function () {
        const projectId = getProjectIdFromUrl();
        if (projectId) {
            loadProjectData(projectId);
            loadImages(projectId);
        }
        const labelingMenuItem = document.querySelector('.left-sidebar a:nth-child(3)');
        labelingMenuItem.classList.add('active');
    });


    // Get project ID from URL query parameter
    function getProjectIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    // Export button functionality
    document.getElementById("exportButton").addEventListener("click", function() {
        document.getElementById("exportModal").style.display = "block";
    });


    async function loadProjectData(projectId) {
    try {
        const res = await fetch(`${serverUrl}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to load project");

        const project = await res.json();
        document.getElementById("projectName").innerText = project.project_name;

        // Optional: show instruction or user
        const userRes = await fetch(`${serverUrl}/api/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (userRes.ok) {
        const user = await userRes.json();
        document.getElementById("creatorName").innerText = user.name || "Unknown";
        }
    } catch (err) {
        console.error("Error loading project data:", err);
        showError("Could not load project details");
    }
    }

    async function loadImages(projectId) {
    try {
        const response = await fetch(`${serverUrl}/api/images/${projectId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Failed to load images");

        const images = await response.json();
        const preview = document.getElementById("imagePreview");
        preview.innerHTML = "";

        images.forEach(img => {
        const container = document.createElement("div");
        container.className = "image-container";
        container.dataset.id = img.image_id;

        const image = document.createElement("img");
        image.src = `${serverUrl}${img.file_path}`;
        image.alt = img.image_name;

        const btn = document.createElement("button");
        btn.textContent = "X";
        btn.className = "delete-btn";
        btn.onclick = () => deleteImage(img.image_id);

        container.appendChild(image);
        container.appendChild(btn);
        preview.appendChild(container);
        });
    } catch (err) {
        console.error("Error loading images:", err);
        showError("Failed to load images");
    }
    }

    document.querySelectorAll(".left-sidebar a").forEach(link => {
        link.addEventListener("click", function() {
            document.querySelectorAll(".left-sidebar a").forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });

    document.getElementById("menu-more").addEventListener("click", function(event) {
        event.preventDefault();
        let menu = document.getElementById("optionsMenu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });
        
    document.addEventListener("click", function(event) {
        let menu = document.getElementById("optionsMenu");
        if (!event.target.closest(".more-options")) {
            menu.style.display = "none";
        }
    });

        function closeExportModal() {
        document.getElementById("exportModal").style.display = "none";
    }

    async function exportRaw() {
        const projectId = getProjectIdFromUrl();
        try {
            const res = await fetch(`${serverUrl}/api/projects/${projectId}/export/raw`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `project_${projectId}_raw.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            closeExportModal();
        } catch (error) {
            showError("Failed to export raw images.");
        }
    }

    async function exportCoco() {
        const projectId = getProjectIdFromUrl();
        try {
        const res = await fetch(`${serverUrl}/api/projects/${projectId}/export/coco`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
    
        if (!res.ok) throw new Error("COCO export failed");
    
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `project_${projectId}_coco.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        } catch (err) {
        console.error("COCO export error:", err);
        showError("Failed to export COCO file.");
        }
    }
    