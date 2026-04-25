import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/info.css";

const ContactPage = () => {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! We will contact you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="infoPage">
      <Header showHero={false} />

      <main className="infoMain">
        <div className="container">
          <div className="infoHeader">
            <h2 className="infoTitle">Contact us</h2>
            <div className="infoSubtitle">Weâ€™re here to help.</div>
          </div>

          <div className="infoGrid">
            <div className="infoCard">
              <h3>Reach us</h3>
              <ul>
                <li>Phone: +91-9234458732</li>
                <li>City: Chennai</li>
                <li>Email: support@giftshop.local</li>
              </ul>
              <div className="infoLinkRow">
                <a className="infoBtn" href="tel:+919234458732">
                  Call now
                </a>
                <a className="infoBtn is-secondary" href="mailto:support@giftshop.local">
                  Email
                </a>
              </div>
            </div>

            <div className="infoCard">
              <h3>Send a message</h3>
              <form onSubmit={onSubmit}>
                <label className="infoField">
                  <span className="infoLabel">Name</span>
                  <input className="infoInput" name="name" value={form.name} onChange={onChange} />
                </label>
                <label className="infoField">
                  <span className="infoLabel">Email</span>
                  <input className="infoInput" type="email" name="email" value={form.email} onChange={onChange} />
                </label>
                <label className="infoField">
                  <span className="infoLabel">Message</span>
                  <textarea className="infoTextarea" name="message" value={form.message} onChange={onChange} />
                </label>
                <div className="infoLinkRow">
                  <button className="infoBtn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;

