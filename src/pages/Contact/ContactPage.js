import React from 'react'

const ContactPage = () => {
  return (
    <div>
        
    <div className="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.365202985466!2d106.69204877485822!3d10.859802889294086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529c17978287d%3A0xec48f5a17b7d5741!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBOZ3V54buFbiBU4bqldCBUaMOgbmggLSBDxqEgc-G7nyBxdeG6rW4gMTI!5e0!3m2!1svi!2s!4v1726309932307!5m2!1svi!2s" width="100%" height="100%" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

    <section className="contact spad">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-md-6">
                    <div className="contact__text">
                        <div className="section-title">
                            <span>Information</span>
                            <h2>Contact Us</h2>
                            <p>As you might expect of a company that began as a high-end interiors contractor, we pay
                                strict attention.</p>
                        </div>
                        <ul>
                            <li>
                                <h4>America</h4>
                                <p>195 E Parker Square Dr, Parker, CO 801 <br />+43 982-314-0958</p>
                            </li>
                            <li>
                                <h4>France</h4>
                                <p>109 Avenue Léon, 63 Clermont-Ferrand <br />+12 345-423-9893</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="contact__form">
                        <form action="#">
                            <div className="row">
                                <div className="col-lg-6">
                                    <input type="text" placeholder="Name"/>
                                </div>
                                <div className="col-lg-6">
                                    <input type="text" placeholder="Email"/>
                                </div>
                                <div className="col-lg-12">
                                    <textarea placeholder="Message"></textarea>
                                    <button type="submit" className="site-btn">Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>



    </div>
  )
}

export default ContactPage