const serverUrl = "http://localhost:5000";
let selectedType = "Object Detection";

    document.addEventListener("DOMContentLoaded", function () {
        const sidebarLinks = document.querySelectorAll(".sidebar-link");
        const containers = document.querySelectorAll(".container");
        const accountBtn = document.getElementById("accountBtn");
        const accountPopup = document.getElementById("accountPopup");

        sidebarLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                sidebarLinks.forEach(item => item.classList.remove("active"));
                this.classList.add("active");
                containers.forEach(container => container.classList.remove("active"));
                const targetId = this.getAttribute("data-target");
                document.getElementById(targetId).classList.add("active");
            });
    });

    accountBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        accountPopup.style.display = (accountPopup.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!accountPopup.contains(event.target) && event.target !== accountBtn) {
            accountPopup.style.display = "none";
        }
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
    const signOutBtn = document.getElementById("signOutBtn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
        });
    }

    document.querySelectorAll(".signout-btn").forEach(btn => {
        btn.addEventListener("click", logout);
    });

    function logout() {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
    });

    function getProjectIdFromUrl() {
        return new URLSearchParams(window.location.search).get("id");
    }
  
    function jwt_decode(token) {
        try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
        } catch (e) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return {};
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        loadUserInfo()
        loadProjects();
        
        document.getElementById("projectContainer").addEventListener("click", function(event) {
            if (event.target.classList.contains("delete-btn")) {
                const projectId = event.target.getAttribute("data-id");
                deleteProject(projectId);
            }
        });
    });

    async function loadUserInfo() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${serverUrl}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load user info');
            
            const user = await response.json();
            
            const accountLink = document.getElementById('accountBtn');
            if (accountLink) {
            const iconSpan = accountLink.querySelector('.icon');
            const nameSpan = accountLink.querySelector('span:not(.icon)');
            
            if (iconSpan) iconSpan.textContent = user.name.charAt(0);
            if (nameSpan) nameSpan.textContent = user.name;
            }

            const accountPopup = document.getElementById('accountPopup');
            accountPopup.querySelector('strong').textContent = user.name;
            accountPopup.querySelector('p').textContent = user.email;
            
            
            const profileCard = document.querySelector('.profile-card');
            if (profileCard) {
                profileCard.querySelector('.profile-pic').textContent = user.name.charAt(0);
                profileCard.querySelector('strong').textContent = user.name;
                profileCard.querySelector('span').textContent = user.email;
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }

    async function loadProjects() {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Not logged in. Redirecting...");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/projects", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const projects = await response.json();
            const projectContainer = document.getElementById("projectContainer");

            projectContainer.innerHTML = `
                <div class="project-card" onclick="openModal()">
                    <h3>+</h3>
                    <p>Create New Project</p>
                </div>
            `;

            projects
        .sort((a, b) => {
            if (b.favorite - a.favorite !== 0) return b.favorite - a.favorite; 
            return new Date(b.created_at) - new Date(a.created_at);
        })
        .forEach(addProjectToUI);

        } catch (error) {
            console.error("Error loading projects:", error);
            alert("Failed to load projects. Please check console for details.");
        }
    }

    function addProjectToUI(project) {
        const projectContainer = document.getElementById("projectContainer");

        const projectCard = document.createElement("div");
        projectCard.dataset.tags = project.tag || '';
        projectCard.classList.add("project-card");

        const isFav = project.favorite ? '★' : '☆'; 

        projectCard.innerHTML = `
            <div class="project-header">
                <h3>${project.project_name}</h3>
                <button class="favorite-btn" onclick="toggleFavorite(${project.project_id})">${isFav}</button>
            </div>
            <p>Tag: <span class="project-tag">#${project.tag || "none"}</span></p>
            <div class="button-container">
                <button class="open-btn" onclick="window.location.href='Upload.html?id=${project.project_id}'">Open</button>
                <button class="delete-btn" data-id="${project.project_id}">Delete</button>
            </div>
        `;

        projectContainer.appendChild(projectCard);
    }

    async function toggleFavorite(projectId) {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${serverUrl}/api/projects/${projectId}/favorite`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to toggle favorite");
            }

            await loadProjects(); 
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function createProject() {
        const projectName = document.getElementById("projectName").value.trim();
        const tagInput = document.getElementById("searchTag");
        const tag = tagInput.value.trim(); 

        if (!projectName || !selectedType) {
            alert("Please enter a project name and tag");
            return;
        }

        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        const userId = decoded.userId;

        const newProject = {
            user_id: userId,
            project_name: projectName,
            tag: tag,
            type : selectedType,
            labeled_status: 0 
        };

        try {
            const response = await fetch("http://localhost:5000/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create project");
            }

            const createdProject = await response.json();
            addProjectToUI(createdProject);
            closeModal();
            
            document.getElementById("projectName").value = "";
            document.getElementById("tagContainer").innerHTML = "";
            
        } catch (error) {
            console.error("Error creating project:", error);
            alert(`Failed to create project: ${error.message}`);
        }
    }

    async function deleteProject(projectId) {
        if (!confirm("Are you sure you want to delete this project and all its data?")) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            });

            const text = await response.text();

            if (!response.ok) {
            try {
                const error = JSON.parse(text);
                throw new Error(error.error || "Failed to delete project");
            } catch {
                throw new Error("Invalid JSON in response");
            }
            }

            console.log("Project deleted:", text);
            alert("Project deleted successfully.");
            await loadProjects(); 
        } catch (error) {
            console.error("Error deleting project:", error);
            alert(`Failed to delete project: ${error.message}`);
        }
    }

    function openModal() {
        document.getElementById("projectModal").style.display = "flex";
    }

    function closeModal() {
        document.getElementById("projectModal").style.display = "none";
    }

    function filterProjects() {
        const nameQuery = document.getElementById("searchBox").value.toLowerCase();
        const tagQuery = document.getElementById("tagSearchBox").value.toLowerCase();

        document.querySelectorAll(".project-card").forEach(card => {
            const projectName = card.querySelector("h3")?.innerText.toLowerCase() || "";
            const tag = card.querySelector(".project-tag")?.innerText.toLowerCase() || "";

            const matchesName = projectName.includes(nameQuery);
            const matchesTag = tag.includes(tagQuery);

            card.style.display = (matchesName && matchesTag) ? "block" : "none";
        });
    }

    /*
    function selectOption(element, type) {
        document.querySelectorAll(".option").forEach(option => 
            option.classList.remove("selected")
        );
        element.classList.add("selected");
        selectedType = type;
        
        const imageElement = document.getElementById("exampleImage");
        if (type === "Object Detection") {
            imageElement.src = "./IMG_4698 (1)";
            imageElement.style.display = "block";
        } else if (type === "Instance Segmentation") {
            imageElement.src = "./IMG_4697";
            imageElement.style.display = "block";
        } else {
            imageElement.style.display = "none";
        }
    } */