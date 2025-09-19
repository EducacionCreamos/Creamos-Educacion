// Variables globales
let isAdminMode = false;
let adminKeySequence = [];

// ==================== NUEVO SISTEMA DE COMENTARIOS GOOGLE SHEETS ====================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWk_2xU26GEGYmZf53AYPjzaQVJfQ3FmRAdxMmCIhTidwe3qjeVrqwIKZoXzfx_NB7/exec';
let selectedRating = 0;
let commentsLoaded = false;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// INICIALIZACIÓN DE APLICACIÓN (SIN FUNCIONES DE COMENTARIOS LOCALES)
function initializeApp() {
    initPageLoader();
    initNavbar();
    initDropdowns();
    initAdminMode();
    initScrollAnimations();
    initMobileMenu();
    
    // NUEVO: Inicializar sistema de comentarios Google Sheets
    setTimeout(() => {
        initializeCommentsSystem();
    }, 1000);
}

// ==================== FUNCIONES ORIGINALES MANTENIDAS ====================
function initPageLoader() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const pageLoader = document.getElementById('pageLoader');
            if (pageLoader) {
                pageLoader.classList.add('hidden');
            }
        }, 1500);
    });
}

function initNavbar() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

function initDropdowns() {
    const quickAccessDropdowns = document.querySelectorAll('.dropdown');
    
    quickAccessDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (button && content) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                quickAccessDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        const otherContent = otherDropdown.querySelector('.dropdown-content');
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    }
                });
                
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
    
    document.addEventListener('click', function(e) {
        quickAccessDropdowns.forEach(dropdown => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content && !dropdown.contains(e.target)) {
                content.style.display = 'none';
            }
        });
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

function showInscripcionesModal() {
    const modal = document.getElementById('inscripcionesModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeInscripcionesModal() {
    const modal = document.getElementById('inscripcionesModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function openFormulario() {
    closeInscripcionesModal();
    
    setTimeout(() => {
        const modal = document.getElementById('formularioModal');
        if (modal) {
            const embedUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeFZdSWzURjpBqSzrpt_SEPI76CkNze6pAR_DCwFUEtXDb-Zw/viewform?embedded=true';
            
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.src = embedUrl;
            }
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }, 300);
}

function closeFormularioModal() {
    const modal = document.getElementById('formularioModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'inscripcionesModal') {
            closeInscripcionesModal();
        } else if (e.target.id === 'formularioModal') {
            closeFormularioModal();
        }
    }
});

function showHome() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('servicesSection').classList.remove('active');
    document.getElementById('programSection').classList.remove('active');
    window.scrollTo(0, 0);
}

