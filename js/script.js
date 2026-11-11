/**
 * ====================================================================
 * THE ARCHIVE - INTERACTION CONTROLLER
 * Minimalist, responsive, and robust.
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = getSiteConfig();

  populateContent(config);
  initEntry();
  initGallery(config);
  initLetterActions(config);
  initCustomizer(config);

  // Sound toggle button
  const soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.toggle();
    });
  }
});

/**
 * Populate dynamic fields from config
 */
function populateContent(config) {
  const friend = config.friendName || "Nanduuttaaaaaaaaa";
  const initial = config.friendInitials || friend.charAt(0).toUpperCase();

  // Entry Screen
  const entryMonogram = document.getElementById("entry-monogram");
  const entryTitle = document.getElementById("entry-title");
  if (entryMonogram) entryMonogram.textContent = initial;
  if (entryTitle) {
    const prefix = config.entryPrefix || "HAPPY BIRTHDAYYYY";
    entryTitle.innerHTML = `<span class="entry-title-prefix">${prefix}</span><span class="entry-title-name">${friend}.</span>`;
  }

  // Section Heading & Index
  const noteHeading = document.querySelector("#note .section-heading");
  const noteIndex = document.querySelector("#note .section-index");
  if (noteHeading && config.letter?.sectionTitle) {
    noteHeading.textContent = config.letter.sectionTitle;
  }
  if (noteIndex) {
    if (config.letter && config.letter.sectionNum !== undefined) {
      noteIndex.textContent = config.letter.sectionNum;
      noteIndex.style.display = config.letter.sectionNum ? "" : "none";
    }
  }

  // The Letter
  const letterSalutation = document.getElementById("letter-salutation");
  const letterParagraphs = document.getElementById("letter-paragraphs");
  const letterClosing = document.getElementById("letter-closing");
  const letterSignature = document.getElementById("letter-signature");

  if (letterSalutation) letterSalutation.textContent = config.letter?.salutation || `To ${friend},`;
  if (letterClosing) letterClosing.textContent = config.letter?.closing || "Shalyam cheythond";
  if (letterSignature) letterSignature.textContent = config.letter?.signature || config.senderName || "RootFolder";

  if (letterParagraphs && config.letter?.paragraphs) {
    letterParagraphs.innerHTML = "";
    config.letter.paragraphs.forEach(p => {
      const pEl = document.createElement("p");
      pEl.textContent = p;
      letterParagraphs.appendChild(pEl);
    });
  }
}

/**
 * Cinematic Entry Reveal
 */
function initEntry() {
  const entry = document.getElementById("cinematic-entry");
  const enterBtn = document.getElementById("btn-enter");

  if (enterBtn && entry) {
    enterBtn.addEventListener("click", () => {
      document.body.classList.add("entered");
      entry.classList.add("revealed");
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }
}

/**
 * Visual Archive (Gallery & Uploader)
 */
function initGallery(config) {
  const grid = document.getElementById("archive-grid");
  const dropZone = document.getElementById("drop-zone");
  const filePicker = document.getElementById("photo-file-picker");

  // Lightbox elements
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxCounter = document.getElementById("lightbox-counter");

  let photos = config.photos || [];
  let currentPhotoIndex = 0;

  const updateLightbox = () => {
    if (!lightbox || !photos.length) return;
    const item = photos[currentPhotoIndex];
    if (lightboxImg) lightboxImg.src = item.url;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
    }
  };

  const openLightbox = (index) => {
    if (!lightbox || !photos.length) return;
    currentPhotoIndex = (index + photos.length) % photos.length;
    updateLightbox();
    lightbox.classList.add("active");
    if (window.soundEngine) window.soundEngine.playClick();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
  };

  const prevPhoto = () => {
    if (!photos.length) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updateLightbox();
  };

  const nextPhoto = () => {
    if (!photos.length) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updateLightbox();
  };

  const renderGrid = () => {
    if (!grid) return;
    grid.innerHTML = "";

    photos.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "archive-card";

      const aspectStyle = item.aspectRatio ? `style="aspect-ratio: ${item.aspectRatio};"` : "";

      card.innerHTML = `
        <div class="archive-media" ${aspectStyle}>
          <img src="${item.url}" alt="Frame ${index + 1}" class="archive-img" />
        </div>
      `;

      const imgEl = card.querySelector(".archive-img");
      const mediaEl = card.querySelector(".archive-media");
      if (imgEl && mediaEl) {
        if (imgEl.complete && imgEl.naturalWidth && imgEl.naturalHeight) {
          mediaEl.style.aspectRatio = `${imgEl.naturalWidth} / ${imgEl.naturalHeight}`;
        } else {
          imgEl.addEventListener("load", () => {
            if (imgEl.naturalWidth && imgEl.naturalHeight) {
              mediaEl.style.aspectRatio = `${imgEl.naturalWidth} / ${imgEl.naturalHeight}`;
            }
          });
        }
      }

      card.addEventListener("click", () => {
        openLightbox(index);
      });

      grid.appendChild(card);
    });
  };

  if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); prevPhoto(); });
  if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); nextPhoto(); });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "ArrowLeft") prevPhoto();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "Escape") closeLightbox();
  });

  // Downscale image to max 1200px before storing to avoid localStorage quota issues
  const processImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;

    for (const file of valid) {
      const dataUrl = await processImageFile(file);
      photos.unshift({
        url: dataUrl
      });
    }

    config.photos = photos;
    config.customUploaded = true;
    saveSiteConfig(config);
    renderGrid();
    showToast("Added photos to archive.");
  };

  if (filePicker) {
    filePicker.addEventListener("change", (e) => {
      handleFiles(e.target.files);
    });
  }

  if (dropZone) {
    ["dragenter", "dragover"].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--accent)";
      });
    });

    ["dragleave", "drop"].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "";
      });
    });

    dropZone.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  renderGrid();
}

