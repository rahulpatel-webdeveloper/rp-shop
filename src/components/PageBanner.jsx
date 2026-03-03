import { Link } from 'react-router-dom';

export default function PageBanner({ 
  title, 
  subtitle, 
  description, 
  backgroundImage, 
  buttonText, 
  buttonLink,
  variant = 'default' // 'default' or 'simple'
}) {
  return (
    <section 
      className="page-banner"
      style={{
        backgroundImage: `url('${backgroundImage}')`
      }}
    >
      <div className="page-banner-overlay"></div>
      <div className="page-banner-content">
        <div className="page-banner-inner">
          {subtitle && <p className="page-banner-subtitle">{subtitle}</p>}
          <h1 className="page-banner-title">{title}</h1>
          {description && <p className="page-banner-description">{description}</p>}
          {buttonText && buttonLink && (
            <Link to={buttonLink} className="page-banner-button">
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
