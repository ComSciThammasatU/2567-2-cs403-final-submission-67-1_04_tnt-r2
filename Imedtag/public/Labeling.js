  const serverUrl = "http://localhost:5000";
  let currentProjectId = null;
  let currentUserId = null;

  const elements = {
    projectName: document.getElementById("projectName"),
    backButton: document.getElementById("backButton"),
    sentToDataset: document.getElementById("sentToDataset"),
    allLabeling: document.getElementById("allLabeling"),
    notLabeling: document.getElementById("notLabeling"),
    alreadyLabeling: document.getElementById("alreadyLabeling"),
    imageUpload: document.getElementById("imageUpload"),
    imagePreview: document.getElementById("imagePreview"),
    errorMessage: document.getElementById("errorMessage"),
    progressBar: document.getElementById("progressBar"),
    imageCount: document.getElementById("imageCount"),
    labelCount: document.getElementById("labelCount"),
    nonLabelCount: document.getElementById("nonLabelCount"),
    creatorName: document.getElementById("creatorName"),
  };

  document.getElementById("menu-upload").addEventListener("click", function () {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
        window.location.href = `Upload.html?id=${projectId}`;
    } else {
        showError("Project ID is missing");
    }
  });

  document.getElementById("menu-dataset").addEventListener("click", function () {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
        window.location.href = `dataset.html?id=${projectId}`;
    } else {
        showError("Project ID is missing");
    }
  });

  document.getElementById("startLabelingBtn").addEventListener("click", function () {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
        window.location.href = `detection.html?id=${projectId}`;
    } else {
        showError("Project ID is missing");
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

  function showError(msg) {
    elements.errorMessage.textContent = msg;
    elements.errorMessage.style.display = msg ? "block" : "none";
  }

  function setActiveButton(button) {
    document.querySelectorAll(".label-buttons button").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  let allImages = []; 

  document.getElementById("allLabeling").addEventListener("click", () => {
      setActiveButton(elements.allLabeling);
      filterImages();
  });

  document.getElementById("notLabeling").addEventListener("click", () => {
      setActiveButton(elements.notLabeling);
      filterImages();
  });

  document.getElementById("alreadyLabeling").addEventListener("click", () => {
      setActiveButton(elements.alreadyLabeling);
      filterImages();
  });

  function updateProgressBar(total, labeled) {
    const percentage = total === 0 ? 0 : (labeled / total) * 100;
    document.getElementById("progressBar").style.width = percentage + "%";
    document.getElementById("imageCount").textContent = `${total} Images`;
    document.getElementById("labelCount").textContent = `${labeled} Labeled`;
    document.getElementById("nonLabelCount").textContent = `${total - labeled} Non-Labeled`;
  }

  function filterImages() {
    const search = elements.searchInput ? elements.searchInput.value.toLowerCase() : '';
    const activeButton = document.querySelector(".label-buttons button.active");
    const active = activeButton ? activeButton.id : "allLabeling";

    const containers = document.querySelectorAll(".image-container");
    
    containers.forEach(container => {
      const imgElement = container.querySelector("img");
      if (!imgElement) return;
      
      const alt = imgElement.alt.toLowerCase();
      const isLabeled = container.dataset.labeled === "true";

      const matchesSearch = search === '' || alt.includes(search);

      let matchesFilter = true;
      if (active === "notLabeling") {
        matchesFilter = !isLabeled;
      } else if (active === "alreadyLabeling") {
        matchesFilter = isLabeled;
      }

      container.style.display = matchesSearch && matchesFilter ? "block" : "none";
    });
  }

  async function loadUserInfo() {
      try {
          const token = localStorage.getItem('token');
          console.log('Token being sent:', token); 
          const response = await fetch(`${serverUrl}/api/user`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (!response.ok) throw new Error('Failed to load user info');
          const user = await response.json();
          console.log('User fetched successfully:', user); 
      } catch (error) {
          console.error('Error loading user info:', error);
      }
  }

  async function loadProjectData(projectId) {
    try {
      const res = await fetch(`${serverUrl}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Failed to load project");

      const project = await res.json();
      elements.projectName.textContent = project.project_name;

      const userRes = await fetch(`${serverUrl}/api/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (userRes.ok) {
        const user = await userRes.json();
        elements.creatorName.textContent = user.name || "Unknown";
      } else {
        elements.creatorName.textContent = "Unknown";
      }
    } catch (err) {
      console.error("Error loading project data:", err);
      showError("Could not load project details");
    }
  }


  async function loadImages(projectId) {
    try {
      const res = await fetch(`${serverUrl}/api/images/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const images = await res.json();
      const container = elements.imagePreview;
      container.innerHTML = "";

      allImages = images; 

      let labeledCount = 0;
      images.forEach((img) => {
        const div = document.createElement("div");
        div.className = "image-container";
        div.dataset.id = img.image_id;
        div.dataset.labeled = img.labeled_status ? "true" : "false";

        const image = document.createElement("img");
        image.src = `${serverUrl}${img.file_path}`;
        image.alt = img.image_name;

        if (img.labeled_status) labeledCount++;

        div.appendChild(image);
        container.appendChild(div);
      });

      updateProgressBar(images.length, labeledCount); 
    } catch (err) {
      showError("Failed to load images");
    }
  }

  window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "login.html");
    currentUserId = jwt_decode(token).userId;
    currentProjectId = getProjectIdFromUrl();

    await loadUserInfo();
    await loadProjectData(currentProjectId);
    await loadImages(currentProjectId);

    elements.backButton.addEventListener("click", () => {
      window.location.href = "CreateProject.html";
    });

    elements.searchInput.addEventListener("keyup", filterImages);
    elements.allLabeling.addEventListener("click", () => {
      setActiveButton(elements.allLabeling);
      filterImages();
    });
    elements.notLabeling.addEventListener("click", () => {
      setActiveButton(elements.notLabeling);
      filterImages();
    });
    elements.alreadyLabeling.addEventListener("click", () => {
      setActiveButton(elements.alreadyLabeling);
      filterImages();
    });
    elements.menuMore.addEventListener("click", (e) => {
      e.preventDefault();
      elements.optionsMenu.style.display =
        elements.optionsMenu.style.display === "block" ? "none" : "block";
    });
    elements.deleteProject.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to delete this project?")) {
        deleteProject(currentProjectId);
      }
    });
    elements.logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  });