/**
 * Letter Toolbar Actions
 */
function initLetterActions(config) {
  const copyBtn = document.getElementById("btn-copy-note");
  const printBtn = document.getElementById("btn-print-note");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const paragraphs = config.letter?.paragraphs || [];
      const text = `${config.letter?.salutation || "To Sarah,"}\n\n${paragraphs.join("\n\n")}\n\n${config.letter?.closing || ""}\n${config.senderName || ""}`;
      navigator.clipboard.writeText(text).then(() => {
        showToast("Letter copied to clipboard.");
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

/**
 * Discreet Customizer Modal
 */
function initCustomizer(config) {
  const modal = document.getElementById("edit-modal");
  const openBtn = document.getElementById("btn-open-edit");
  const closeBtn = document.getElementById("btn-close-edit");
  const saveBtn = document.getElementById("btn-save-edit");
  const resetBtn = document.getElementById("btn-reset-edit");

  const inputName = document.getElementById("input-friend-name");
  const inputDate = document.getElementById("input-bday-date");
  const inputEdition = document.getElementById("input-edition");
  const inputSender = document.getElementById("input-sender-name");
  const inputLetter = document.getElementById("input-letter");
  const inputBgVideo = document.getElementById("input-bg-video");
  const bgVideoStatus = document.getElementById("bg-video-status");
  const bgVideoEl = document.getElementById("bg-video");

  if (inputBgVideo && bgVideoEl) {
    inputBgVideo.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        bgVideoEl.src = url;
        bgVideoEl.play().then(() => {
          bgVideoEl.classList.add("playing");
          if (bgVideoStatus) bgVideoStatus.textContent = `Active: ${file.name}`;
          showToast("Loaded background video.");
        }).catch(err => {
          console.warn("Autoplay notice:", err);
        });
      }
    });
  }

  const loadForm = (cfg) => {
    if (inputName) inputName.value = cfg.friendName || "";
    if (inputDate) inputDate.value = cfg.birthdayDate || "";
    if (inputEdition) inputEdition.value = cfg.editionYear || "";
    if (inputSender) inputSender.value = cfg.senderName || "";
    if (inputLetter && cfg.letter?.paragraphs) {
      inputLetter.value = cfg.letter.paragraphs.join("\n\n");
    }
  };

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      loadForm(getSiteConfig());
      modal.classList.add("active");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const updated = getSiteConfig();
      if (inputName.value.trim()) updated.friendName = inputName.value.trim();
      if (inputDate.value.trim()) updated.birthdayDate = inputDate.value.trim();
      if (inputEdition.value.trim()) updated.editionYear = inputEdition.value.trim();
      if (inputSender.value.trim()) updated.senderName = inputSender.value.trim();
      if (inputLetter.value.trim()) {
        updated.letter.paragraphs = inputLetter.value.trim().split("\n\n").filter(p => p.trim());
      }

      saveSiteConfig(updated);
      populateContent(updated);
      modal.classList.remove("active");
      showToast("Tribute details updated.");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset to default configuration?")) {
        try { localStorage.clear(); } catch(e) {}
        window.location.reload();
      }
    });
  }
}

/**
 * Toast Notice Popup
 */
function showToast(msg) {
  const notice = document.getElementById("toast-notice");
  if (!notice) return;
  notice.textContent = msg;
  notice.classList.add("show");
  setTimeout(() => {
    notice.classList.remove("show");
  }, 2400);
}
