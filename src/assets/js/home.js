/**
 * -----------------------------------------------------------------------------
 * Slideshow Animation
 * -----------------------------------------------------------------------------
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Observer);

// Инициализация Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => 1 - (1 - t) ** 3,
  smooth: true,
  smoothTouch: false,
  smoothWheel: false,
  normalizeWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Интеграция Lenis с ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

function initializeAnimation() {
  // Slideshow
  const slideshowImages = document.querySelectorAll('.e-slideshow__image');
  const textBlocks = document.querySelectorAll('.e-slideshow__copy');

  if (slideshowImages.length && textBlocks.length) {
    gsap.set(slideshowImages, {
      opacity: (index) => (index === 0 ? 1 : 0),
      rotationY: (index) => (index === 0 ? 0 : -45),
      height: '100%',
    });

    slideshowImages.forEach((image, index) => {
      if (index < slideshowImages.length - 1) {
        const nextText = textBlocks[index + 1];
        const currentImage = slideshowImages[index];
        const nextImage = slideshowImages[index + 1];

        const slideAnimation = gsap.timeline({
          scrollTrigger: {
            trigger: nextText,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.8,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        slideAnimation
          .to(currentImage, {
            opacity: 0,
            rotationY: 45,
            duration: 0.6,
            ease: 'power2.inOut',
          })
          .to(
            nextImage,
            {
              opacity: 1,
              rotationY: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            },
            '-=0.4'
          );
      }
    });

    const slideshow = document.querySelector('.e-slideshow');
    const slideshowImagesContainer = document.querySelector(
      '.e-slideshow__images'
    );

    if (slideshow && slideshowImagesContainer) {
      ScrollTrigger.create({
        trigger: slideshow,
        pin: slideshowImagesContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
      });
    }
  }

  // FAQ
  const messages = document.querySelectorAll('.e-message');

  messages.forEach((message) => {
    // Основная анимация для элемента
    gsap.fromTo(
      message,
      {
        y: 100, // Элемент стартует ниже своей позиции
        opacity: 0, // Невидимый
      },
      {
        y: 0, // Приезжает в свое положение
        opacity: 1, // Становится видимым
        ease: 'power2.out', // Плавная анимация
        duration: 0.6, // Продолжительность анимации
        scrollTrigger: {
          trigger: message, // Анимация активируется для элемента
          start: 'top 80%', // Стартует, когда верх элемента достигает 80% экрана
          end: 'bottom 20%', // Останавливается, когда низ элемента достигает 20% экрана
          toggleActions: 'play none none reverse', // Перематываем назад при прокрутке вверх
        },
      }
    );

    // Анимация для потомков (с задержкой)
    const { children } = message;
    if (children.length > 0) {
      gsap.fromTo(
        children,
        {
          y: 50, // Стартует ниже
          opacity: 0, // Невидимый
        },
        {
          y: 0, // Въезжает в позицию
          opacity: 1, // Становится видимым
          stagger: 0.1, // Задержка между элементами
          ease: 'power2.out', // Плавная анимация
          duration: 0.6, // Продолжительность
          scrollTrigger: {
            trigger: message, // Триггер для дочерних элементов тот же, что и у родителя
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });
}

function destroyAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.globalTimeline.clear();
}

function handleResize() {
  if (window.innerWidth < 1024) {
    destroyAnimations();
  } else {
    initializeAnimation();
  }
}

// Начальная проверка ширины
if (window.innerWidth >= 1024) {
  initializeAnimation();
}

// Слушатель изменения размера окна
window.addEventListener('resize', handleResize);

/**
 * -----------------------------------------------------------------------------
 * Pseudo modal, video
 * -----------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  let recentlyOpened = false;

  /** On phones, show USPs in a modal window instead of a slideshow */
  document
    .querySelectorAll('[data-role="open-modal-alt"]')
    .forEach((button) => {
      button.addEventListener('click', (event) => {
        const targetId = event.currentTarget.getAttribute('data-target');
        const modal = document.getElementById(targetId);

        if (modal && modal.tagName !== 'DIALOG') {
          modal.classList.add('is-open');
          recentlyOpened = true;
          setTimeout(() => {
            recentlyOpened = false;
          }, 100);
        }
      });
    });

  document.addEventListener('click', (event) => {
    const openModal = document.querySelector('.is-open');
    if (!openModal || recentlyOpened) return;

    const closeModalButton = openModal.querySelector(
      '[data-role="close-modal"]'
    );
    const clickOutside = !openModal.contains(event.target);

    if (event.target === closeModalButton || clickOutside) {
      openModal.classList.remove('is-open');
    }
  });

  /** Start videos as they appear in the viewport */
  const videos = document.querySelectorAll('.e-card__video video');

  videos.forEach((video) => {
    ScrollTrigger.create({
      trigger: video,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: () => video.play(),
      onLeave: () => video.pause(),
      onEnterBack: () => video.play(),
      onLeaveBack: () => video.pause(),
    });
  });
});
