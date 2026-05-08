import React, { useRef, useState } from "react";
import { link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import './Contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from "react-icons/fa";

function Contact() {
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    // Simple validation
    const formData = new FormData(form.current);
    const name = formData.get("user_name");
    const email = formData.get("user_email");
    const message = formData.get("message");

    if (!name || !email || !message) {
      setStatus("❌ Please fill all required fields");
      return;
    }

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          form.current.reset();
        },
        () => {
          setStatus("❌ Failed to send message. Try again.");
        }
      );
  };

  return (
    <section className="contact-section py-5">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-subtitle">Contact Us</span>
          <h2 className="section-title mt-2">Get in Touch</h2>
          <p className="contact-subtext">
            We'd love to hear from you. Send us a message or visit us.
          </p>
        </div>

        <div className="row g-5">

          {/* LEFT SIDE */}
          <div className="col-lg-5">
            <div className="contact-info p-4 h-100">

              <h5 className="mb-4">Contact Info</h5>

              <p><FaMapMarkerAlt /> Chakwal, Punjab, Pakistan</p>
              <p><FaPhone /> +92 300 1234567</p>
              <p><FaEnvelope /> info@restaurant.com</p>
              <p><FaClock /> 10:00 AM - 11:00 PM</p>

              {/* WhatsApp Button */}
              <link
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="btn whatsapp-btn mt-3"
              >
                <FaWhatsapp /> Chat on WhatsApp
              </link>

            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-lg-7">
            <form ref={form} onSubmit={sendEmail} className="contact-form p-4">

              <div className="row g-3">

                <div className="col-md-6">
                  <input type="text" name="user_name" className="form-control" placeholder="Your Name" />
                </div>

                <div className="col-md-6">
                  <input type="email" name="user_email" className="form-control" placeholder="Email Address" />
                </div>

                <div className="col-12">
                  <textarea name="message" className="form-control" rows="5" placeholder="Your Message"></textarea>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100">
                    Send Message
                  </button>
                </div>

                {/* STATUS MESSAGE */}
                {status && (
                  <div className="col-12 text-center mt-2">
                    <p className="form-status">{status}</p>
                  </div>
                )}

              </div>

            </form>
          </div>

        </div>

        {/* GOOGLE MAP */}
        <div className="map-container mt-5">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=chakwal&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "15px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </section>
  );
}

export default Contact;