function showServices(plan) {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('programSection').classList.remove('active');
    
    const servicesSection = document.getElementById('servicesSection');
    const servicesTitle = document.getElementById('servicesTitle');
    const notasLink = document.getElementById('notasLink');
    const tareasLink = document.getElementById('tareasLink');
    
    if (servicesTitle) servicesTitle.textContent = `Servicios del Plan ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
    
    if (plan === 'diario') {
        if (notasLink) notasLink.href = 'https://maestrocreamos.github.io/NOTASPLANDIARIO.github.io/';
        if (tareasLink) tareasLink.href = 'https://maestrocreamos.github.io/TAREASDIARIO.github.io/';
    } else if (plan === 'domingo') {
        if (notasLink) notasLink.href = 'https://maestrocreamos.github.io/NOTASDOMINGO.github.io/';
        if (tareasLink) tareasLink.href = 'https://maestrocreamos.github.io/TAREADOMINGO.github.io/';
    }
    
    if (servicesSection) {
        servicesSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function showProgram() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('servicesSection').classList.remove('active');
    document.getElementById('programSection').classList.add('active');
    window.scrollTo(0, 0);
}

function showPhotos(plan) {
    showNotification(`Galería del Plan ${plan.charAt(0).toUpperCase() + plan.slice(1)} próximamente disponible`, 'info');
}

function showComingSoon(service) {
    alert(`${service}\n\nEsta sección estará disponible próximamente. Por favor mantente atento a nuestras actualizaciones.\n\nPara más información, contáctanos por WhatsApp.`);
}

function initAdminMode() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            toggleAdminMode();
        }
    });
}

function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    
    const adminIndicator = document.getElementById('adminIndicator');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    if (isAdminMode) {
        if (adminIndicator) adminIndicator.style.display = 'flex';
        deleteButtons.forEach(btn => btn.classList.add('visible'));
        showNotification('Modo Administrador Activado', 'success');
    } else {
        if (adminIndicator) adminIndicator.style.display = 'none';
        deleteButtons.forEach(btn => btn.classList.remove('visible'));
        showNotification('Modo Usuario Normal', 'info');
    }
}

function deactivateAdminMode() {
    isAdminMode = false;
    const adminIndicator = document.getElementById('adminIndicator');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    if (adminIndicator) adminIndicator.style.display = 'none';
    deleteButtons.forEach(btn => btn.classList.remove('visible'));
    showNotification('Modo Administrador Desactivado', 'info');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('successNotification');
    const messageEl = document.getElementById('successMessage');
    
    if (!notification || !messageEl) return;
    
    messageEl.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification(type = 'success') {
    const notification = document.getElementById('successNotification');
    if (notification) {
        notification.classList.remove('show');
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .program-card, .feature-item, .review-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function showPreinscripciones() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        const response = confirm('¡Excelente decisión! \n\n ¿Qué modalidad te interesa?\n\n→ Presiona "Aceptar" para Plan Diario (Mujeres)\n Presiona "Cancelar" para Plan Domingo (Hombres)');
        
        if (response) {
            window.open('https://wa.me/50255709214?text=Hola,%20estoy%20interesada%20en%20el%20Plan%20Diario%20de%20Educación%20Acelerada.%20¿Podrían%20darme%20más%20información?', '_blank');
        } else {
            window.open('https://wa.me/50244160597?text=Hola,%20estoy%20interesado%20en%20el%20Plan%20Domingo%20de%20Educación%20Acelerada.%20¿Podrían%20darme%20más%20información?', '_blank');
        }
    } else {
        showInscripcionesModal();
    }
}

window.addEventListener('load', function() {
    if (performance && performance.now) {
        console.log('Página cargada en:', Math.round(performance.now()), 'ms');
    }
});

window.addEventListener('beforeunload', function() {
    document.body.style.overflow = 'auto';
});

// ==================== NUEVO SISTEMA DE COMENTARIOS GOOGLE SHEETS ====================

function initializeCommentsSystem() {
    if (commentsLoaded) return;
    
    console.log('🚀 Inicializando sistema de comentarios Google Sheets...');
    
    // Inicializar sistema de estrellas
    initRatingSystem();
    
    // Cargar comentarios y estadísticas
    loadReviews();
    updateRatingSummary();
    
    commentsLoaded = true;
    console.log('✅ Sistema de comentarios inicializado');
}

function initRatingSystem() {
    const starInputs = document.querySelectorAll('.star-input');
    
    starInputs.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            updateStarDisplay();
            updateRatingText();
            
            this.classList.add('star-animation');
            setTimeout(() => {
                this.classList.remove('star-animation');
            }, 500);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    const ratingInput = document.getElementById('ratingInput');
    if (ratingInput) {
        ratingInput.addEventListener('mouseleave', function() {
            updateStarDisplay();
        });
    }
}

function highlightStars(rating) {
    const starInputs = document.querySelectorAll('.star-input');
    starInputs.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.innerHTML = '★';
        } else {
            star.classList.remove('active');
            star.innerHTML = '☆';
        }
    });
}

function updateStarDisplay() {
    const starInputs = document.querySelectorAll('.star-input');
    starInputs.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
            star.innerHTML = '★';
        } else {
            star.classList.remove('active');
            star.innerHTML = '☆';
        }
    });
}

function updateRatingText() {
    const ratingText = document.getElementById('ratingText');
    const ratings = {
        0: 'Selecciona una calificación',
        1: 'Muy malo - 1 estrella',
        2: 'Malo - 2 estrellas',
        3: 'Regular - 3 estrellas',
        4: 'Bueno - 4 estrellas',
        5: 'Excelente - 5 estrellas'
    };
    
    if (ratingText) {
        ratingText.textContent = ratings[selectedRating];
    }
}

async function submitReview() {
    const name = document.getElementById('reviewName')?.value?.trim();
    const comment = document.getElementById('reviewComment')?.value?.trim();
    
    // Validaciones
    if (!name || name.length < 2) {
        showNotification('Por favor ingresa tu nombre (mínimo 2 caracteres)', 'error');
        return;
    }
    
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
        showNotification('Por favor selecciona una calificación', 'error');
        return;
    }
    
    if (!comment || comment.length < 10) {
        showNotification('El comentario debe tener al menos 10 caracteres', 'error');
        return;
    }
    
    if (comment.length > 500) {
        showNotification('El comentario no puede tener más de 500 caracteres', 'error');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('button[onclick*="submitReview"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '🔄 Enviando...';
        }
        
        const reviewData = {
            action: 'save_comment',
            nombre: name,
            calificacion: selectedRating,
            comentario: comment
        };
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('¡Gracias por tu reseña! Se ha publicado exitosamente', 'success');
            clearReviewForm();
            
            // Recargar comentarios y estadísticas
            setTimeout(() => {
                loadReviews();
                updateRatingSummary();
            }, 1000);
            
        } else {
            showNotification('Error: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('❌ Error enviando comentario:', error);
        showNotification('Error de conexión. Inténtalo nuevamente.', 'error');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('button[onclick*="submitReview"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📝 Publicar Reseña';
        }
    }
}

async function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');
    
    if (!reviewsList) return;
    
    try {
        reviewsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #3498db;">🔄 Cargando comentarios...</div>';
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_comments`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.comments) {
            const comments = data.data.comments;
            
            if (comments.length === 0) {
                reviewsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #7f8c8d;">📝 No hay comentarios aún. ¡Sé el primero!</div>';
                if (noReviews) noReviews.style.display = 'block';
            } else {
                if (noReviews) noReviews.style.display = 'none';
                reviewsList.innerHTML = '';
                
                comments.forEach(comment => {
                    const reviewElement = createReviewElement(comment);
                    reviewsList.appendChild(reviewElement);
                });
            }
            
            console.log('✅ Comentarios cargados:', comments.length);
        } else {
            throw new Error('Error obteniendo comentarios');
        }
        
    } catch (error) {
        console.error('❌ Error cargando comentarios:', error);
        reviewsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #e74c3c;">❌ Error cargando comentarios</div>';
    }
}

