import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Slider.css';

const SliderComponent = () => {
   const images = [
      'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/BANNER%20(2).png',
      'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/CVO-T1-1100x220.jpg',
      'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Vcu01VpymXxg6EtnOaA30ss1hEJKioiF_1721893835____6a876215f94305f140826c1af20c28ef.png',
   ];

   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: true,
   };

   return (
      <div className="slider-container">
         <Slider {...settings}>
            {images.map((image, index) => (
               <div key={index}>
                  <img src={image} alt={`Slide ${index + 1}`} className="slide-image" />
               </div>
            ))}
         </Slider>
      </div>
   );
};

export default SliderComponent;
