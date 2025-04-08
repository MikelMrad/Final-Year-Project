'use client'
import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import styles from "./style.module.css"
import image1 from "../../static/banner1.jpg"
import image2 from "../../static/banner2.jpg"
import Image from "next/image"


export default function Banner() {
  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }
  const slides = [
    {
      id: 1,
      image: image1,
      title: "Get Your Products With Up To 50%",
      description:
        "Click Here!! ",
    },
    {
      id: 2,
      image: image2,
      title: "Checkout Our New Arrivals",
      description:
      "Click Here!! ",
    },
  ]

  return (
    <div className={styles.bannerContainer}>
    {slides.length === 0 ? (
      <h4>No Images Available</h4>
    ) : (
      <div className={styles.bannerSlider}>
        <Slider {...settings}>
          {slides.map((slide) => (
            <div className={styles.bannerSlide} key={slide.id}>
              <div className={styles.bannerImageContainer}>
                <Image
                  className={styles.bannerImage}
                  loading="eager"
                  src={slide.image}
                  alt={`Banner image: ${slide.id}`}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    )}
  </div>
  )
}