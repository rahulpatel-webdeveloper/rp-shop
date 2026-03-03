import '../styles/FeaturesSection.css';

export default function FeaturesSection() {
    const features = [
        {
            id: 1,
            icon: '📦',
            title: 'Product Packing',
            description: 'Secure packaging ensures your products arrive in perfect condition every time.'
        },
        {
            id: 2,
            icon: '📞',
            title: '24x7 Support',
            description: 'Our customer support team is always available to assist you with any queries.'
        },
        {
            id: 3,
            icon: '🚚',
            title: 'Delivery in 5 Days',
            description: 'Fast and reliable delivery service to get your orders to your doorstep.'
        },
        {
            id: 4,
            icon: '🔒',
            title: 'Payment Secure',
            description: 'Your transactions are protected with industry-leading security measures.'
        }
    ];

    return (
        <section className="features-section py-5">
            <div className="container">
                <div className="row g-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="col-lg-3 col-md-6 col-12">
                            <div className="feature-box">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h4 className="feature-title">{feature.title}</h4>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
