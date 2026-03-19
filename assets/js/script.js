document.addEventListener('DOMContentLoaded', () => {
    
    // Select all links with hashes (e.g. #about)
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Stop instant jump

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Smooth scroll calculation
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Advanced IntersectionObserver for smooth bottom-up reveal on specific elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
                
                // Clean up animation classes after they finish, restoring original styling (like hover states)
                setTimeout(() => {
                    entry.target.classList.remove('reveal', 'active');
                }, 800);
            }
        });
    }, { threshold: 0.1 });

    // Select all individual text, images, videos to reveal
    const revealElements = document.querySelectorAll(
        `#about h2, #about p, .circle-frame, 
         #works h2, .work-card, 
         #skills h2, .skill-item, 
         .contact-info h2, .contact-info p, .info-item, .contact-form, .contact-footer`
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Add staggered delay based on DOM position for a cascading effect
        el.style.animationDelay = `${(index % 3) * 0.15}s`;
        observer.observe(el);
    });

    // Manually trigger logo animation on page load
    const logoImg = document.querySelector('.logo-img');
    const brandName = document.querySelector('.brand-name');
    if (logoImg) {
        logoImg.style.opacity = '0';
        logoImg.style.animation = 'revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s';
    }
    if (brandName) {
        brandName.style.opacity = '0';
        brandName.style.animation = 'revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s';
    }

    // Web3Forms AJAX Submission (Prevents page redirection)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Visual feedback while sending
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Clean success state
                    submitBtn.textContent = 'Sent!';
                    submitBtn.style.backgroundColor = '#00bcd4';
                    submitBtn.style.color = '#111';
                    submitBtn.style.borderColor = '#00bcd4';
                    submitBtn.style.opacity = '1';
                    
                    contactForm.reset();
                    
                    // Reset button to original state after 4 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.cursor = 'pointer';
                        
                        // Clear inline styles so CSS hover works safely again
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.style.borderColor = '';
                    }, 4000);
                } else {
                    submitBtn.textContent = 'Error. Try Again!';
                    setTimeout(() => { 
                        submitBtn.textContent = originalText; 
                        submitBtn.style.opacity = '1'; 
                        submitBtn.style.cursor = 'pointer'; 
                    }, 3000);
                }
            } catch (error) {
                submitBtn.textContent = 'Network Error';
                setTimeout(() => { 
                    submitBtn.textContent = originalText; 
                    submitBtn.style.opacity = '1'; 
                    submitBtn.style.cursor = 'pointer'; 
                }, 3000);
            }
        });
    }
});