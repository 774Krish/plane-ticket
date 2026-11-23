import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PageHead({ title, subtitle, image }) {
  return (
    <section
      className="page-head"
      style={
        image
          ? { backgroundImage: `url('${image}')` }
          : { background: 'linear-gradient(120deg, #22303f, #16202c)' }
      }
    >
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span>{title}</span>
        </nav>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}
