import { useState } from 'react';
import BG from '../assets/ContactBG.jpg';
import './ContactPage.css';

export default function ContactForm() {
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async () => {
    setResult("Sending....");
    
    const submitData = new FormData();
    submitData.append("access_key", "acebff02-6c2e-4120-af81-ca4bc03aea5b");
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("contact", formData.contact);
    submitData.append("message", formData.message);
    
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: submitData
    });
    
    const data = await response.json();
    
    if (data.success) {
      setResult("Form Submitted Successfully");
      setFormData({ name: '', email: '', contact: '', message: '' });
    } else {
      setResult("Error");
    }
  };

  const getResultClass = () => {
    if (result.includes('Success')) return 'result-message result-success';
    if (result.includes('Error')) return 'result-message result-error';
    return 'result-message result-pending';
  };

  return (
    <div className="contact-container">
      <div 
        className="contact-background"
        style={{ backgroundImage: `url(${BG})` }}
      ></div>
      
      <div className="contact-form-wrapper">
        <div className="contact-header">
          <h2 className="contact-title">Contact Us</h2>
        </div>
        
        <div>
          <div className="form-row">
            <div>
              <label className="form-label-name">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label-contact">
                Phone
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+1 234 567 8901"
                required
                className="form-input-phone"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="form-input-email"
            />
          </div>

          <div className="form-group-message">
            <label className="form-label-message">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you're thinking..."
              rows="3"
              className="form-textarea"
            />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="submit-button"
          >
            <div className="submit-name">
            Send Message
            </div>
          </button>

          {result && (
            <div className={getResultClass()}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}