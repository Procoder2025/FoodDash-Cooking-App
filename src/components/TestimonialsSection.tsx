"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { testimonials } from "@/data/restaurants";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section style={{ width: "100%", padding: "80px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 50 }}
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            style={{
              display: "inline-block", background: "#fffbeb", color: "#b45309",
              padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600, marginBottom: 12,
            }}
          >
            <Star size={12} fill="#f59e0b" color="#f59e0b" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            Customer Love
          </motion.span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>
            What Our Customers Say
          </h2>
          <p style={{ color: "#6b7280", fontSize: 17, maxWidth: 420, margin: "0 auto" }}>
            Real reviews from real food lovers
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          pagination={{ clickable: true }}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          style={{ paddingBottom: 50 }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={t.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
                style={{
                  background: "#f9fafb", borderRadius: 20, padding: 28,
                  border: "1px solid #f3f4f6", height: "100%",
                  cursor: "default",
                }}
              >
                <Quote size={22} color="#16a34a" style={{ opacity: 0.3, marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <motion.span
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + j * 0.08 }}
                    >
                      <Star size={14} color={j < t.rating ? "#fbbf24" : "#e5e7eb"} fill={j < t.rating ? "#fbbf24" : "none"} />
                    </motion.span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, marginBottom: 20 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={t.avatar} alt={t.name}
                    style={{ width: 42, height: 42, borderRadius: 12, objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.location}</div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
