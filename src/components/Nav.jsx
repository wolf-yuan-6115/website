

export default function Nav() {
  return <nav className="sticky top-0 backdrop-blur-md backdrop-brightness-75">
  <div className="mx-auto max-w-5xl py-2">
    <div className="grid grid-cols-2 py-2 place-items-center">
      <div>
        <a
          href="https://gitlab.com/wolf-yuan"
          className="text-white tabs font-semibold hover:font-bold hover:bg-gray-900"
          >GitLab</a
        >
      </div>
      <div>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="text-white tabs font-semibold hover:font-bold">YouTube</a
        >
      </div>
    </div>
  </div>
</nav>
}


