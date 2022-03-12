import { Carousel } from 'bootstrap';

Array.from(document.querySelectorAll('.carousel'))
    .forEach(carousel => new Carousel(carousel));