function startHomepageAnimation() {
    const heroSection = document.querySelector('.hero-section');
    const svgPath = document.querySelector('#wavy-line-svg path');
    const navBar = document.querySelector('.navbar');

    if (!heroSection || !svgPath || !navBar) return;

    const pathLength = svgPath.getTotalLength();
    svgPath.style.strokeDasharray = pathLength;
    svgPath.style.strokeDashoffset = pathLength;
    
    const blurProxy = { value: 0 };

    const tl = gsap.timeline({
        onComplete: () => {
            if (typeof initializePage !== 'undefined') {
                initializePage();
            }
            navBar.classList.add('scrolled');
        }
    });

    tl
        .to(blurProxy, {
            value: 5,
            duration: 2,
            ease: "power1.inOut",
            onUpdate: () => {
                heroSection.style.setProperty('--hero-bg-blur', `${blurProxy.value}px`);
            }
        }, 0)

        .fromTo('.logo', 
            { y: -50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            0
        )
        .fromTo('.nav-links a', 
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.4)', stagger: 0.1 },
            "-=0.6"
        )
        .to(svgPath, 
            { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, 
            0.1
        )
        .fromTo('.hero-content h1', 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            0.3
        )
        .fromTo('.hero-content p', 
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            "-=0.8"
        )
        .fromTo('.hero-content .btn',
            { y: 60, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            "-=0.8"
        );
}