function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    
    const stars = '★'.repeat(review.calificacion) + '☆'.repeat(5 - review.calificacion);
    
    reviewDiv.innerHTML = `
        <div class="review-header">
            <div>
                <div class="review-name">${escapeHtml(review.nombre)}</div>
                <div class="review-date">${review.fecha}</div>
            </div>
            <div class="review-rating">${stars}</div>
        </div>
        <div class="review-comment">${escapeHtml(review.comentario)}</div>
    `;
    
    setTimeout(() => {
        reviewDiv.classList.add('review-submitted');
    }, 100);
    
    return reviewDiv;
}

async function updateRatingSummary() {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_stats`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const stats = data.data;
            
            const averageRatingEl = document.getElementById('averageRating');
            const averageStarsEl = document.getElementById('averageStars');
            const totalReviewsEl = document.getElementById('totalReviews');
            
            if (averageRatingEl) {
                averageRatingEl.textContent = stats.total > 0 ? stats.promedio.toFixed(1) : '0.0';
            }
            
            if (totalReviewsEl) {
                totalReviewsEl.textContent = stats.total;
            }
            
            if (averageStarsEl && stats.total > 0) {
                const fullStars = Math.floor(stats.promedio);
                const hasHalfStar = (stats.promedio % 1) >= 0.5;
                
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= fullStars) {
                        starsHtml += '<span class="star filled">★</span>';
                    } else if (i === fullStars + 1 && hasHalfStar) {
                        starsHtml += '<span class="star filled">★</span>';
                    } else {
                        starsHtml += '<span class="star">☆</span>';
                    }
                }
                averageStarsEl.innerHTML = starsHtml;
            } else if (averageStarsEl) {
                averageStarsEl.innerHTML = '☆☆☆☆☆';
            }
            
            console.log('✅ Estadísticas actualizadas:', stats);
        }
    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
    }
}

function clearReviewForm() {
    const nameInput = document.getElementById('reviewName');
    const commentInput = document.getElementById('reviewComment');
    
    if (nameInput) nameInput.value = '';
    if (commentInput) commentInput.value = '';
    
    selectedRating = 0;
    updateStarDisplay();
    updateRatingText();
}

console.log('✅ Script CREAMOS con Google Sheets cargado exitosamente');

// ==================== CORRECCIÓN CORS - SISTEMA DE COMENTARIOS ====================
// Agregar estas funciones a tu script.js DESPUÉS del código existente

// Nueva función para enviar comentarios sin CORS
async function submitReviewCORS() {
    const name = document.getElementById('reviewName')?.value?.trim();
    const comment = document.getElementById('reviewComment')?.value?.trim();
    
    // Validaciones (mantener las mismas)
    if (!name || name.length < 2) {
        showNotification('Por favor ingresa tu nombre (mínimo 2 caracteres)', 'error');
        return;
    }
    
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
        showNotification('Por favor selecciona una calificación', 'error');
        return;
    }
    
    if (!comment || comment.length < 10) {
        showNotification('El comentario debe tener al menos 10 caracteres', 'error');
        return;
    }
    
    if (comment.length > 500) {
        showNotification('El comentario no puede tener más de 500 caracteres', 'error');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('button[onclick*="submitReview"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '🔄 Enviando...';
        }
        
        // Usar JSONP para evitar CORS
        await submitWithJSONP(name, selectedRating, comment);
        
        showNotification('¡Gracias por tu reseña! Se ha publicado exitosamente', 'success');
        clearReviewForm();
        
        // Recargar comentarios y estadísticas
        setTimeout(() => {
            loadReviews();
            updateRatingSummary();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error enviando comentario:', error);
        showNotification('Error enviando comentario: ' + error.message, 'error');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('button[onclick*="submitReview"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📝 Publicar Reseña';
        }
    }
}

// Función para enviar datos usando JSONP (evita CORS)
function submitWithJSONP(nombre, calificacion, comentario) {
    return new Promise((resolve, reject) => {
        // Crear parámetros para URL
        const params = new URLSearchParams({
            action: 'save_comment',
            nombre: nombre,
            calificacion: calificacion,
            comentario: comentario,
            callback: 'handleCommentResponse'
        });
        
        // Crear callback global
        window.handleCommentResponse = function(response) {
            // Limpiar
            document.body.removeChild(script);
            delete window.handleCommentResponse;
            
            if (response.success) {
                resolve(response);
            } else {
                reject(new Error(response.message));
            }
        };
        
        // Crear script tag para JSONP
        const script = document.createElement('script');
        script.onerror = function() {
            document.body.removeChild(script);
            delete window.handleCommentResponse;
            reject(new Error('Error de conexión'));
        };
        
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
        document.body.appendChild(script);
        
        // Timeout después de 10 segundos
        setTimeout(() => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
                delete window.handleCommentResponse;
                reject(new Error('Timeout - el servidor no respondió'));
            }
        }, 10000);
    });
}

// Función mejorada para cargar comentarios (con mejor manejo de errores)
async function loadReviewsImproved() {
    const reviewsList = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');
    
    if (!reviewsList) return;
    
    try {
        reviewsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #3498db;">🔄 Cargando comentarios...</div>';
        
        // Intentar con fetch normal primero
        let response;
        let data;
        
        try {
            response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_comments`, {
                method: 'GET',
                mode: 'cors'
            });
            data = await response.json();
        } catch (corsError) {
            console.log('⚠️ CORS bloqueado, intentando con JSONP...');
            // Si falla por CORS, usar JSONP
            data = await loadWithJSONP('get_comments');
        }
        
        if (data.success && data.data && data.data.comments) {
            const comments = data.data.comments;
            
            if (comments.length === 0) {
                reviewsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #7f8c8d;">📝 No hay comentarios aún. ¡Sé el primero!</div>';
                if (noReviews) noReviews.style.display = 'block';
            } else {
                if (noReviews) noReviews.style.display = 'none';
                reviewsList.innerHTML = '';
                
                comments.forEach(comment => {
                    const reviewElement = createReviewElement(comment);
                    reviewsList.appendChild(reviewElement);
                });
            }
            
            console.log('✅ Comentarios cargados:', comments.length);
        } else {
            throw new Error(data.message || 'Error obteniendo comentarios');
        }
        
    } catch (error) {
        console.error('❌ Error cargando comentarios:', error);
        reviewsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #e74c3c;">
                ❌ Error cargando comentarios
                <br><small>Detalles: ${error.message}</small>
                <br><button onclick="loadReviews()" style="margin-top: 10px; padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Reintentar</button>
            </div>
        `;
    }
}

// Función para cargar datos con JSONP
function loadWithJSONP(action) {
    return new Promise((resolve, reject) => {
        const callbackName = 'handleLoadResponse_' + Date.now();
        
        window[callbackName] = function(response) {
            document.body.removeChild(script);
            delete window[callbackName];
            resolve(response);
        };
        
        const script = document.createElement('script');
        script.onerror = function() {
            document.body.removeChild(script);
            delete window[callbackName];
            reject(new Error('Error de conexión con JSONP'));
        };
        
        script.src = `${GOOGLE_SCRIPT_URL}?action=${action}&callback=${callbackName}`;
        document.body.appendChild(script);
        
        setTimeout(() => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
                delete window[callbackName];
                reject(new Error('Timeout cargando datos'));
            }
        }, 10000);
    });
}

// Función mejorada para estadísticas
async function updateRatingSummaryImproved() {
    try {
        let data;
        
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_stats`);
            data = await response.json();
        } catch (corsError) {
            console.log('⚠️ CORS bloqueado para estadísticas, usando JSONP...');
            data = await loadWithJSONP('get_stats');
        }
        
        if (data.success && data.data) {
            const stats = data.data;
            
            const averageRatingEl = document.getElementById('averageRating');
            const averageStarsEl = document.getElementById('averageStars');
            const totalReviewsEl = document.getElementById('totalReviews');
            
            if (averageRatingEl) {
                averageRatingEl.textContent = stats.total > 0 ? stats.promedio.toFixed(1) : '0.0';
            }
            
            if (totalReviewsEl) {
                totalReviewsEl.textContent = stats.total;
            }
            
            if (averageStarsEl && stats.total > 0) {
                const fullStars = Math.floor(stats.promedio);
                const hasHalfStar = (stats.promedio % 1) >= 0.5;
                
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= fullStars) {
                        starsHtml += '<span class="star filled">★</span>';
                    } else if (i === fullStars + 1 && hasHalfStar) {
                        starsHtml += '<span class="star filled">★</span>';
                    } else {
                        starsHtml += '<span class="star">☆</span>';
                    }
                }
                averageStarsEl.innerHTML = starsHtml;
            } else if (averageStarsEl) {
                averageStarsEl.innerHTML = '☆☆☆☆☆';
            }
            
            console.log('✅ Estadísticas actualizadas:', stats);
        }
    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        // Mostrar valores por defecto en caso de error
        const averageRatingEl = document.getElementById('averageRating');
        const totalReviewsEl = document.getElementById('totalReviews');
        const averageStarsEl = document.getElementById('averageStars');
        
        if (averageRatingEl) averageRatingEl.textContent = '0.0';
        if (totalReviewsEl) totalReviewsEl.textContent = '0';
        if (averageStarsEl) averageStarsEl.innerHTML = '☆☆☆☆☆';
    }
}

// ==================== REEMPLAZAR FUNCIONES ORIGINALES ====================

// Reemplazar función de envío original
function submitReview() {
    submitReviewCORS();
}

// Reemplazar función de carga original
function loadReviews() {
    loadReviewsImproved();
}

// Reemplazar función de estadísticas original
function updateRatingSummary() {
    updateRatingSummaryImproved();
}

console.log('✅ Correcciones CORS aplicadas');