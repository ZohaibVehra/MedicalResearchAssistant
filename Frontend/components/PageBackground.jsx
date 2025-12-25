import bg from '../src/assets/2.jpg'

const PageBackground = () => {
  return (
    <div
      className="fixed inset-0 -z-10 bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-neutral-950/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  )
} 

export default PageBackground