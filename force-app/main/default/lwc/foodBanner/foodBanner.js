import { LightningElement,track  } from 'lwc';
export default class FoodBanner extends LightningElement {
    @track currentIndex = 0;
    @track buttonLabel = 'Stop auto-play';
    @track buttonIcon = '/assets/icons/utility-sprite/svg/symbols.svg#pause';
    autoPlay = true;
    autoPlayInterval;

    connectedCallback() {
        this.startAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 3000); // Change slide every 3 seconds
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    toggleAutoplay() {
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.buttonLabel = 'Start auto-play';
            this.buttonIcon = '/assets/icons/utility-sprite/svg/symbols.svg#play';
        } else {
            this.startAutoPlay();
            this.buttonLabel = 'Stop auto-play';
            this.buttonIcon = '/assets/icons/utility-sprite/svg/symbols.svg#pause';
        }
        this.autoPlay = !this.autoPlay;
    }

    nextSlide() {
        const totalSlides = this.template.querySelectorAll('.slds-carousel__panel').length;
        this.currentIndex = (this.currentIndex + 1) % totalSlides;
        this.updateCarousel();
    }

    updateCarousel() {
        const panels = this.template.querySelector('.slds-carousel__panels');
        const indicators = this.template.querySelectorAll('.slds-carousel__indicator-action');

        panels.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('slds-is-active');
                indicator.setAttribute('aria-selected', 'true');
            } else {
                indicator.classList.remove('slds-is-active');
                indicator.setAttribute('aria-selected', 'false');
            }
        });
    }

    handleIndicatorClick(event) {
        const targetIndex = parseInt(event.currentTarget.getAttribute('data-slide-to'), 10);
        this.currentIndex = targetIndex;
        this.updateCarousel();
    }
}