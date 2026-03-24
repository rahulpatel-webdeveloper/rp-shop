import Layout from '../components/Layout';
import PageBanner from '../components/PageBanner';

export default function Contact() {
    return (
        <Layout>
            <PageBanner
              title="Get In Touch"
              subtitle="Contact Us"
              backgroundImage="https://images.unsplash.com/photo-1516534775068-bb57a2b7d9d3?w=1200&h=400&fit=crop&crop=center&q=80&ixlib=rb-4.0.3&auto=format"
            />
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold mb-3 text-dark">We'd Love to Hear From You</h2>
                    <p className="lead text-muted">Have a question? Send us a message and we'll respond shortly.</p>
                </div>

                <form className="d-flex flex-column gap-3 shadow-sm p-4 rounded bg-white border">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Message</label>
                        <textarea
                            className="form-control"
                            rows="5"
                            placeholder="How can we help?"
                        ></textarea>
                    </div>
                    <button type="button" className="btn btn-primary w-100">Send Message</button>
                </form>

                <div className="mt-5 text-center text-muted">
                    <p className="mb-1">Email: rpatel.techark@gmail.com</p>
                    <p className="mb-1">Phone: +91 9876543210</p>
                    <p>Address: Mota, Bardoli, surat Gujarat, India</p>
                </div>
            </div>
        </Layout>
    );
}
